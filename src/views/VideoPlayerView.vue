<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header simplificado -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l7-5-7-5z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900">Panda Video</span>
          </router-link>

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
            <router-link
              v-else
              to="/dashboard"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Meus Vídeos
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-20 text-center">
      <div class="text-red-600 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Vídeo não encontrado</h2>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <router-link
        to="/"
        class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium"
      >
        Voltar ao Início
      </router-link>
    </div>

    <!-- Conteúdo do vídeo - Modo Teatro -->
    <div v-else-if="video" class="w-full">
      <!-- Video Player em modo teatro (full width) -->
      <div class="w-full bg-black">
        <div class="max-w-screen-2xl mx-auto">
          <HLSPlayer
            v-if="video.hls_path"
            :src="hlsUrl"
            :poster="thumbnailUrl"
            class="w-full aspect-video"
          />
          <div v-else class="w-full aspect-video flex items-center justify-center">
            <div class="text-white text-center">
              <svg class="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l7-5-7-5z" />
              </svg>
              <p>Vídeo em processamento...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Informações e sidebar abaixo do player -->
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Informações principais -->
          <div class="lg:col-span-2">

            <!-- Título e informações -->
            <div class="bg-white rounded-lg p-6 shadow-sm">
            <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ video.title }}</h1>
            
            <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div class="flex items-center space-x-4">
                <!-- Avatar e nome do usuário -->
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-semibold">
                      {{ userInitial }}
                    </span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ video.user?.username || 'Usuário' }}</p>
                    <p class="text-sm text-gray-600">{{ timeAgo }}</p>
                  </div>
                </div>
              </div>

              <!-- Botões de ação -->
              <div class="flex items-center space-x-4">
                <button
                  @click="toggleLike"
                  class="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span>Curtir</span>
                </button>
                
                <button
                  @click="shareVideo"
                  class="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>

            <!-- Descrição -->
            <div v-if="video.description" class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-2">Descrição</h3>
              <p class="text-gray-700 whitespace-pre-wrap">{{ video.description }}</p>
            </div>

            <!-- Informações técnicas -->
            <div class="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div v-if="video.duration" class="bg-gray-50 rounded-lg p-3 text-center">
                <div class="font-semibold text-gray-900">Duração</div>
                <div class="text-gray-600">{{ formattedDuration }}</div>
              </div>
              <div v-if="video.original_resolution" class="bg-gray-50 rounded-lg p-3 text-center">
                <div class="font-semibold text-gray-900">Resolução</div>
                <div class="text-gray-600">{{ video.original_resolution }}</div>
              </div>
              <div v-if="video.available_resolutions?.length" class="bg-gray-50 rounded-lg p-3 text-center">
                <div class="font-semibold text-gray-900">Qualidades</div>
                <div class="text-gray-600">{{ video.available_resolutions.length }} opções</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 text-center">
                <div class="font-semibold text-gray-900">Tipo</div>
                <div class="text-gray-600">{{ video.is_public ? 'Público' : 'Privado' }}</div>
              </div>
            </div>
            </div>
          </div>

          <!-- Sidebar com vídeos relacionados -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Vídeos Relacionados</h3>
            
            <div v-if="relatedVideos.length > 0" class="space-y-4">
              <div
                v-for="relatedVideo in relatedVideos"
                :key="relatedVideo.id"
                class="flex space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                @click="$router.push({ name: 'VideoPlayer', params: { id: relatedVideo.id } })"
              >
                <div class="w-24 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                  <img
                    v-if="getRelatedThumbnailUrl(relatedVideo)"
                    :src="getRelatedThumbnailUrl(relatedVideo)"
                    :alt="relatedVideo.title"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l7-5-7-5z" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 line-clamp-2">{{ relatedVideo.title }}</h4>
                  <p class="text-xs text-gray-600 mt-1">{{ relatedVideo.user?.username }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ getRelatedTimeAgo(relatedVideo.created_at) }}</p>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center text-gray-500 py-8">
              <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l7-5-7-5z" />
              </svg>
              <p>Nenhum vídeo relacionado encontrado</p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HLSPlayer from '@/components/HLSPlayer.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const video = ref(null)
const relatedVideos = ref([])
const loading = ref(true)
const error = ref(null)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const hlsUrl = computed(() => {
  if (!video.value?.hls_path) return null
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  return `${apiBaseUrl.replace('/api', '')}${video.value.hls_path}`
})

const thumbnailUrl = computed(() => {
  if (!video.value?.thumbnail_path) return null
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  return `${apiBaseUrl.replace('/api', '')}${video.value.thumbnail_path}`
})

const userInitial = computed(() => {
  const username = video.value?.user?.username || 'U'
  return username.charAt(0).toUpperCase()
})

const formattedDuration = computed(() => {
  if (!video.value?.duration) return null
  
  const totalSeconds = video.value.duration
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const timeAgo = computed(() => {
  if (!video.value?.created_at) return ''
  
  const now = new Date()
  const createdAt = new Date(video.value.created_at)
  const diffInSeconds = Math.floor((now - createdAt) / 1000)
  
  if (diffInSeconds < 60) return 'há poucos segundos'
  if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} h`
  if (diffInSeconds < 2592000) return `há ${Math.floor(diffInSeconds / 86400)} dias`
  if (diffInSeconds < 31536000) return `há ${Math.floor(diffInSeconds / 2592000)} meses`
  return `há ${Math.floor(diffInSeconds / 31536000)} anos`
})

const loadVideo = async (videoId) => {
  try {
    loading.value = true
    error.value = null
    
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const headers = {}
    
    // Adicionar token se estiver autenticado
    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`
    }
    
    const response = await fetch(`${apiBaseUrl}/videos/watch/${videoId}`, { headers })
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Vídeo não encontrado ou não está disponível')
      }
      throw new Error('Erro ao carregar vídeo')
    }
    
    const data = await response.json()
    video.value = data
    
    // Carregar vídeos relacionados
    loadRelatedVideos()
    
  } catch (err) {
    console.error('Erro ao carregar vídeo:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const loadRelatedVideos = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const response = await fetch(`${apiBaseUrl}/videos/public?limit=6`)
    
    if (response.ok) {
      const data = await response.json()
      // Filtrar o vídeo atual dos relacionados
      relatedVideos.value = data.videos.filter(v => v.id !== video.value.id).slice(0, 5)
    }
  } catch (err) {
    console.warn('Erro ao carregar vídeos relacionados:', err)
  }
}

const getRelatedThumbnailUrl = (relatedVideo) => {
  if (!relatedVideo.thumbnail_path) return null
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  return `${apiBaseUrl.replace('/api', '')}${relatedVideo.thumbnail_path}`
}

const getRelatedTimeAgo = (createdAt) => {
  if (!createdAt) return ''
  
  const now = new Date()
  const created = new Date(createdAt)
  const diffInSeconds = Math.floor((now - created) / 1000)
  
  if (diffInSeconds < 60) return 'há poucos segundos'
  if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} h`
  if (diffInSeconds < 2592000) return `há ${Math.floor(diffInSeconds / 86400)} dias`
  if (diffInSeconds < 31536000) return `há ${Math.floor(diffInSeconds / 2592000)} meses`
  return `há ${Math.floor(diffInSeconds / 31536000)} anos`
}

const toggleLike = () => {
  // Implementar funcionalidade de curtida
  console.log('Toggle like')
}

const shareVideo = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: video.value.title,
        text: video.value.description,
        url: window.location.href
      })
    } catch (err) {
      console.log('Erro ao compartilhar:', err)
    }
  } else {
    // Fallback para copiar URL
    await navigator.clipboard.writeText(window.location.href)
    alert('Link copiado para a área de transferência!')
  }
}

// Watch para mudanças na rota
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadVideo(newId)
  }
}, { immediate: true })

onMounted(() => {
  if (route.params.id) {
    loadVideo(route.params.id)
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