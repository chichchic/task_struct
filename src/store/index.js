import { createStore } from 'vuex';

export default createStore({
  state: {
    fireUser: null,
  },
  mutations: {
    setFireUser(state, fu) {
      state.fireUser = fu;
    },
  },
  actions: {},
  modules: {},
});
