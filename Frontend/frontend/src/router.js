import { createRouter, createWebHistory } from 'vue-router';
import PatientsList from '@/components/PatientsList.vue';
import MealsList from '@/components/MealsList.vue';

const routes = [
  { path: '/', component: () => import('@/components/HelloWorld.vue') },
  { path: '/patients', component: PatientsList },
  { path: '/meals', component: MealsList }
];

const router = createRouter({
  history: createWebHistory(), 
  routes
});

export default router;
