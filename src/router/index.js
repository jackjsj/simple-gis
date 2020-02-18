import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && sessionStorage.getItem('isLogin') !== '1') {
    next('/login');
  } else {
    next();
  }
});

export default router;
