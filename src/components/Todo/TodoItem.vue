<template>
  <div class="todo-item" :class="{ [tab]: true, focus: focus }">
    <el-checkbox class="checkbox" :modelValue="check" @change="updateCheck" />
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
      :class="{ 'line-through': lineThrough }"
    />
  </div>
</template>
<script>
export default {
  props: {
    check: Boolean,
    input: String,
    tab: String,
    lineThrough: Boolean,
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
      this.$emit('itemBlur');
    },
  },
};
</script>
<style lang="scss">
@mixin checkbox-color($color) {
  & .el-checkbox__input {
    &.is-checked .el-checkbox__inner {
      background-color: $color;
      border-color: $color;
    }

    &.is-focus .el-checkbox__inner {
      border-color: $color;
    }

    &:hover .el-checkbox__inner {
      border-color: $color;
    }
  }
}

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

  & .line-through {
    & .el-input__inner {
      text-decoration: line-through;
    }
  }

  & .checkbox {
    margin: 0 1rem 0 1rem;
  }

  &.todo {
    @include checkbox-color(#f56e71);
  }

  &.done {
    @include checkbox-color(#6880ff);
  }
}
</style>
