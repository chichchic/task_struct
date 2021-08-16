import firebase from 'firebase';
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
export default function useCalendar({ dotSize = '15px', initSelectedDate = null }) {
  const $store = useStore();
  const $firestore = firebase.firestore();
  const selectedDate = ref(initSelectedDate);
  const currentMonth = ref(null);
  const currentYear = ref(null);
  const monthDotAttributes = ref([]);

  const attributes = computed(() => {
    const today = new Date();
    const isTodaySelected =
      today.getFullYear() === selectedDate.value?.getFullYear() &&
      today.getMonth() === selectedDate.value?.getMonth() &&
      today.getDate() === selectedDate.value?.getDate();
    return [
      {
        highlight: {
          contentStyle: { border: '1px solid #F6797C', color: isTodaySelected ? 'white' : 'inherit' },
        },
        dates: new Date(),
      },
      ...monthDotAttributes.value,
    ];
  });

  const getDotAttributes = async ({ year, month }, mustUpdate = false) => {
    if (!mustUpdate && currentMonth.value === month) {
      return;
    }
    const { uid } = $store.state.user;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    currentMonth.value = month;
    currentYear.value = year;
    const currentDate = new Date(`${year}/${month}`);
    const nextDate = new Date(`${nextYear}/${nextMonth}`);
    const doneList = await $firestore
      .collection('users')
      .doc(uid)
      .collection('todoListItem')
      .where('status', '==', 2)
      .where('lastDoneAt', '>', currentDate)
      .where('lastDoneAt', '<', nextDate)
      .get();
    const doneDots = {};
    const dotStyleList = [
      { width: dotSize, height: dotSize, backgroundColor: '#F6797C' },
      { width: dotSize, height: dotSize, backgroundColor: '#8FDEAA' },
      { width: dotSize, height: dotSize, backgroundColor: '#FFE483' },
    ];
    doneList.forEach((doc) => {
      const { lastDoneAt, priority } = doc.data();
      const lastDoneDate = lastDoneAt.toDate();
      const year = lastDoneDate.getFullYear();
      const month = lastDoneDate.getMonth() + 1;
      const date = lastDoneDate.getDate();
      const fullDate = `${year}/${month}/${date}`;
      if (doneDots[fullDate] === undefined || doneDots[fullDate] > priority) {
        doneDots[fullDate] = priority;
      }
    });
    monthDotAttributes.value = Object.keys(doneDots).map((key) => ({
      dot: { style: dotStyleList[doneDots[key]] },
      dates: [new Date(key)],
    }));
  };
  return {
    selectedDate,
    currentMonth,
    currentYear,
    monthDotAttributes,
    attributes,
    getDotAttributes,
  };
}
