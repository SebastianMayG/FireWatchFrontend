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

      beforeEnter: () => (useAnalysisStore().bbox ? true : { name: 'dashboard' }),
    },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },

    { path: '/:pathMatch(.*)*', redirect: { name: 'dashboard' } },
  ],
})

export default router
