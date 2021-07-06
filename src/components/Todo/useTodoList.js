import { ref } from 'vue';
export default function useTodoList(initList) {
  const todoList = ref(initList);
  const prDrawer = ref(false);
  //FIXME: curIndex를 사용하지 않는 방법으로 priority 설정할 수 있도록 수정해야 함
  let curIndex = null;
  const updateCheck = (value, index) => {
    todoList.value[index].check = value;
  };
  const updateInput = (value, index) => {
    todoList.value[index].input = value;
  };
  const addTodoList = () => {
    todoList.value.push({ check: false, input: '', priority: 'Low' });
  };
  const updateList = (index) => {
    const { input } = todoList.value[index];
    const trimedInput = input.trim();
    if (trimedInput === '') {
      todoList.value.splice(index, 1);
      return;
    }
    curIndex = index;
    todoList.value[index].input = trimedInput;
    prDrawer.value = true;
  };
  const setPriority = (value) => {
    todoList.value[curIndex].priority = value;
    prDrawer.value = false;
  };
  return { todoList, prDrawer, updateCheck, updateInput, addTodoList, updateList, setPriority };
}
