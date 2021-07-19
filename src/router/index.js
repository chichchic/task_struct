import { createRouter, createWebHistory } from 'vue-router';
import Todo from '../views/Todo.vue';
import Calendar from '../views/Calendar.vue';
import Setting from '../views/Setting.vue';
import Withdraw from '../views/Withdraw.vue';
import SignIn from '../views/SignIn.vue';
import store from '@/store/index.js';
import Error404 from '../views/404.vue';

const routes = [
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
  {
    path: '/:catchAll(.*)*',
    component: Error404,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
