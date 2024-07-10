import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import router from './routes';

// axios.defaults.baseURL = '/api'; 
axios.defaults.withCredentials = true;

createApp(App).use(router).mount('#app');