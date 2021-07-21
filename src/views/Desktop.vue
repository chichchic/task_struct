<template>
  <section class="desktop">
    <el-button class="add-button" size="mini" type="primary" round plain>추가</el-button>
    <article>
      <DatePicker
        v-model="selectedDate"
        :select-attribute="selectAttribute"
        is-expanded
        title-position="left"
        :attributes="attributes"
        :masks="{ weekdays: 'WWW' }"
        @dayclick="onDayClick"
      />
    </article>
    <article>
      <el-tabs :class="`tab-${activeName}`" v-model="activeName" stretch>
        <el-tab-pane v-for="{ label, name } in tabs" :key="name" :label="label" :name="name">
          <p class="subtitle_task">{{ $t(subtitleTaskText, { task_count }) }}</p>
        </el-tab-pane>
      </el-tabs>
      <ul class="todo-list">
        <li v-for="({ check, input, priority }, index) in todoList" :key="index" :data-index="index">
          <DesktopTodoItem
            :check="check"
            :input="input"
            :priority="priority"
            :tab="'tab-' + activeName"
            :lineThrough="activeName === 'done'"
            :edit="null"
            :selectedPriority="selectedPriority"
            @changeSelectedPriority="(val) => (selectedPriority = val)"
          />
        </li>
      </ul>
    </article>
  </section>
</template>
<script>
import DesktopTodoItem from '@/components/Todo/DesktopTodoItem.vue';
import useTodoList from '@/components/Todo/useTodoList';
import useElTabs from '@/components/elementPlus/useElTabs';

export default {
  components: {
    DesktopTodoItem,
  },
  data: () => ({
    selectedDate: null,
    selectedPriority: 'Mid',
  }),
  computed: {
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
        {
          dot: 'red',
          dates: [new Date('2021/07/21')],
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
  },
  watch: {
    // XXX: 2번 호출 될 수 있음.
    selectedDate() {
      if (this.activeName === 'todo') {
        this.fetchTodoList(1);
      } else if (this.activeName === 'done') {
        this.fetchTodoList(2, this.selectedDate);
      }
    },
    activeName() {
      if (this.activeName === 'todo') {
        this.selectedDate = null;
        this.fetchTodoList(1);
      } else if (this.activeName === 'done') {
        this.fetchTodoList(2, this.selectedDate);
      }
    },
  },
  mounted() {
    this.fetchTodoList(1);
  },
  methods: {
    onDayClick() {
      this.activeName = 'done';
    },
  },
  setup() {
    const {
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
    } = useTodoList();
    const { tabs, activeName } = useElTabs(
      [
        { label: 'TODO', name: 'todo' },
        { label: 'DONE', name: 'done' },
      ],
      'todo'
    );
    return {
      tabs,
      activeName,
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

.desktop {
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

  .vc-container {
    height: 100%;

    .vc-pane-container {
      height: 100%;

      .vc-pane-layout {
        height: 100%;

        .vc-pane {
          height: 100%;

          .vc-weeks {
            height: 100%;
            grid-template-rows: repeat(auto-fit, 70px);
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.desktop {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 2rem;
  padding: 7rem 5rem 15rem;
  height: calc(100% - 30px);
  border-top: solid 1px #c4c4c4;

  .add-button {
    position: fixed;
    top: 1rem;
    right: 4rem;
  }

  .vc-container {
    border: none;
    background-color: inherit;
  }

  .subtitle_task {
    color: #a7a7a7;
    position: relative;
    padding: 0.5rem;
    font-size: 1.2rem;
    display: inline-block;
  }

  .tab-todo {
    .subtitle_task {
      left: calc(25% - 1rem);
      transform: translateX(-50%);
    }
  }

  .tab-done {
    .subtitle_task {
      left: calc(75% + 1rem);
      transform: translateX(-50%);
    }
  }
}
</style>
