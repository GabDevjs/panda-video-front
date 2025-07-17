<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-sm border-r border-gray-200 fixed h-full z-10">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="p-6 border-b border-gray-200">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l7-5-7-5z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900">Panda Video</span>
          </router-link>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-6">
          <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Menu</h2>
          
          <div class="space-y-2">
            <router-link
              to="/dashboard"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.name === 'Dashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Dashboard
            </router-link>
            
            <router-link
              to="/upload"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.name === 'Upload' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              Upload
            </router-link>
            
            <router-link
              to="/my-videos"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.name === 'Videos' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              Meus Vídeos
            </router-link>
            
            <router-link
              to="/billing"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.name === 'Billing' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              Faturamento
            </router-link>

            <router-link
              to="/public-videos"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.name === 'PublicVideos' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              Vídeos Públicos
            </router-link>
          </div>
        </nav>

        <!-- User info -->
        <div class="p-6 border-t border-gray-200 bg-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center">
                <span class="text-white font-medium">
                  {{ authStore.currentUser?.username?.charAt(0).toUpperCase() || 'U' }}
                </span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">{{ authStore.currentUser?.username || 'Usuário' }}</p>
                <p class="text-xs text-gray-500">{{ authStore.currentUser?.email || '' }}</p>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 ml-64">
      <!-- Top header -->
      <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Search bar if needed -->
            <div v-if="showSearch" class="relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                class="w-64 px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
  pageTitle: {
    type: String,
    default: ''
  },
  showSearch: {
    type: Boolean,
    default: false
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>