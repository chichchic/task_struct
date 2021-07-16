import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Account from '../views/Account.vue';
import Todo from '../views/Todo.vue';
import Calendar from '../views/Calendar.vue';
import Setting from '../views/Setting.vue';
import Withdraw from '../views/Withdraw.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
