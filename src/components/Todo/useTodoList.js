import firebase from 'firebase';
import { useStore } from 'vuex';
import { ref } from 'vue';
export default function useTodoList() {
  const store = useStore();
  const $firestore = firebase.firestore();
  const $analytics = firebase.analytics();
  const priorityTable = {
    High: 0,
    Mid: 1,
    Low: 2,
  };
  const tablePriority = Object.keys(priorityTable).reduce((acc, cur) => {
    acc[priorityTable[cur]] = cur;
    return acc;
  }, []);

  const todoList = ref([]);
  const prDrawer = ref(false);

  //FIXME: curIndex를 사용하지 않는 방법으로 priority 설정할 수 있도록 수정해야 함
  let curIndex = null;

  const fetchTodoList = async (status, date) => {
    store.commit('base/setLoading', true);
    const { uid } = store.state.user;
    if (uid === null) {
      return [];
    }
    try {
      let query = $firestore.collection('users').doc(uid).collection('todoListItem').where('status', '==', status);
      if (date instanceof Date) {
        const beginTime = new Date(date.toDateString());
        const nextDay = beginTime.getTime() + 24 * 60 * 60 * 1000;
        const endTime = new Date(nextDay);
        if (status === 1) {
          query = query.where('createAt', '>', beginTime).where('createAt', '<', endTime);
        } else if (status === 2) {
          query = query.where('lastDoneAt', '>', beginTime).where('lastDoneAt', '<', endTime);
        }
      }
      const todoListItem = await query.get();
      todoList.value = [];
      todoListItem.forEach((doc) => {
        const { priority, todoValue, status, repeat, edit, createAt, lastDoneAt } = doc.data();
        todoList.value.push({
          check: status === 1 ? false : true,
          input: todoValue,
          priority: tablePriority[priority],
          repeat,
          edit,
          id: doc.id,
          createAt: new Date(createAt.seconds),
          lastDoneAt: lastDoneAt === null ? null : new Date(lastDoneAt.seconds),
        });
      });
      if (status === 1) {
        $analytics.logEvent('view_todo');
      } else if (status === 2) {
        $analytics.logEvent('view_done');
      }
      sorting();
    } catch (error) {
      console.error(error);
    } finally {
      store.commit('base/setLoading', false);
    }
  };

  const pushTodoList = async (status, date) => {
    try {
      const { uid } = store.state.user;
      if (uid === null) {
        throw new Error('push function must have uid');
      }
      const { check, input, priority, id, createAt, lastDoneAt } = todoList.value[curIndex];
      if (id !== undefined) {
        fetchUpdateInput(curIndex);
        return;
      }
      await $firestore
        .collection('users')
        .doc(uid)
        .collection('todoListItem')
        .add({
          status: check ? 2 : 1,
          doneAt: [],
          todoValue: input,
          priority: priorityTable[priority],
          repeat: 0,
          createAt,
          lastDoneAt,
          edit: 0,
          deletedAt: null,
        });
      $analytics.logEvent('create_task');
      $analytics.logEvent('create_priority', { priority });
      await fetchTodoList(status, date);
    } catch (error) {
      console.error(error);
    }
  };

  const sorting = () => {
    const list = todoList.value;
    list.sort((a, b) => {
      if (priorityTable[a.priority] === priorityTable[b.priority]) {
        return a.createAt - b.createAt;
      }
      return priorityTable[a.priority] - priorityTable[b.priority];
    });
  };

  const updateCheck = (id, status, date, priority) => {
    const { uid } = store.state.user;
    if (uid === null) {
      throw new Error('push function must have uid');
    }
    const updateListPromise = new Promise((resolve) => {
      $firestore
        .collection('users')
        .doc(uid)
        .collection('todoListItem')
        .doc(id)
        .update({
          status: 2,
          doneAt: firebase.firestore.FieldValue.arrayUnion(new Date()),
          lastDoneAt: new Date(),
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          throw error;
        });
    });
    const increaseDoneCountPromise = new Promise((resolve) => {
      $firestore
        .collection('users')
        .doc(uid)
        .update({ doneCount: firebase.firestore.FieldValue.increment(1) })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          throw error;
        });
    });
    return Promise.all([updateListPromise, increaseDoneCountPromise])
      .then(() => {
        $analytics.logEvent('complete', { priority });
        fetchTodoList(status, date);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const updateInput = (value, index) => {
    todoList.value[index].input = value;
  };

  const fetchUpdateInput = async (index) => {
    const { uid } = store.state.user;
    if (uid === null) {
      throw new Error('push function must have uid');
    }
    const { id, priority, input, edit } = todoList.value[index];
    try {
      await $firestore
        .collection('users')
        .doc(uid)
        .collection('todoListItem')
        .doc(id)
        .update({
          todoValue: input,
          priority: priorityTable[priority],
          edit: edit + 1,
        });
      todoList.value[index].edit++;
      $analytics.logEvent('edit');
    } catch (error) {
      console.error(error);
    }
  };

  const repeatTodoList = async (index) => {
    const { uid } = store.state.user;
    if (uid === null) {
      throw new Error('push function must have uid');
    }
    const { id, repeat } = todoList.value[index];
    try {
      await $firestore
        .collection('users')
        .doc(uid)
        .collection('todoListItem')
        .doc(id)
        .update({ status: 1, repeat: repeat + 1 });
      todoList.value.splice(index, 1);
    } catch (error) {
      console.error(error);
    }
  };

  const addTodoList = () => {
    todoList.value.push({ check: false, input: '', priority: 'Empty', createAt: new Date(), lastDoneAt: null });
  };
  //FIXME: 너무 여러 역할을 가지고 있음. 추후에 분리할 것!
  const updateList = (index, enroll = true) => {
    const { input } = todoList.value[index];
    const trimedInput = input.trim();
    if (trimedInput === '') {
      todoList.value.splice(index, 1);
      return;
    }
    if (!enroll) {
      return;
    }
    curIndex = index;
    todoList.value[index].input = trimedInput;
    if (todoList.value[index].priority === 'Empty') {
      todoList.value[index].priority = 'Mid';
    }
    prDrawer.value = true;
  };
  const removeList = async (index) => {
    const { uid } = store.state.user;
    if (uid === null) {
      throw new Error('push function must have uid');
    }
    const { id } = todoList.value[index];
    console.log(todoList.value[index]);
    try {
      await $firestore
        .collection('users')
        .doc(uid)
        .collection('todoListItem')
        .doc(id)
        .update({ status: 0, deletedAt: new Date() });
      $analytics.logEvent('delete', { status: todoList.value[index].check ? 'done' : 'todo' });
      todoList.value.splice(index, 1);
    } catch (error) {
      console.error(error);
    }
  };
  const setPriority = (value) => {
    todoList.value[curIndex].priority = value;
    prDrawer.value = false;
  };

  return {
    todoList,
    prDrawer,
    fetchTodoList,
    pushTodoList,
    repeatTodoList,
    updateCheck,
    updateInput,
    addTodoList,
    updateList,
    removeList,
    setPriority,
    sorting,
  };
}
