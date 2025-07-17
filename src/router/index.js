import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Rotas públicas
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/PublicVideosView.vue')
    },
    {
      path: '/watch/:id',
      name: 'VideoPlayer',
      component: () => import('@/views/VideoPlayerView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    
    // Rotas privadas (requerem autenticação)
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/my-videos',
      name: 'MyVideos',
      component: () => import('@/views/VideosView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/videos/:id',
      name: 'VideoDetails',
      component: () => import('@/views/VideoDetailsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/upload',
      name: 'Upload',
      component: () => import('@/views/UploadView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/billing',
      name: 'Billing',
      component: () => import('@/views/BillingView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router