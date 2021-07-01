export default function useTodoList(todoList) {
  const list = todoList.value;
  const updateCheck = (value, index) => {
    list[index].check = value;
  };
  const updateInput = (value, index) => {
    list[index].input = value;
  };
  return { updateCheck, updateInput };
}
