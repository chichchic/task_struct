<template>
  <section class="calendar">
    <el-tabs :class="`tab-${activeName}`" v-model="activeName" @tab-click="changeTab" stretch>
      <el-tab-pane v-for="{ label, name } in tabs" :key="name" :label="label" :name="name">
        <div class="el-tab-pane-space"></div>
      </el-tab-pane>
    </el-tabs>
    <DatePicker
      :select-attribute="selectAttribute"
      v-model="selectedDate"
      :attributes="attributes"
      :masks="{ weekdays: 'WWW' }"
      is-expanded
      @update:from-page="getDotAttributes"
    />
    <ul class="todo-list" ref="swipeListener">
      <li v-for="({ check, input, priority, id }, index) in todoList" :key="index" :data-index="index">
        <Swiper :tailWidth="toggleIndex == index ? tailWidth : 0">
          <template v-slot:main>
            <TodoItem
              :check="check"
              :input="input"
              :priority="priority"
              :tab="'tab-' + activeName"
              :lineThrough="activeName === 'done'"
              @updateCheck="doUpdateCheck(id)"
              @updateInput="(value) => updateInput(value, index)"
              @toggleSlider="toggleSlider(index)"
              :edit="editIndex === index"
            />
          </template>
          <template v-slot:tail>
            <div v-if="activeName === 'todo'" class="swiper-button edit" @click="setEditIndex(index)">
              <mdicon name="pencil-outline" size="36" />
            </div>
            <div v-else class="swiper-button edit" @click="repeatTodoList(index)">
              <mdicon name="autorenew" size="36" />
            </div>
            <div class="swiper-button delete" @click="removeList(index)">
              <mdicon name="close" size="36" />
            </div>
          </template>
        </Swiper>
      </li>
    </ul>
    <button class="todo-btn" @click.prevent="addItem">{{ editIndex === null ? '+추가하기' : '등록하기' }}</button>
    <el-drawer
      v-model="prDrawer"
      @close="
        () => {
          pushTodoList(activeName === 'todo' ? 1 : 2, selectedDate);
        }
      "
      direction="btt"
      size="50%"
    >
      <template v-slot:title>
        <p class="priority-description">
          {{ $t('default.guide_priority_title') }} <br />
          <strong> {{ $t('default.guide_priority_bold') }} </strong>
          {{ $t('default.guide_priority_body') }}
        </p>
      </template>
      <div class="vertical-align-center">
        <article class="drawer">
          <el-button
            v-for="{ color, value, icon } in priorities"
            :key="value"
            class="priority-button"
            :style="{ backgroundColor: color, color }"
            circle
            @click="setPriority(value)"
            :data-label="$t(guidePriorityText(value))"
          >
            <span>{{ $t(icon) }}</span></el-button
          >
        </article>
      </div>
    </el-drawer>
  </section>
</template>
<script>
import TodoItem from '@/components/Todo/TodoItem.vue';
import Swiper from '@/components/common/Swiper.vue';
import useElTabs from '@/components/elementPlus/useElTabs';
import useTodoList from '@/components/Todo/useTodoList';
import useCalendar from '@/components/Todo/useCalendar.js';

export default {
  components: {
    TodoItem,
    Swiper,
  },
  setup() {
    const {
      todoList,
      prDrawer,
      fetchTodoList,
      pushTodoList,
      repeatTodoList,
      updateCheck,
      updateInput,
      addTodoList,
      updateList,
      removeList,
      setPriority,
      sorting,
    } = useTodoList([
      { check: true, input: '1', priority: 'High' },
      { check: true, input: '2', priority: 'Mid' },
      { check: false, input: '3', priority: 'Low' },
      { check: true, input: '4', priority: 'High' },
      { check: true, input: '5', priority: 'Mid' },
    ]);
    const { tabs, activeName } = useElTabs(
      [
        { label: 'TODO', name: 'todo' },
        { label: 'DONE', name: 'done' },
      ],
      'todo'
    );
    const { selectedDate, currentMonth, currentYear, monthDotAttributes, attributes, getDotAttributes } = useCalendar({
      dotSize: '4px',
      initSelectedDate: new Date(),
    });
    return {
      todoList,
      prDrawer,
      fetchTodoList,
      pushTodoList,
      repeatTodoList,
      updateCheck,
      updateInput,
      addTodoList,
      updateList,
      removeList,
      setPriority,
      sorting,
      tabs,
      activeName,
      selectedDate,
      currentMonth,
      currentYear,
      monthDotAttributes,
      attributes,
      getDotAttributes,
    };
  },
  watch: {
    selectedDate() {
      this.fetchTodoList(this.activeName === 'todo' ? 1 : 2, this.selectedDate);
    },
    async activeName() {
      await this.fetchTodoList(this.activeName === 'todo' ? 1 : 2, this.selectedDate);
      if (this.newAddItem) {
        this.newAddItem = false;
        this.addItem();
      }
    },
  },
  data: () => ({
    priorities: [
      { color: '#F6797C', value: 'High', icon: 'default.priority_high_1' },
      { color: '#8FDEAA ', value: 'Mid', icon: 'default.priority_mid_2' },
      { color: '#FFE483', value: 'Low', icon: 'default.priority_low_3' },
    ],
    toggleIndex: null,
    tailWidth: 0,
    editIndex: null,
    addNewItem: false,
    newAddItem: false,
  }),
  computed: {
    selectAttribute() {
      const backgroundColor = this.activeName === 'todo' ? '#FC9A9D' : '#7389FF';
      return {
        highlight: {
          style: { backgroundColor, width: '24px', height: '24px' },
          contentStyle: { color: 'white' },
        },
      };
    },
  },
  mounted() {
    this.$refs.swipeListener.addEventListener('touchstart', (e) => {
      const index = e.target.closest('li')?.dataset.index;
      if (this.editIndex !== null) {
        this.updateList(this.editIndex, false);
        this.editIndex = null;
      }
      this.toggleIndex = index;
      this.tailWidth = 0;
    });
    this.fetchTodoList(this.activeName === 'todo' ? 1 : 2, new Date());
  },
  methods: {
    guidePriorityText(value) {
      const list = {
        High: 'default.priority_high',
        Mid: 'default.priority_mid',
        Low: 'default.priority_low',
      };
      return list[value];
    },
    setEditIndex(index) {
      this.editIndex = index;
      this.toggleIndex = null;
      this.tailWidth = 0;
    },
    toggleSlider(index) {
      if (this.toggleIndex === index) {
        this.toggleIndex = null;
        this.tailWidth = 0;
      } else {
        this.toggleIndex = index;
        this.tailWidth = -124;
      }
    },
    changeTab() {
      this.toggleIndex = null;
      this.tailWidth = 0;
      this.editIndex = null;
      this.addNewItem = false;
    },
    addItem() {
      if (this.activeName === 'done') {
        this.newAddItem = true;
        this.activeName = 'todo';
        return;
      }
      if (this.editIndex === null) {
        this.addTodoList();
        this.editIndex = this.todoList.length - 1;
      } else {
        const curIndex = this.editIndex;
        this.editIndex = null;
        this.toggleIndex = null;
        this.tailWidth = 0;
        this.$nextTick(() => {
          this.updateList(curIndex);
        });
      }
    },
    async doUpdateCheck(id) {
      await this.updateCheck(id, this.activeName === 'todo' ? 1 : 2, this.selectedDate);
      await this.getDotAttributes({ year: this.currentYear, month: this.currentMonth }, true);
    },
  },
};
</script>
<style lang="scss">
@mixin el-tabs-color($color, $hover) {
  .el-tabs__active-bar {
    background-color: $color;
  }

  .el-tabs__item {
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

.calendar {
  .vc-day-content:focus {
    background-color: inherit !important;
  }

  .el-tabs__header {
    margin: 0;
  }

  .el-drawer__header {
    margin-bottom: 0;
  }

  .tab-todo {
    @include el-tabs-color(#f56e71, #6880ff);
  }

  .tab-done {
    @include el-tabs-color(#6880ff, #f56e71);
  }

  .vc-day-layer.vc-day-box-center-bottom {
    bottom: -2px;
  }
}
</style>
<style lang="scss">
.calendar {
  .el-tabs__item {
    font-size: 2rem;
    font-weight: bold;
  }
}
</style>
<style lang="scss" scoped>
.calendar {
  height: calc(100% - 30px);

  .el-tab-pane-space {
    padding-bottom: 0.5rem;
  }

  .todo-list {
    height: calc(100% - 310px - 7.5rem);
    margin: 1rem 0;
    width: 100%;
    overflow-y: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .todo-btn {
    width: 100%;
    height: 5rem;
    border: none;
    background-color: #fc9a9d;
    color: white;
    font-size: 2rem;
  }

  .swiper-button {
    height: 100%;
    width: 62px;
    position: relative;

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 3rem;
      color: white;
    }

    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 3rem;
      color: white;
    }

    &.edit {
      background-color: #6880ff;
    }

    &.delete {
      background-color: #f56e71;
    }
  }

  .drawer {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: flex-end;

    .priority-button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      position: relative;
      width: 9rem;
      height: 6rem;
      border-radius: 2rem;

      span {
        color: white;
      }

      &::after {
        position: absolute;
        bottom: 0;
        transform: translateY(120%);
        content: attr(data-label);
        font-size: 1.8rem;
        font-weight: bold;
      }
    }
  }

  .priority-description {
    font-size: 2rem;
    color: black;

    strong {
      font-size: 2.5rem;
    }
  }

  .vertical-align-center {
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
