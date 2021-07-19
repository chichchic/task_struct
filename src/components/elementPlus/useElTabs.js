import { ref } from 'vue';
export default function useTodoList(tabList, initName) {
  const tabs = ref(tabList);
  const activeName = ref(initName);
  const handleClick = (tab, event) => {
    //TODO: tab 정보에 맞게 데이터 서버에서 받아오는 로직 추가하기
    console.log(tab, event);
  };
  return { tabs, activeName, handleClick };
}
