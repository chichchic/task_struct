<template>
  <section class="todo-item">
    <el-checkbox class="checkbox" :modelValue="check" @change="updateCheck" size="medium" />
    <el-input
      placeholder="할 일을 입력해보세요"
      :modelValue="input"
      @input="updateInput"
      clearable
      @clear="$emit('updateInput', '')"
      :disabled="check"
    />
  </section>
</template>
<script>
export default {
  props: {
    check: Boolean,
    input: String,
  },
  methods: {
    updateCheck(value) {
      this.$emit('updateCheck', value);
    },
    updateInput(value) {
      this.$emit('updateInput', value);
    },
  },
};
</script>
<style lang="scss">
.todo-item {
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #ebebeb;
  }

  & .el-input__inner {
    border: none;
  }

  & .checkbox {
    margin: 0 1rem 0 1rem;
  }
}
</style>
