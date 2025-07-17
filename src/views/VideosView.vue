<template>
  <SidebarLayout page-title="Meus Vídeos">
    <div class="max-w-screen-2xl mx-auto">
      <!-- Header da página -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div class="mb-4 sm:mb-0">
          <h1 class="text-2xl font-semibold text-gray-900">Meus Vídeos</h1>
          <p class="text-gray-600 mt-1">{{ videosStore.pagination.total || 0 }} vídeos</p>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Filtros/ordenação -->
          <select class="input-field-rounded text-sm py-2 px-3">
            <option>Mais recentes</option>
            <option>Mais antigos</option>
            <option>Por título</option>
          </select>
          
          <router-link to="/upload" class="btn-primary flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Novo Vídeo
          </router-link>
        </div>
      </div>

      <!-- Estados de carregamento e erro -->
      <div v-if="videosStore.loading" class="video-grid">
        <div v-for="i in 8" :key="i" class="animate-pulse">
          <div class="aspect-video bg-gray-200 rounded-xl mb-3"></div>
          <div class="flex space-x-3">
            <div class="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="videosStore.error" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Erro ao carregar vídeos</h3>
        <p class="text-gray-600 mb-6">{{ videosStore.error }}</p>
        <button @click="loadVideos" class="btn-secondary">
          Tentar novamente
        </button>
      </div>

      <!-- Grid de vídeos estilo YouTube -->
      <div v-else-if="videosStore.hasVideos" class="space-y-8">
        <div class="video-grid fade-in">
          <VideoCard 
            v-for="video in videosStore.videos" 
            :key="video.id"
            :video="video"
          />
        </div>

        <!-- Paginação minimalista -->
        <div v-if="videosStore.pagination.totalPages > 1" class="flex justify-center">
          <nav class="flex items-center space-x-2">
            <button
              @click="changePage(videosStore.pagination.page - 1)"
              :disabled="videosStore.pagination.page === 1"
              class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            
            <div class="flex items-center space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  page === videosStore.pagination.page
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <button
              @click="changePage(videosStore.pagination.page + 1)"
              :disabled="videosStore.pagination.page === videosStore.pagination.totalPages"
              class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </nav>
        </div>
      </div>

      <!-- Estado vazio -->
      <div v-else class="text-center py-16">
        <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">Nenhum vídeo ainda</h3>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          Comece enviando seu primeiro vídeo para começar a criar sua biblioteca de conteúdo.
        </p>
        <router-link to="/upload" class="btn-primary inline-flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          Enviar primeiro vídeo
        </router-link>
      </div>
    </div>
  </SidebarLayout>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import VideoCard from '@/components/VideoCard.vue'
import { useVideosStore } from '@/stores/videos'

const videosStore = useVideosStore()
const router = useRouter()

const visiblePages = computed(() => {
  const current = videosStore.pagination.page
  const total = videosStore.pagination.totalPages
  const pages = []
  
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }
  
  return pages
})

const loadVideos = async () => {
  await videosStore.fetchVideos(videosStore.pagination.page, videosStore.pagination.limit)
}

const changePage = async (page) => {
  if (page >= 1 && page <= videosStore.pagination.totalPages) {
    await videosStore.fetchVideos(page, videosStore.pagination.limit)
  }
}

onMounted(() => {
  loadVideos()
})

// Auto-refresh para atualizar status dos vídeos
let refreshInterval
onMounted(() => {
  refreshInterval = setInterval(() => {
    if (videosStore.hasVideos) {
      loadVideos()
    }
  }, 10000) // Atualiza a cada 10 segundos
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>