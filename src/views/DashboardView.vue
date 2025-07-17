<template>
  <SidebarLayout page-title="Dashboard">
    <div>
      <!-- Header com saudação -->
      <div class="mb-12">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">
          Olá, {{ authStore.currentUser?.username || 'Usuário' }}
        </h1>
        <p class="text-gray-600">Bem-vindo de volta ao PandaVideo</p>
      </div>

        <!-- Cards de estatísticas minimalistas -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div class="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total de vídeos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ videosStore.pagination.total || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Processados</p>
              <p class="text-2xl font-semibold text-gray-900">{{ completedVideos }}</p>
            </div>
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Faturamento total</p>
              <p class="text-2xl font-semibold text-gray-900">{{ billingStore.formattedTotal || '$0.00' }}</p>
            </div>
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

        <!-- Ações principais -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <!-- Ações rápidas minimalistas -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-6">Ações rápidas</h2>
          <div class="space-y-4">
            <router-link 
              to="/upload" 
              class="group flex items-center p-6 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all duration-200"
            >
              <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-opacity-30 transition-all">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-white">Enviar novo vídeo</h3>
                <p class="text-gray-300 text-sm mt-1">Faça upload e comece o processamento</p>
              </div>
              <svg class="w-5 h-5 text-white ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </router-link>

            <router-link 
              to="/my-videos" 
              class="group flex items-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-200"
            >
              <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Meus vídeos</h3>
                <p class="text-gray-600 text-sm mt-1">Gerencie sua biblioteca de conteúdo</p>
              </div>
              <svg class="w-5 h-5 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </router-link>

            <router-link 
              to="/billing" 
              class="group flex items-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-200"
            >
              <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Faturamento</h3>
                <p class="text-gray-600 text-sm mt-1">Veja seus custos de processamento</p>
              </div>
              <svg class="w-5 h-5 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </router-link>
          </div>
        </div>

        <!-- Atividades recentes -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-6">Atividade recente</h2>
          <div class="bg-gray-50 rounded-2xl p-6">
            <div v-if="videosStore.loading" class="space-y-4">
              <div v-for="i in 4" :key="i" class="animate-pulse flex items-center space-x-3">
                <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div class="flex-1">
                  <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            
            <div v-else-if="videosStore.hasVideos" class="space-y-4">
              <div 
                v-for="video in recentVideos" 
                :key="video.id"
                class="flex items-center space-x-3 group"
              >
                <div class="w-3 h-3 rounded-full flex-shrink-0" :class="statusColor(video.status)"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                    {{ video.title }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatDate(video.created_at) }}</p>
                </div>
                <span class="text-xs px-2 py-1 rounded-lg font-medium" :class="statusBadge(video.status)">
                  {{ statusText(video.status) }}
                </span>
              </div>
              
              <div class="pt-4 border-t border-gray-200">
                <router-link to="/my-videos" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Ver todos os vídeos →
                </router-link>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <p class="text-sm text-gray-600 mb-4">Nenhum vídeo ainda</p>
              <router-link to="/upload" class="btn-secondary text-sm">
                Enviar primeiro vídeo
              </router-link>
            </div>
          </div>
        </div>
        </div>
    </div>
  </SidebarLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useVideosStore } from '@/stores/videos'
import { useBillingStore } from '@/stores/billing'

const authStore = useAuthStore()
const videosStore = useVideosStore()
const billingStore = useBillingStore()

const recentVideos = computed(() => {
  return videosStore.videos.slice(0, 5)
})

const completedVideos = computed(() => {
  return videosStore.videos.filter(video => video.status === 'completed').length
})

const statusColor = (status) => {
  const colors = {
    'uploading': 'bg-blue-500',
    'processing': 'bg-yellow-500',
    'completed': 'bg-green-500',
    'failed': 'bg-red-500'
  }
  return colors[status] || 'bg-gray-500'
}

const statusBadge = (status) => {
  const badges = {
    'uploading': 'bg-blue-100 text-blue-800',
    'processing': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800'
  }
  return badges[status] || 'bg-gray-100 text-gray-800'
}

const statusText = (status) => {
  const texts = {
    'uploading': 'Enviando',
    'processing': 'Processando',
    'completed': 'Concluído',
    'failed': 'Falhou'
  }
  return texts[status] || 'Desconhecido'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await Promise.all([
    videosStore.fetchVideos(1, 10),
    billingStore.fetchBilling()
  ])
})
</script>