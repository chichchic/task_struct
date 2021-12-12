import { ref } from "vue";
export default function useTodoList(tabList, initName) {
  const tabs = ref(tabList);
  const activeName = ref(initName);
  return { tabs, activeName };
}
