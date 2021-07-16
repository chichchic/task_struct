import { ref } from 'vue';
export default function useTodoList(initList) {
  const priorityTable = {
    High: 0,
    Mid: 1,
    Low: 2,
  };

  const todoList = ref(initList);
  const prDrawer = ref(false);

  //FIXME: curIndex를 사용하지 않는 방법으로 priority 설정할 수 있도록 수정해야 함
  let curIndex = null;

  const sorting = () => {
    const list = todoList.value;
    list.sort((a, b) => priorityTable[a.priority] - priorityTable[b.priority]);
  };

  //최초 실행
  sorting();

  const updateCheck = (value, index) => {
    todoList.value[index].check = value;
  };
  const updateInput = (value, index) => {
    todoList.value[index].input = value;
  };
  const addTodoList = () => {
    todoList.value.push({ check: false, input: '', priority: 'Empty' });
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
    if (todoList.value[curIndex].priority === 'Empty') {
      todoList.value[curIndex].priority = 'Mid';
    }
    prDrawer.value = true;
  };
  const removeList = (index) => {
    todoList.value.splice(index, 1);
  };
  const setPriority = (value) => {
    todoList.value[curIndex].priority = value;
    prDrawer.value = false;
  };

  return {
    todoList,
    prDrawer,
    updateCheck,
    updateInput,
    addTodoList,
    updateList,
    removeList,
    setPriority,
    sorting,
  };
}
