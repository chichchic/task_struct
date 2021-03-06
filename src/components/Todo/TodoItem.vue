<template>
  <div class="todo-item" :class="{ [tab]: true, focus: edit }">
    <el-checkbox
      class="checkbox"
      :modelValue="check"
      @change="updateCheck"
      :disabled="lineThrough"
    />
    <div class="input">
      <el-input
        v-if="edit"
        :placeholder="$t('default.create_placeholder')"
        v-model="innerInput"
        ref="input"
        @focus="actionFocus"
        :class="{ 'line-through': lineThrough }"
        :autosize="true"
        type="textarea"
      />
      <p class="input-text" v-else :class="{ 'line-through': lineThrough }">
        {{ input }}
      </p>
      <p class="priority" :class="priority.toLowerCase()">
        {{ $t(priorityText) }}
      </p>
    </div>
    <span class="icon" @click.prevent="toggleSlider">
      <mdicon name="chevron-right" size="20" />
    </span>
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
  },
  watch: {
    edit(newVal, prevVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
      if (prevVal && !newVal) {
        this.updateInput(this.innerInput);
      }
    },
  },
  computed: {
    priorityText() {
      const list = {
        High: "default.priority_high",
        Mid: "default.priority_mid",
        Low: "default.priority_low",
        Empty: "default.priority",
      };
      return list[this.priority];
    },
  },
  mounted() {
    if (this.input === "") {
      this.$refs.input.focus();
    }
  },
  data: () => ({
    innerInput: "",
  }),
  methods: {
    updateCheck() {
      this.$emit("updateCheck");
    },
    updateInput(value) {
      this.$emit("updateInput", value);
    },
    actionFocus() {
      this.innerInput = this.input;
    },
    toggleSlider() {
      this.$emit("toggleSlider");
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
      content: "";
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

  .icon {
    height: 42px;
    line-height: 42px;
    display: inline-block;
    color: rgb(196, 196, 196);
  }
}
</style>
