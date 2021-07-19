import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Todo from '../views/Todo.vue';
import Calendar from '../views/Calendar.vue';
import Setting from '../views/Setting.vue';
import Withdraw from '../views/Withdraw.vue';
import Error404 from '../views/404.vue';

const routes = [
  {
    path: '/:catchAll(.*)*',
    component: Error404,
  },
  {
    path: '/todo',
    name: 'Todo',
    component: Todo,
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
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
    path: '/:catchAll(.*)*',
    component: Error404,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
