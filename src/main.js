import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router/index';
import store from './store';
import installElementPlus from './plugins/element';
import { DatePicker } from 'v-calendar';
import '@/assets/style/main.scss';
import i18n from './i18n';
import firebase from 'firebase';
import signInWithGoogle from '@/components/common/signInWithGoogle.js';

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
const { signIn } = signInWithGoogle();
//FIXME: 로그인 후 다시 로그인 페이지로 로드되고 몇 초 후에 todo화면으로 넘어감
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const login = async () => {
      await signIn();
      if (store.getters['user/returnUserState']) {
        const ismobild = window.matchMedia('only screen and (max-width: 760px)').matches;
        if (ismobild) {
          router.push('Todo');
        } else {
          router.push('Desktop');
        }
      }
    };
    login();
  } else {
    // log out
  }
});
const app = createApp(App);
app.use(store).use(router).use(i18n);
app.component('DatePicker', DatePicker);
app.config.globalProperties.$firestore = firebase.firestore();
installElementPlus(app);
app.mount('#app');
