<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-14">
        <!-- Logo minimalista -->
        <div class="flex items-center">
          <router-link to="/dashboard" class="flex items-center space-x-3 group">
            <div class="w-8 h-8 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span class="text-lg font-semibold text-gray-900 hidden sm:block">PandaVideo</span>
          </router-link>
        </div>

        <!-- Navegação central -->
        <nav class="hidden md:flex items-center space-x-1">
          <router-link 
            to="/dashboard" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === 'Dashboard' }"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h2a2 2 0 012 2v6H8V5z"/>
            </svg>
            Dashboard
          </router-link>
          <router-link 
            to="/my-videos" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === 'MyVideos' }"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            Meus Vídeos
          </router-link>
          <router-link 
            to="/upload" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === 'Upload' }"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            Upload
          </router-link>
          <router-link 
            to="/billing" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === 'Billing' }"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            Faturamento
          </router-link>
        </nav>

        <!-- Menu do usuário -->
        <div class="flex items-center space-x-3">
          <div class="hidden sm:flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-gray-900 to-gray-700 rounded-full flex items-center justify-center">
              <span class="text-white font-medium text-sm">
                {{ userInitial }}
              </span>
            </div>
            <span class="text-sm text-gray-700 font-medium">{{ authStore.currentUser?.username }}</span>
          </div>
          
          <button 
            @click="logout"
            class="btn-ghost flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span class="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const userInitial = computed(() => {
  const username = authStore.currentUser?.username || 'U'
  return username.charAt(0).toUpperCase()
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>