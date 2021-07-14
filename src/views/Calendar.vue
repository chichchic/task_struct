<template>
  <section class="calendar">
    <el-tabs :class="`tab-${activeName}`" v-model="activeName" @tab-click="changeTab" stretch>
      <el-tab-pane v-for="{ label, name } in tabs" :key="name" :label="label" :name="name">
        <div class="el-tab-pane-space"></div>
      </el-tab-pane>
    </el-tabs>
    <DatePicker
      :select-attribute="selectAttribute"
      v-model="selectedDate"
      :attributes="attributes"
      :masks="{ weekdays: 'WWW' }"
      is-expanded
    />
    <ul class="todo-list">
      <li v-for="({ check, input, priority }, index) in todoList" :key="index">
        <TodoItem
          :check="check"
          :input="input"
          :priority="priority"
          :tab="'tab-' + activeName"
          :lineThrough="activeName === 'done'"
          @updateCheck="(value) => updateCheck(value, index)"
          @updateInput="(value) => updateInput(value, index)"
          @toggleSlider="() => {}"
          :edit="false"
        />
      </li>
    </ul>
  </section>
</template>
<script>
import TodoItem from '@/components/Todo/TodoItem.vue';
import useElTabs from '@/components/elementPlus/useElTabs';
import useTodoList from '@/components/Todo/useTodoList';

export default {
  components: {
    TodoItem,
  },
  setup() {
    const { todoList, prDrawer, updateCheck, updateInput, addTodoList, updateList, removeList, setPriority } =
      useTodoList([
        { check: true, input: '1', priority: 'High' },
        { check: true, input: '2', priority: 'Mid' },
        { check: false, input: '3', priority: 'Low' },
        { check: true, input: '4', priority: 'High' },
        { check: true, input: '5', priority: 'Mid' },
      ]);
    const { tabs, activeName, handleClick } = useElTabs(
      [
        { label: 'TODO', name: 'todo' },
        { label: 'DONE', name: 'done' },
      ],
      'todo'
    );
    return {
      todoList,
      prDrawer,
      updateCheck,
      updateInput,
      addTodoList,
      updateList,
      removeList,
      setPriority,
      tabs,
      activeName,
      handleClick,
    };
  },
  data: () => ({
    selectedDate: null,
  }),
  computed: {
    attributes() {
      const today = new Date();
      const isTodaySelected =
        today.getFullYear() === this.selectedDate?.getFullYear() &&
        today.getMonth() === this.selectedDate?.getMonth() &&
        today.getDate() === this.selectedDate?.getDate();
      return [
        {
          highlight: {
            contentStyle: { border: '1px solid #F6797C', color: isTodaySelected ? 'white' : 'inherit' },
          },
          order: 1,
          dates: new Date(),
        },
      ];
    },
    selectAttribute() {
      const backgroundColor = this.activeName === 'todo' ? '#FC9A9D' : '#7389FF';
      return {
        highlight: {
          style: { backgroundColor },
          contentStyle: { color: 'white' },
        },
      };
    },
    task_count() {
      return this.todoList.filter(({ check }) => check).length;
    },
    subtitleTaskText() {
      const list = {
        todo: 'default.subtitle_task_incomplete',
        done: 'default.subtitle_task_completed',
      };
      return list[this.activeName];
    },
  },
  methods: {
    changeTab() {
      // this.toggleIndex = null;
      // this.tailWidth = 0;
      // this.editIndex = null;
      // this.addNewItem = false;
      this.handleClick();
    },
  },
};
</script>
<style lang="scss">
@mixin el-tabs-color($color, $hover) {
  .el-tabs__active-bar {
    background-color: $color;
  }

  .el-tabs__item {
    &:hover {
      color: $hover;
    }

    &.is-active {
      color: $color;

      &:hover {
        color: $color;
      }
    }
  }
}

.calendar {
  .vc-day-content:focus {
    background-color: inherit !important;
  }

  .el-tabs__header {
    margin: 0;
  }

  .el-drawer__header {
    margin-bottom: 0;
  }

  .tab-todo {
    @include el-tabs-color(#f56e71, #6880ff);
  }

  .tab-done {
    @include el-tabs-color(#6880ff, #f56e71);
  }
}
</style>
<style lang="scss" scoped>
.calendar {
  height: calc(100% - 30px);

  .el-tab-pane-space {
    padding-bottom: 0.5rem;
  }

  .todo-list {
    height: calc(100% - 310px - 1.5rem);
    margin-top: 1rem;
    width: 100%;
    overflow-y: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
