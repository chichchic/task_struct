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
firebase.auth().onAuthStateChanged((fu) => store.commit('setFireUser', fu));

const app = createApp(App);
app.use(store).use(router).use(i18n);
app.component('DatePicker', DatePicker);
installElementPlus(app);
app.mount('#app');
