import { ElLoading } from 'element-plus';
export default {
  namespaced: true,
  state: {
    $loading: null,
  },
  mutations: {
    setLoading(state, payload) {
      if (!payload && state.$loading !== null) {
        state.$loading.close();
        state.$loading = null;
        return;
      }
      state.$loading = ElLoading.service({ fullScreen: true });
    },
  },
  actions: {},
};
