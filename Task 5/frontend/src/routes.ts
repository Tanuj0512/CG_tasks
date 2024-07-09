import { createRouter, createWebHistory} from 'vue-router';
import  type { RouteRecordRaw  } from 'vue-router';
import Crud from './pages/crud.vue'; 
import Auth from './pages/Auth.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login', // Redirect to login by default
  },
  {
    path: '/crud',
    name: 'Crud',
    component: Crud,
  },
  {
    path: '/login',
    name: 'Login',
    component: Auth,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: Auth,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;