

import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './routes';

axios.defaults.baseURL = 'http://localhost:3010'; 
createApp(App).use(router).mount('#app')
