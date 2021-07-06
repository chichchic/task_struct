<template>
  <div class="todo-item" :class="{ [tab]: true, focus: focus }">
    <el-checkbox class="checkbox" :modelValue="check" @change="updateCheck" :disabled="lineThrough" />
    <div class="input">
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
        :autosize="true"
        type="textarea"
      />
      <p class="priority" :class="priority.toLowerCase()">{{ $t(priorityText) }}</p>
    </div>
    <i class="el-icon-arrow-right"></i>
  </div>
</template>
<script>
export default {
  props: {
    check: Boolean,
    input: String,
    priority: String,
    tab: String,
    lineThrough: Boolean,
  },
  computed: {
    priorityText() {
      const list = {
        High: 'default.priority_high',
        Mid: 'default.priority_mid',
        Low: 'default.priority_low',
      };
      return list[this.priority];
    },
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
  align-items: center;
  padding: 1rem;

  &:hover {
    background-color: #ebebeb;
  }

  &.focus {
    background-color: #ebebeb;
  }

  .priority {
    font-size: 1.2rem;

    &.high {
      color: #f56e71;
    }

    &.mid {
      color: #84d9a0;
    }

    &.low {
      color: #ffc678;
    }
  }

  .input {
    margin: 0 0.5rem;
    flex-grow: 1;
  }

  .el-textarea__inner {
    border: none;
    padding: 0;
    font-size: 1.8rem;
    resize: none;
  }

  .el-textarea.is-disabled .el-textarea__inner {
    color: inherit;
  }

  .line-through {
    text-decoration: line-through;
  }

  &.todo {
    @include checkbox-color(#f56e71);
  }

  &.done {
    @include checkbox-color(#6880ff);
  }

  i {
    color: rgb(196, 196, 196);
  }
}
</style>
