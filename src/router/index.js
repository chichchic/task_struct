import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Todo from '../views/Todo.vue';
import Calendar from '../views/Calendar.vue';
import Setting from '../views/Setting.vue';
import Withdraw from '../views/Withdraw.vue';
import SignIn from '../views/SignIn.vue';
import store from '@/store/index.js';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/todo',
    name: 'Todo',
    component: Todo,
    beforeEnter: (to, from, next) => {
      const { uid } = store.state.user;
      if (uid) {
        next();
      } else {
        next('/signin');
      }
    },
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
    beforeEnter: (to, from, next) => {
      const { uid } = store.state.user;
      if (uid) {
        next();
      } else {
        next('/signin');
      }
    },
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
  },
  {
    path: '/withdraw',
    name: 'Withdraw',
    component: Withdraw,
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn,
    beforeEnter: (to, from, next) => {
      const { uid } = store.state.user;
      if (!uid) {
        next();
      } else {
        next('/todo');
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
