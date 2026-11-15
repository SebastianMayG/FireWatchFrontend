import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import { useAnalysisStore } from '@/stores/analysis'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    {
      path: '/compare',
      name: 'compare',
      component: () => import('@/views/CompareView.vue'),
      // Compare necesita un área seleccionada (p. ej. al entrar por URL o recargar, no hay)
      beforeEnter: () => (useAnalysisStore().bbox ? true : { name: 'dashboard' }),
    },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
  ],
})

export default router
