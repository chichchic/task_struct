import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Account from '../views/Account.vue';
import Error404 from '../views/404.vue';

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
    path: '/:catchAll(.*)*',
    component: Error404,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
