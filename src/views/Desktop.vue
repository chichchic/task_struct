<template>
  <section class="desktop">
    <el-button class="add-button" size="mini" type="primary" round plain @click="addItem">추가</el-button>
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
    <article class="todo-list-content">
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
            :edit="editIndex === index"
            :selectedPriority="selectedPriority"
            @updateCheck="(value) => updateCheck(value, index)"
            @updateInput="
              (value) => {
                doUpdateInput(value, index);
              }
            "
            @setEdit="setEdit(index, priority)"
            @changeSelectedPriority="changeSelectedPriority"
          />
        </li>
      </ul>
      <p class="todo-description" v-if="editIndex !== null && task_count <= 3 && activeName === 'todo'">
        Control + Enter를 통해 할 일을 등록하고<br />Shift + 숫자키(1~3)를 통해<br />
        우선순위를 입력해보세요
      </p>
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
    selectedPriority: 'Empty',
    editIndex: null,
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
    this.$el.addEventListener('click', (e) => {
      if (e.target.classList.contains('todo-list')) {
        if (this.editIndex !== null) {
          if (this.selectedPriority === 'Empty') {
            this.todoList[this.editIndex].input = '';
          }
          this.updateList(this.editIndex);
          this.editIndex = null;
          this.selectedPriority = 'Empty';
        } else {
          this.addItem();
        }
      }
    });
    // TODO: 1,2,3입력으로 우선 순위 설정하기
    window.addEventListener('keydown', (e) => {
      const { code, shiftKey } = e;
      const keyMatch = { Digit1: 'High', Digit2: 'Mid', Digit3: 'Low' };
      if (shiftKey && code in keyMatch) {
        this.changeSelectedPriority(keyMatch[code]);
      }
    });
  },
  methods: {
    onDayClick() {
      this.activeName = 'done';
    },
    changeSelectedPriority(value) {
      this.selectedPriority = value;
      this.setPriority(value);
      this.updateListData();
    },
    doUpdateInput(value, index) {
      this.updateInput(value, index);
      this.updateList(index);
      if (this.selectedPriority === 'Empty') {
        return;
      }
      this.updateListData();
    },
    updateListData() {
      this.pushTodoList();
      this.sorting();
      this.editIndex = null;
      this.selectedPriority = 'Empty';
    },
    // NOTE: 수정 실행할 때 사용되는 함수
    setEdit(index, priority) {
      if (this.editIndex !== null) {
        this.updateList(this.editIndex);
      }
      this.updateList(index);
      this.editIndex = index;
      this.selectedPriority = priority;
    },
    addItem() {
      if (this.editIndex !== null) {
        this.updateList(this.editIndex);
      }
      this.activeName = 'todo';
      this.addTodoList();
      this.editIndex = this.todoList.length - 1;
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

  .todo-list-content {
    position: relative;
    overflow-y: hidden;

    .todo-list {
      height: calc(100% - 60px);
      overflow-y: scroll;
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .todo-description {
      display: block;
      text-align: center;
      font-size: 1.5rem;
      color: white;
      background-color: #5a5a5a;
      border-radius: 1rem;
      padding: 2rem;
      width: 30rem;
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
    }
  }
}
</style>
