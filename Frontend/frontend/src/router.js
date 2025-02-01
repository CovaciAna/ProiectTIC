import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from '@/components/AuthPage.vue';
import HomePage from '@/components/HomePage.vue';
import PatientsList from '@/components/PatientsList';
import MealsList from '@/components/MealsList';
import AssignMeals from '@/components/AssignMeals'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const routes = [
  { path: '/', redirect: '/auth' },
  { path: '/auth', component: AuthPage },
  { path: '/home', component: HomePage, meta: { requiresAuth: true }},
  { path: '/patients', component: PatientsList, meta: { requiresAuth: true }},
  { path: '/meals', component: MealsList, meta: { requiresAuth: true }},
  { path: '/assignmeals', component: AssignMeals, meta: { requiresAuth: true }}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (to.meta.requiresAuth && !user) {
      next('/auth'); 
    } else {
      next();
    }
  });
});

export default router;
