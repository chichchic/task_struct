export default {
  namespaced: true,
  state: {
    displayName: null,
    email: null,
    phoneNumber: null,
    photoURL: null,
    providerId: null,
    uid: null,
  },
  mutations: {
    setUserInfo(state, payload) {
      const providerData = {
        displayName: null,
        email: null,
        phoneNumber: null,
        photoURL: null,
        providerId: null,
        uid: null,
      };
      const userData = Object.assign(providerData, payload);
      for (const key in providerData) {
        state[key] = userData[key];
      }
    },
  },
  actions: {},
};
