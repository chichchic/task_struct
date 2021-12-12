import { ElLoading } from "element-plus";
export default {
  namespaced: true,
  state: {
    $loading: null,
  },
  mutations: {
    setLoading(state, payload) {
      if (payload && state.$loading === null) {
        state.$loading = ElLoading.service({ fullScreen: true });
        return;
      }
      state.$loading?.close();
      state.$loading = null;
    },
  },
  actions: {},
};
