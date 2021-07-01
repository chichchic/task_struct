import { ref } from 'vue';
export default function useTodoList(initList) {
  const todoList = ref(initList);
  const updateCheck = (value, index) => {
    todoList.value[index].check = value;
  };
  const updateInput = (value, index) => {
    todoList.value[index].input = value;
  };
  const addTodoList = () => {
    todoList.value.push({ check: false, input: '' });
  };
  const updateList = () => {
    todoList.value = todoList.value.filter(({ input }) => input !== '');
  };
  return { todoList, updateCheck, updateInput, addTodoList, updateList };
}
