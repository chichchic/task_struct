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
        />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>
<script>
import TodoItem from '@/components/Todo/TodoItem.vue';
import useTodoList from '@/components/Todo/useTodoList';
import useElTabs from '@/components/elementPlus/useElTabs';
import { ref } from 'vue';
export default {
  components: {
    TodoItem,
  },
  setup() {
    const todoList = ref([
      { check: true, input: '123' },
      { check: true, input: '123' },
    ]);
    const { updateCheck, updateInput } = useTodoList(todoList);
    const { tabs, activeName, handleClick } = useElTabs(
      [
        { label: 'TODO', name: 'todo' },
        { label: 'DONE', name: 'done' },
      ],
      'todo'
    );
    return { tabs, activeName, handleClick, todoList, updateCheck, updateInput };
  },
};
</script>
