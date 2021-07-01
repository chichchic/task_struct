import { createApp } from 'vue';
import App from '@/App.vue';
import router from './router';
import store from './store';
import installElementPlus from './plugins/element';
import '@/assets/style/main.scss';

//primeVue
const app = createApp(App);
app.use(store).use(router);
installElementPlus(app);
app.mount('#app');
