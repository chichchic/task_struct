import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Todo from '../views/Todo.vue';
import Setting from '../views/Setting.vue';
import Withdraw from '../views/Withdraw.vue';

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
