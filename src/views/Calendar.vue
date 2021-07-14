<template>
  <section class="calendar">
    <DatePicker :select-attribute="selectAttribute" :attributes="attributes" @dayclick="dayclick" />
  </section>
</template>
<script>
export default {
  data: () => ({
    attributes: [
      {
        highlight: {
          contentStyle: { border: '1px solid #F6797C' },
        },
        order: 1,
        dates: new Date(),
      },
    ],
    tab: 'done',
  }),
  computed: {
    selectAttribute() {
      const backgroundColor = this.tab === 'todo' ? '#FC9A9D' : '#7389FF';
      return {
        highlight: {
          style: { backgroundColor },
          contentStyle: { color: 'white' },
        },
      };
    },
  },
  methods: {
    dayclick(day) {
      console.log(day);
    },
  },
};
</script>
<style lang="scss">
.calendar {
  .vc-day-content:focus {
    background-color: inherit !important;
  }
}
</style>
