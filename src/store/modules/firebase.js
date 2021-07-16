export default {
  namespaced: true,
  state: {
    fireUser: null,
  },
  mutations: {
    setFireUser(state, fu) {
      state.fireUser = fu;
    },
  },
  actions: {},
};
