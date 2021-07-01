import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from 'firebase/app';
import firebaseConfig from '../firebaseConfig';
import 'firebase/auth';

firebase.initializeApp(firebaseConfig);
createApp(App).use(store).use(router).mount('#app');
firebase.auth().onAuthStateChanged((fu) => store.commit('setFireUser', fu));
