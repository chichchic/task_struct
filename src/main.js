import { createApp } from 'vue';
import App from '@/App.vue';
import router from './router';
import store from './store';
import installElementPlus from './plugins/element';
import { DatePicker } from 'v-calendar';
import '@/assets/style/main.scss';
import i18n from './i18n';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);
//FIXME: 로그인 후 다시 로그인 페이지로 로드되고 몇 초 후에 todo화면으로 넘어감
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('login from main.js');
    store.commit('base/setLoading', true);
    try {
      const $firestore = firebase.firestore();
      const user = firebase.auth().currentUser;
      const providerData = user.providerData[0];
      const { uid, email, displayName, phoneNumber, providerId } = providerData;
      const users = $firestore.collection('users');
      const doc = users.doc(uid).get();
      if (!doc.exists) {
        users.doc(uid).set({
          email,
          displayName,
          phoneNumber,
          providerId,
          createdAt: new Date(),
          doneCount: 0,
        });
        store.commit('user/setUserInfo', { ...providerData });
      } else {
        const userData = doc.data();
        store.commit('user/setUserInfo', { ...userData, uid });
      }
    } catch (error) {
      console.error(error);
      // store.commit('base/setLoading', false);
    } finally {
      store.commit('base/setLoading', false);
      console.log('done@@!!');
      const ismobild = window.matchMedia('only screen and (max-width: 760px)').matches;
      if (ismobild) {
        router.push('Todo');
      } else {
        router.push('Desktop');
      }
    }
  } else {
    // store.commit('base/setLoading', false);
    console.log('logout from main.js');
  }
});
const app = createApp(App);
app.use(store).use(router).use(i18n);
app.component('DatePicker', DatePicker);
app.config.globalProperties.$firestore = firebase.firestore();
installElementPlus(app);
app.mount('#app');
