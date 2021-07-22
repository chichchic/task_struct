<template>
  <div class="todo-item" :class="{ [tab]: true, focus: edit }">
    <el-checkbox class="checkbox" :modelValue="check" @change="updateCheck" :disabled="lineThrough" />
    <div class="input">
      <el-input
        v-if="edit"
        placeholder="Control + Enter 를 눌러 할 일을 등록해보세요"
        v-model="innerInput"
        ref="input"
        @focus="actionFocus"
        :class="{ 'line-through': lineThrough }"
        :autosize="true"
        type="textarea"
      />
      <p class="input-text" v-else :class="{ 'line-through': lineThrough }" @click="$emit('setEdit')">{{ input }}</p>
      <p class="priority" v-if="!edit" :class="priority.toLowerCase()">{{ $t(priorityText) }}</p>
      <p v-else-if="input === ''">할 일을 입력 한 후 우선순위를 등록할 수 있어요!</p>
      <p v-else>
        <el-tag
          @click="changeSelectedPriority('High')"
          effect="dark"
          :class="{ 'selected-tag': isSelected('High') }"
          class="tag"
          type="danger"
          size="mini"
          >1. High</el-tag
        >
        <el-tag
          @click="changeSelectedPriority('Mid')"
          effect="dark"
          :class="{ 'selected-tag': isSelected('Mid') }"
          class="tag mid-tag"
          type="danger"
          size="mini"
          >2. Mid</el-tag
        >
        <el-tag
          @click="changeSelectedPriority('Low')"
          effect="dark"
          :class="{ 'selected-tag': isSelected('Low') }"
          class="tag low-tag"
          type="danger"
          size="mini"
          >3. Low</el-tag
        >
      </p>
    </div>
    <el-button v-if="edit" @click="enroll">등록</el-button>
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
    edit: Boolean,
    selectedPriority: [String],
  },
  watch: {
    edit(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
    },
  },
  computed: {
    priorityText() {
      const list = {
        High: 'default.priority_high',
        Mid: 'default.priority_mid',
        Low: 'default.priority_low',
        Empty: 'default.priority',
      };
      return list[this.priority];
    },
  },
  mounted() {
    if (this.input === '') {
      this.$refs.input.focus();
    }
    this.$el.addEventListener('keydown', (e) => {
      const { code, ctrlKey, metaKey } = e;
      if ((ctrlKey || metaKey) && code === 'Enter') {
        this.enroll();
      }
    });
  },
  data: () => ({
    innerInput: '',
  }),
  methods: {
    updateCheck(value) {
      this.$emit('updateCheck', value);
    },
    actionFocus() {
      this.innerInput = this.input;
    },
    isSelected(value) {
      return this.selectedPriority === value;
    },
    changeSelectedPriority(value) {
      this.$emit('updateInput', this.innerInput);
      this.$emit('changeSelectedPriority', value);
    },
    enroll() {
      this.$emit('updateInput', this.innerInput);
      this.$refs.input.blur();
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
  padding-left: 1.8rem;

  .checkbox {
    position: relative;

    &::before {
      padding: 31px 25px;
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(10px, -50%);
    }
  }

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
    margin: 0 0 0 1rem;
    flex-grow: 1;
  }

  .el-textarea__inner {
    border: none;
    padding: 0;
    font-size: 1.8rem;
    resize: none;
  }

  .input-text {
    cursor: pointer;
    padding: 0;
    font-size: 1.8rem;
  }

  .el-textarea.is-disabled .el-textarea__inner {
    color: inherit;
  }

  .line-through {
    text-decoration: line-through;
  }

  &.tab-todo {
    @include checkbox-color(#f56e71);
  }

  &.tab-done {
    @include checkbox-color(#6880ff);
  }

  i {
    height: 42px;
    line-height: 42px;
    display: inline-block;
    color: rgb(196, 196, 196);
  }

  .tag {
    margin-right: 0.5rem;
    cursor: pointer;
  }
}
</style>
<style lang="scss" scoped>
.todo-item {
  .mid-tag {
    border: #6880ff;
    background-color: #6880ff;
  }

  .low-tag {
    border: rgb(248, 206, 141);
    background-color: rgb(248, 206, 141);
  }

  .selected-tag {
    box-shadow: 0 0 0 2px black;
  }
}
</style>
