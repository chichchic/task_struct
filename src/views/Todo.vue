<template>
  <section class="todo">
    <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
      <el-tab-pane v-for="{ label, name } in tabs" :key="name" :label="label" :name="name">
        <TodoItem
          v-for="({ check, input }, index) in todoList"
          :key="index"
          :check="check"
          :input="input"
          @updateCheck="(value) => updateCheck(value, index)"
          @updateInput="(value) => updateInput(value, index)"
          @updateList="updateList"
        />
      </el-tab-pane>
    </el-tabs>
    <el-button class="add-button" icon="el-icon-plus" type="primary" circle @click.prevent="addTodoList"></el-button>
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
    const { todoList, updateCheck, updateInput, addTodoList, updateList } = useTodoList([
      { check: true, input: '123' },
      { check: true, input: '123' },
      { check: false, input: '123' },
    ]);
    const { tabs, activeName, handleClick } = useElTabs(
      [
        { label: 'TODO', name: 'todo' },
        { label: 'DONE', name: 'done' },
      ],
      'todo'
    );
    return { tabs, activeName, handleClick, todoList, updateCheck, updateInput, addTodoList, updateList };
  },
};
</script>
<style lang="scss" scoped>
.todo {
  & .add-button {
    position: fixed;
    right: 3rem;
    bottom: 3rem;
    z-index: 3;
  }
}
</style>
