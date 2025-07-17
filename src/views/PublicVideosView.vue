<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header público -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l7-5-7-5z" />
                </svg>
              </div>
              <span class="text-xl font-bold text-gray-900">Panda Video</span>
            </router-link>
          </div>

          <!-- Search bar -->
          <div class="flex-1 max-w-2xl mx-8">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Pesquisar vídeos..."
                class="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-transparent"
                @input="handleSearch"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <!-- Auth buttons -->
          <div class="flex items-center space-x-4">
            <router-link
              v-if="!isAuthenticated"
              to="/login"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Entrar
            </router-link>
            <router-link
              v-if="!isAuthenticated"
              to="/register"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Criar Conta
            </router-link>
            <div v-else class="flex items-center space-x-4">
              <router-link
                to="/upload"
                class="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                <span>Upload</span>
              </router-link>
              <router-link
                to="/dashboard"
                class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Título da página -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Vídeos em Destaque</h1>
        <p class="text-gray-600">Descubra os melhores vídeos compartilhados pela nossa comunidade</p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Erro ao carregar vídeos</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="loadVideos"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Tentar Novamente
        </button>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredVideos.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5v10l7-5-7-5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ searchQuery ? 'Nenhum vídeo encontrado' : 'Nenhum vídeo público disponível' }}
        </h3>
        <p class="text-gray-600">
          {{ searchQuery ? 'Tente pesquisar por outros termos' : 'Seja o primeiro a compartilhar um vídeo público!' }}
        </p>
        <router-link
          v-if="!searchQuery"
          to="/upload"
          class="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium"
        >
          Fazer Upload
        </router-link>
      </div>

      <!-- Grid de vídeos -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <VideoCard
            v-for="video in filteredVideos"
            :key="video.id"
            :video="video"
          />
        </div>

        <!-- Paginação -->
        <div v-if="pagination && pagination.totalPages > 1" class="flex justify-center mt-12">
          <nav class="flex items-center space-x-2">
            <button
              :disabled="pagination.page <= 1"
              @click="changePage(pagination.page - 1)"
              class="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium border',
                  page === pagination.page
                    ? 'border-red-600 bg-red-600 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                ]"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
              <span v-else class="px-3 py-2 text-gray-500">...</span>
            </template>
            
            <button
              :disabled="pagination.page >= pagination.totalPages"
              @click="changePage(pagination.page + 1)"
              class="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </nav>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import VideoCard from '@/components/VideoCard.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const videos = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const pagination = ref(null)
const currentPage = ref(1)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const filteredVideos = computed(() => {
  if (!searchQuery.value) return videos.value
  
  const query = searchQuery.value.toLowerCase()
  return videos.value.filter(video => 
    video.title.toLowerCase().includes(query) ||
    video.description?.toLowerCase().includes(query) ||
    video.user?.username.toLowerCase().includes(query)
  )
})

const visiblePages = computed(() => {
  if (!pagination.value) return []
  
  const { page, totalPages } = pagination.value
  const pages = []
  const maxVisible = 7
  
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    if (page <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...', totalPages)
    } else if (page >= totalPages - 3) {
      pages.push(1, '...')
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1, '...', page - 1, page, page + 1, '...', totalPages)
    }
  }
  
  return pages
})

const loadVideos = async (page = 1) => {
  try {
    loading.value = true
    error.value = null
    
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const response = await fetch(`${apiBaseUrl}/videos/public?page=${page}&limit=12`)
    
    if (!response.ok) {
      throw new Error('Erro ao carregar vídeos')
    }
    
    const data = await response.json()
    videos.value = data.videos
    pagination.value = data.pagination
    currentPage.value = page
    
  } catch (err) {
    console.error('Erro ao carregar vídeos:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages && page !== currentPage.value) {
    loadVideos(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleSearch = () => {
  // Implementar busca em tempo real se necessário
}

onMounted(() => {
  loadVideos()
})
</script>