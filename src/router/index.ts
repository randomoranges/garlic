import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/ad-display',
    name: 'AdDisplay',
    component: () => import(/* webpackChunkName: "ad-display" */ '../views/AdDisplay.vue'),    
  },
  {    

    path: '/hero-section',
    name: 'hero-section',
    component: () => import(/* webpackChunkName: "hero-section" */ '../views/HeroSection.vue'),
  },
  {
    path: '/catalouge-section',
    name: 'catalouge-section',
    component: () => import(/* webpackChunkName: "catalouge-section" */ '../views/CatalougeSection.vue'),
  },
  {
    path: '/',
    redirect: '/catalouge-section',  // Redirect to Catalouge Section by default
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
