<template>
  <section class="todo-item" :class="{ focus: focus }">
    <el-checkbox class="checkbox" :modelValue="check" @change="updateCheck" size="medium" />
    <el-input
      placeholder="할 일을 입력해보세요"
      :modelValue="input"
      @input="updateInput"
      clearable
      @clear="updateInput('')"
      :disabled="check"
      ref="input"
      @blur="actionBlur"
      @focus="actionFocus"
    />
  </section>
</template>
<script>
export default {
  props: {
    check: Boolean,
    input: String,
  },
  mounted() {
    if (this.input === '') {
      this.$refs.input.focus();
    }
  },
  data: () => ({
    focus: false,
  }),
  methods: {
    updateCheck(value) {
      this.$emit('updateCheck', value);
    },
    updateInput(value) {
      this.$emit('updateInput', value);
    },
    actionFocus() {
      this.focus = true;
    },
    actionBlur() {
      this.focus = false;
      this.$emit('updateList');
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

  &.focus {
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
