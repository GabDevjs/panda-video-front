<template>
  <div>
    <TheHeader />
    
    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Back Button -->
        <div class="mb-6">
          <router-link 
            to="/videos" 
            class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Voltar para vídeos
          </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="videosStore.loading" class="animate-pulse">
          <div class="card mb-6">
            <div class="aspect-video bg-gray-200"></div>
            <div class="p-6 space-y-4">
              <div class="h-6 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="videosStore.error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ videosStore.error }}
              </h3>
              <div class="mt-2">
                <button @click="loadVideo" class="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded">
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Video Details -->
        <div v-else-if="video" class="space-y-6">
          <!-- Video Player -->
          <div class="card overflow-hidden">
            <div class="aspect-video bg-gray-900 relative">
              <!-- HLS Player for completed videos -->
              <div v-if="video.status === 'completed' && video.hls_path" class="w-full h-full">
                <HLSPlayer 
                  :src="fullHlsUrl"
                  @ready="onPlayerReady"
                  @error="onPlayerError"
                  @play="onPlayerPlay"
                  @pause="onPlayerPause"
                />
              </div>
              
              <!-- Status Display for non-completed videos -->
              <div v-else class="w-full h-full flex items-center justify-center">
                <div class="text-center text-white">
                  <div v-if="video.status === 'processing'" class="space-y-4">
                    <div class="animate-spin mx-auto h-12 w-12">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-medium">Processando vídeo...</h3>
                      <p class="text-sm opacity-75">Aguarde enquanto convertemos seu vídeo para streaming</p>
                    </div>
                  </div>
                  
                  <div v-else-if="video.status === 'failed'" class="space-y-4">
                    <div class="h-12 w-12 text-red-400 mx-auto">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-medium">Erro no processamento</h3>
                      <p class="text-sm opacity-75">Ocorreu um erro ao processar este vídeo</p>
                    </div>
                  </div>
                  
                  <div v-else class="space-y-4">
                    <div class="h-12 w-12 text-blue-400 mx-auto">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-medium">Preparando vídeo...</h3>
                      <p class="text-sm opacity-75">Seu vídeo está sendo preparado para processamento</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Video Info -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Info -->
            <div class="lg:col-span-2 space-y-6">
              <div class="card p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h1 class="text-2xl font-bold text-gray-900">{{ video.title }}</h1>
                    <div class="flex items-center mt-2 space-x-4">
                      <span class="text-xs px-2 py-1 rounded-full" :class="statusBadge(video.status)">
                        {{ statusText(video.status) }}
                      </span>
                      <span class="text-sm text-gray-500">{{ formatDate(video.created_at) }}</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="video.description" class="mt-4">
                  <h3 class="text-sm font-medium text-gray-900 mb-2">Descrição</h3>
                  <p class="text-gray-700 whitespace-pre-wrap">{{ video.description }}</p>
                </div>
              </div>

              <!-- HLS URL for completed videos -->
              <div v-if="video.status === 'completed' && video.hls_path" class="card p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">URL do Streaming</h3>
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <code class="text-sm text-gray-800 break-all">{{ fullHlsUrl }}</code>
                    <button 
                      @click="copyToClipboard(fullHlsUrl)"
                      class="ml-2 btn-secondary text-xs py-1 px-2"
                      :class="{ 'bg-green-100 text-green-800': copied }"
                    >
                      {{ copied ? 'Copiado!' : 'Copiar' }}
                    </button>
                  </div>
                </div>
                <p class="text-sm text-gray-500 mt-2">
                  Use esta URL para reproduzir o vídeo em players que suportam HLS
                </p>
              </div>
            </div>

            <!-- Side Info -->
            <div class="space-y-6">
              <!-- Video Stats -->
              <div class="card p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Informações</h3>
                <dl class="space-y-3">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Status</dt>
                    <dd class="mt-1">
                      <span class="text-xs px-2 py-1 rounded-full" :class="statusBadge(video.status)">
                        {{ statusText(video.status) }}
                      </span>
                    </dd>
                  </div>
                  
                  <div v-if="video.duration">
                    <dt class="text-sm font-medium text-gray-500">Duração</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formatDuration(video.duration) }}</dd>
                  </div>
                  
                  <div v-if="video.original_resolution">
                    <dt class="text-sm font-medium text-gray-500">Resolução Original</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ video.original_resolution }}</dd>
                  </div>
                  
                  <div v-if="video.available_resolutions && video.available_resolutions.length > 0">
                    <dt class="text-sm font-medium text-gray-500">Resoluções Disponíveis</dt>
                    <dd class="mt-1">
                      <div class="flex flex-wrap gap-1">
                        <span 
                          v-for="resolution in video.available_resolutions" 
                          :key="resolution"
                          class="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full"
                        >
                          {{ resolution }}
                        </span>
                      </div>
                    </dd>
                  </div>
                  
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Criado em</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formatDate(video.created_at) }}</dd>
                  </div>
                  
                  <div v-if="video.updated_at !== video.created_at">
                    <dt class="text-sm font-medium text-gray-500">Atualizado em</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formatDate(video.updated_at) }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Processing Cost -->
              <div v-if="video.status === 'completed' && video.duration" class="card p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Custo de Processamento</h3>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Minutos processados:</span>
                    <span class="font-medium">{{ Math.ceil(video.duration / 60) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Taxa por minuto:</span>
                    <span class="font-medium">$0.50</span>
                  </div>
                  <hr class="my-2">
                  <div class="flex justify-between">
                    <span class="font-medium text-gray-900">Total:</span>
                    <span class="font-bold text-primary-600">
                      ${{ (Math.ceil(video.duration / 60) * 0.5).toFixed(2) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/components/TheHeader.vue'
import HLSPlayer from '@/components/HLSPlayer.vue'
import { useVideosStore } from '@/stores/videos'

const route = useRoute()
const videosStore = useVideosStore()

const copied = ref(false)
const playerReady = ref(false)

const video = computed(() => videosStore.currentVideo)
const apiBaseUrl = computed(() => import.meta.env.VITE_API_URL || 'http://localhost:3000/api')

const fullHlsUrl = computed(() => {
  if (video.value?.hls_path) {
    return `${apiBaseUrl.value.replace('/api', '')}${video.value.hls_path}`
  }
  return ''
})

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

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const onPlayerReady = () => {
  console.log('Video player is ready')
  playerReady.value = true
}

const onPlayerError = (error) => {
  console.error('Video player error:', error)
  playerReady.value = false
}

const onPlayerPlay = () => {
  console.log('Video started playing')
}

const onPlayerPause = () => {
  console.log('Video paused')
}

const loadVideo = async () => {
  const videoId = route.params.id
  await videosStore.fetchVideo(videoId)
}

// Watch for video changes to track readiness
watch(
  () => video.value?.status === 'completed' && video.value?.hls_path,
  (canPlay) => {
    if (canPlay) {
      console.log('Video ready for playback')
    }
  }
)

// Auto-refresh para vídeos em processamento
let refreshInterval
onMounted(async () => {
  await loadVideo()
  
  // Configurar refresh automático se o vídeo está processando
  refreshInterval = setInterval(async () => {
    if (video.value && (video.value.status === 'processing' || video.value.status === 'uploading')) {
      await loadVideo()
    }
  }, 5000) // Atualiza a cada 5 segundos
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  videosStore.clearCurrentVideo()
})
</script>