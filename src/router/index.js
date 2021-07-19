import { createRouter, createWebHistory } from 'vue-router';
import Error404 from '../views/404.vue';

const routes = [
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
