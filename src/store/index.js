import { createStore } from 'vuex';

const moduleList = ['base', 'firebase', 'user'];

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
});
