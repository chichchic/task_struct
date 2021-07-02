<template>
  <section class="todo">
    <el-tabs :class="activeName" v-model="activeName" @tab-click="handleClick" stretch>
      <el-tab-pane v-for="{ label, name } in tabs" :key="name" :label="label" :name="name">
        <p class="subtitle_task">{{ $t(subtitleTaskText, { task_count }) }}</p>
      </el-tab-pane>
    </el-tabs>
    <TodoItem
      v-for="({ check, input, priority }, index) in todoList"
      :key="index"
      :check="check"
      :input="input"
      :priority="priority"
      :tab="activeName"
      :lineThrough="activeName === 'done'"
      @updateCheck="(value) => updateCheck(value, index)"
      @updateInput="(value) => updateInput(value, index)"
      @itemBlur="updateList(index)"
    />
    <el-button
      v-show="activeName === 'todo'"
      class="add-button"
      icon="el-icon-plus"
      type="primary"
      circle
      @click.prevent="addTodoList"
    ></el-button>
    <el-drawer v-model="prDrawer" direction="btt">
      <template v-slot:title>
        <p class="priority-description">
          {{ $t('default.guide_priority_body_front') }} <br />
          <strong> {{ $t('default.guide_priority_bold') }} </strong>
          {{ $t('default.guide_priority_body_back') }}
        </p>
      </template>
      <article class="drawer">
        <el-button
          v-for="{ backgroundColor, value, icon, size, fontSize } in priorities"
          :key="value"
          class="priority-button"
          :style="{ backgroundColor, height: size, width: size, fontSize }"
          circle
          @click="setPriority(value)"
          :data-label="$t(guidePriorityText(value))"
          >{{ icon }}</el-button
        >
      </article>
    </el-drawer>
  </section>
</template>
<script>
import TodoItem from '@/components/Todo/TodoItem.vue';
import useTodoList from '@/components/Todo/useTodoList';
import useElTabs from '@/components/elementPlus/useElTabs';

export default {
  components: {
    TodoItem,
  },
  setup() {
    const { todoList, prDrawer, updateCheck, updateInput, addTodoList, updateList, setPriority } = useTodoList([
      { check: true, input: '123', priority: 'High' },
      { check: true, input: '123', priority: 'Mid' },
      { check: false, input: '123', priority: 'Low' },
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
      tabs,
      activeName,
      handleClick,
      setPriority,
    };
  },
  data: () => ({
    priorities: [
      { backgroundColor: '#f56e71', value: 'High', icon: 'H', size: '10rem', fontSize: '6rem' },
      { backgroundColor: '#6880ff', value: 'Mid', icon: 'M', size: '8rem', fontSize: '4rem' },
      { backgroundColor: '#ffc678', value: 'Low', icon: 'L', size: '6rem', fontSize: '2rem' },
    ],
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
  },
  methods: {
    guidePriorityText(value) {
      const list = {
        High: 'default.guide_priority_high',
        Mid: 'default.guide_priority_mid',
        Low: 'default.guide_priority_low',
      };
      return list[value];
    },
  },
};
</script>

<style lang="scss">
@mixin el-tabs-color($color, $hover) {
  & .el-tabs__active-bar {
    background-color: $color;
  }

  & .el-tabs__item {
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

.todo {
  & .todo {
    @include el-tabs-color(#f56e71, #6880ff);
  }

  & .done {
    @include el-tabs-color(#6880ff, #f56e71);
  }
}
</style>
<style lang="scss" scoped>
.todo {
  & .add-button {
    position: fixed;
    right: 3rem;
    bottom: 3rem;
    z-index: 3;
  }

  & .el-tab-pane {
    position: relative;
  }

  & .subtitle_task {
    color: #a7a7a7;
    position: relative;
    top: 0;
    font-size: 1.5rem;
    display: inline-block;
  }

  & .todo {
    & .subtitle_task {
      left: calc(25% - 1rem);
      transform: translateX(-50%);
    }
  }

  & .done {
    & .subtitle_task {
      left: calc(75% + 1rem);
      transform: translateX(-50%);
    }
  }

  & .priority-description {
    font-size: 2rem;
    color: black;

    & strong {
      font-size: 2.5rem;
    }
  }

  & .drawer {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: flex-end;

    & .priority-button {
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      border: none;
      position: relative;

      &::after {
        position: absolute;
        bottom: 0;
        transform: translateY(120%);
        content: attr(data-label);
        font-size: 1.5rem;
        color: black;
      }
    }
  }
}
</style>
