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
        :placeholder="$t('default.create_placeholder_pc')"
        v-model="innerInput"
        ref="input"
        @focus="actionFocus"
        :class="{ 'line-through': lineThrough }"
        :autosize="true"
        type="textarea"
      />
      <p
        class="input-text"
        v-else
        :class="{ 'line-through': lineThrough }"
        @click="$emit('setEdit')"
      >
        {{ input }}
      </p>
      <p class="priority" v-if="!edit" :class="priority.toLowerCase()">
        {{ $t(priorityText) }}
      </p>
      <p v-else-if="input === ''">{{ $t("default.create_error_empty") }}</p>
      <p v-else>
        <el-tag
          v-for="(val, index) in ['High', 'Mid', 'Low']"
          :key="val"
          @click="changeSelectedPriority(val)"
          effect="dark"
          :class="{
            'selected-tag': isSelected(val),
            [val.toLowerCase() + '-tag']: true,
            'tag-opacity': setTagOpacity(val),
          }"
          class="tag"
          type="danger"
          size="mini"
          >{{ index + 1 }}. {{ val }}</el-tag
        >
      </p>
    </div>
    <el-button v-if="edit" @click="enroll">{{
      $t("default.enroll_new")
    }}</el-button>
    <el-button
      v-if="tab === 'tab-done'"
      type="text"
      icon="el-icon-refresh"
      circle
      @click="repeat"
    ></el-button>
    <el-button
      v-if="!edit"
      type="text"
      icon="el-icon-delete"
      circle
      @click="remove"
    ></el-button>
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
    this.$el.addEventListener("keydown", (e) => {
      const { code, ctrlKey, metaKey } = e;
      if ((ctrlKey || metaKey) && code === "Enter") {
        this.enroll();
      }
    });
  },
  data: () => ({
    innerInput: "",
    tagPriority: ["High", "Mid", "Low"],
  }),
  methods: {
    updateCheck() {
      this.$emit("updateCheck");
    },
    actionFocus() {
      this.innerInput = this.input;
    },
    isSelected(value) {
      return this.selectedPriority === value;
    },
    setTagOpacity(value) {
      return (
        this.tagPriority.includes(this.selectedPriority) &&
        this.selectedPriority !== value
      );
    },
    changeSelectedPriority(value) {
      this.$emit("updateInput", this.innerInput);
      this.$emit("changeSelectedPriority", value);
    },
    enroll() {
      this.$emit("updateInput", this.innerInput);
      this.$refs.input.blur();
    },
    repeat() {
      this.$emit("repeat");
    },
    remove() {
      this.$emit("remove");
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
  padding: 0.3rem 1rem;
  padding-left: 1.8rem;

  .checkbox {
    position: relative;

    &::before {
      padding: 21px 15px;

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
    textarea {
      padding: 0 0.5rem;
    }
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
    display: inline-block;
    color: rgb(196, 196, 196);
  }

  .tag {
    margin-right: 0.5rem;
    cursor: pointer;
  }

  .el-button + .el-button {
    margin: 0;
  }
}

html[dir="rtl"] {
  .todo-item {
    flex-direction: row-reverse;
  }
}
</style>
<style lang="scss" scoped>
.todo-item {
  .high-tag {
    --color: #fc9a9d;
    --highlight-color: #ff5b60;
  }

  .mid-tag {
    --color: #7389ff;
    --highlight-color: #2547ff;
  }

  .low-tag {
    --color: #ffcd83;
    --highlight-color: #feb03b;
  }

  .tag {
    border: var(--color);
    background-color: var(--color);
  }

  .selected-tag {
    box-shadow: 0 0 0 2px var(--highlight-color);
  }

  .tag-opacity {
    opacity: 0.4;
  }
}
</style>
