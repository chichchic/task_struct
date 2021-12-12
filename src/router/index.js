import { createRouter, createWebHistory } from "vue-router";
import Todo from "../views/Todo.vue";
import Calendar from "../views/Calendar.vue";
import SignIn from "../views/SignIn.vue";
import Desktop from "../views/Desktop.vue";
import store from "@/store/index.js";
import Error404 from "../views/Error404.vue";

const routes = [
  {
    path: "/",
    name: "main",
    beforeEnter: (to, from, next) => {
      const { uid } = store.state.user;
      if (uid) {
        next("/desktop");
      } else {
        next("/signin");
      }
    },
  },
  {
    path: "/todo",
    name: "Todo",
    component: Todo,
    beforeEnter: (to, from, next) => {
      const { uid } = store.state.user;
      if (uid) {
        next();
      } else {
        next("/signin");
      }
    },
  },
  {
    path: "/desktop",
    name: "Desktop",
    component: Desktop,
    beforeEnter: (to, from, next) => {
      const { uid } = store.state.user;
      const ismobild = window.matchMedia(
        "only screen and (max-width: 760px)"
      ).matches;
      if (!uid) {
        next("/signin");
      } else if (ismobild) {
        next("/todo");
      } else {
        next();
      }
    },
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: Calendar,
    beforeEnter: (to, from, next) => {
      const { uid } = store.state.user;
      if (uid) {
        next();
      } else {
        next("/signin");
      }
    },
  },
  {
    path: "/signin",
    name: "SignIn",
    component: SignIn,
    beforeEnter: (to, from, next) => {
      const { uid } = store.state.user;
      const ismobild = window.matchMedia(
        "only screen and (max-width: 760px)"
      ).matches;
      if (!uid) {
        next();
      } else if (ismobild) {
        next("/todo");
      } else {
        next("/desktop");
      }
    },
  },
  {
    path: "/:catchAll(.*)*",
    component: Error404,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
