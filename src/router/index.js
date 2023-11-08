import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'default-page',
      meta: { requiresSafe: false },
      component: () => import('../layouts/default-page.vue'),
      children: [
        {
          path: '/',
          name: 'landing',
          component: () => import('../views/landingPage.vue')
        },
        {
          path: '/create-safe',
          name: 'create safe',
          component: () => import('../views/createSafePage.vue')
        },
      ]
    },
    {
      path: '/',
      name: 'dashboard-page',
      component: () => import('../layouts/dashboard-page.vue'),
      meta: { requiresSafe: true },
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/home.vue')
        },
        {
          path: '/assets',
          name: 'assets',
          component: () => import('../views/assets.vue')
        },
        {
          path: '/transaction',
          name: 'transaction',
          component: () => import('../views/transaction.vue')
        },
        {
          path: '/new-safe',
          name: 'new safe',
          component: () => import('../views/newSafePage.vue')
        },
      ]
    },
    { path: "*", name: 'not-found', component: () => import('../views/pageNotFound.vue') }
  ]
});

router.beforeEach((to, from, next) => {
  const safeAddress = localStorage.getItem('safeAddress');
  const currentAddress = localStorage.getItem('currentAddress');

  if (to.name === 'not-found') {
    next(); 
  } else {
    if (to.matched.some(record => record.meta.requiresSafe) && !safeAddress) {
      next({ path: '/' }); 
    } else if (to.matched.every(record => !record.meta.requiresSafe) && safeAddress) {
      next({ path: '/home' }); 
    } else if (to.path === '/create-safe' && !currentAddress) {
      next({ path: '/' });
    } else {
      next();
    }
  }

});

export default router
