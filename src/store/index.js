import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const moduleList = ["base", "user"];

const modules = {};

moduleList.forEach((val) => {
  const path = require(`./modules/${val}.js`);
  modules[val] = path.default;
});

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules,
  plugins: [
    createPersistedState({
      paths: ["user"],
    }),
  ],
});
