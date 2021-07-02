import { createApp } from 'vue';
import App from '@/App.vue';
import router from './router';
import store from './store';
import installElementPlus from './plugins/element';
import '@/assets/style/main.scss';
import i18n from './i18n';

//primeVue
const app = createApp(App);
app.use(store).use(router).use(i18n);
installElementPlus(app);
app.mount('#app');
