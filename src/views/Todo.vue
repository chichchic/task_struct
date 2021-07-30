<template>
  <section class="todo">
    <el-tabs :class="`tab-${activeName}`" v-model="activeName" @tab-click="changeTab" stretch>
      <el-tab-pane v-for="{ label, name } in tabs" :key="name" :label="label" :name="name">
        <p class="subtitle_task">{{ $t(subtitleTaskText, { task_count }) }}</p>
      </el-tab-pane>
    </el-tabs>
    <ul class="todo-list" ref="swipeListener">
      <li v-for="({ check, input, priority }, index) in todoList" :key="index" :data-index="index">
        <Swiper :tailWidth="toggleIndex == index ? tailWidth : 0">
          <template v-slot:main>
            <TodoItem
              :check="check"
              :input="input"
              :priority="priority"
              :tab="'tab-' + activeName"
              :lineThrough="activeName === 'done'"
              @updateCheck="(value) => updateCheck(value, index)"
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
    <el-button class="add-button" type="primary" @click.prevent="addItem">{{
      editIndex === null ? `+ ${$t('default.create_new')}` : `+ ${$t('default.enroll_new')}`
    }}</el-button>
    <el-drawer
      v-model="prDrawer"
      @close="
        () => {
          pushTodoList();
          sorting();
        }
      "
      direction="btt"
      size="50%"
      :show-close="false"
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
            <span>{{ $t(icon) }}</span>
          </el-button>
        </article>
      </div>
    </el-drawer>
  </section>
</template>
<script>
import TodoItem from '@/components/Todo/TodoItem.vue';
import useTodoList from '@/components/Todo/useTodoList';
import useElTabs from '@/components/elementPlus/useElTabs';
import Swiper from '@/components/common/Swiper.vue';

//NOTE: 데이터베이스와 연결한 후 refresh button 로직 구현하기.
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
    } = useTodoList();
    const { tabs, activeName } = useElTabs(
      [
        { label: 'TODO', name: 'todo' },
        { label: 'DONE', name: 'done' },
      ],
      'todo'
    );
    return {
      todoList,
      prDrawer,
      fetchTodoList,
      pushTodoList,
      updateCheck,
      repeatTodoList,
      updateInput,
      addTodoList,
      updateList,
      removeList,
      setPriority,
      sorting,
      tabs,
      activeName,
    };
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
  }),
  mounted() {
    let startPoint = null;
    const touchmove = (e) => {
      const dif = Math.floor(e.touches[0].pageX - startPoint);
      this.tailWidth = dif < -124 ? -124 : dif;
    };
    const throttelTouchMove = this.throttle(touchmove, 50);
    this.$refs.swipeListener.addEventListener('touchstart', (e) => {
      startPoint = e.touches[0].pageX;
      this.$refs.swipeListener.addEventListener('touchmove', throttelTouchMove);
      const index = e.target.closest('li')?.dataset.index;
      //FIXME: editmode 해제시키는 부분 분리해서 관리하기
      if (this.editIndex !== null && !e.target.closest('.enroll')) {
        this.updateList(this.editIndex, false);
        this.editIndex = null;
      }
      this.toggleIndex = index;
      this.tailWidth = 0;
    });
    this.$refs.swipeListener.addEventListener('touchend', () => {
      this.$refs.swipeListener.removeEventListener('touchmove', touchmove);
      if (this.tailWidth < -30) {
        this.tailWidth = -124;
      } else {
        this.tailWidth = 0;
      }
    });
    this.fetchTodoList(this.activeName === 'todo' ? 1 : 2);
  },
  computed: {
    task_count() {
      return this.todoList.filter(({ check }) => (this.activeName === 'todo' ? !check : check)).length;
    },
    subtitleTaskText() {
      const list = {
        todo: 'default.subtitle_task_incomplete',
        done: 'default.subtitle_task_completed',
      };
      return list[this.activeName];
    },
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
    toggleSlider(index) {
      if (this.toggleIndex === index) {
        this.toggleIndex = null;
        this.tailWidth = 0;
      } else {
        this.toggleIndex = index;
        this.tailWidth = -124;
      }
    },
    throttle(fn, delay) {
      let timeout = false;
      return (...rest) => {
        if (!timeout) {
          timeout = true;
          fn.apply(this, rest);
          setTimeout(() => {
            timeout = false;
          }, delay);
        }
      };
    },
    changeTab() {
      this.toggleIndex = null;
      this.tailWidth = 0;
      this.editIndex = null;
      this.fetchTodoList(this.activeName === 'todo' ? 1 : 2);
    },
    setEditIndex(index) {
      this.editIndex = index;
      this.toggleIndex = null;
      this.tailWidth = 0;
    },
    addItem() {
      if (this.editIndex === null) {
        this.activeName = 'todo';
        this.addTodoList();
        this.editIndex = this.todoList.length - 1;
      } else {
        const curIndex = this.editIndex;
        this.editIndex = null;
        this.toggleIndex = null;
        this.tailWidth = 0;
        //FIXME: 나중에 등록 관련된 로직을 수정할 필요가 있음
        //NOTE: TodoItem 내부에 edit watch가 먼저 동작해야하는데 updateList가 먼저 동작해서 에러 수정을 위해 nextTick사용.
        this.$nextTick(() => {
          this.updateList(curIndex);
        });
      }
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
    font-size: 2rem;
    font-weight: bold;

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

.todo {
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
}
</style>
<style lang="scss" scoped>
.todo {
  height: calc(100% - 30px);

  .add-button {
    width: 100%;
    height: 5rem;
    margin-top: 1rem;
    font-size: 2rem;
  }

  .subtitle_task {
    color: #a7a7a7;
    position: relative;
    padding: 0.5rem;
    font-size: 1.2rem;
    display: inline-block;
  }

  .tab-todo {
    .subtitle_task {
      left: calc(25% - 1rem);
      transform: translateX(-50%);
    }
  }

  .tab-done {
    .subtitle_task {
      left: calc(75% + 1rem);
      transform: translateX(-50%);
    }
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
      font-size: 3.6rem;
      color: white;
    }

    &.edit {
      background-color: #6880ff;
    }

    &.delete {
      background-color: #f56e71;
    }
  }

  .todo-list {
    height: calc(100% - 65px - 6rem);
    width: 100%;
    overflow-y: scroll;
  }

  .enroll {
    background-color: rgb(217, 217, 217);
    width: 12rem;
    padding: 5px 20px;
    min-height: 2rem;
    border-radius: 30px;
    display: block;

    &-top {
      margin: 0 auto 10px auto;
    }

    &-bottom {
      margin: 10px auto 0 auto;
    }
  }

  .priority-description {
    font-size: 2rem;
    color: black;
    text-align: center;
    margin: 5rem 0;

    strong {
      font-size: 2.5rem;
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

  .vertical-align-center {
    height: 100%;
    display: flex;
    align-items: flex-start;
  }
}
</style>
