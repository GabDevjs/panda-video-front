<template>
  <div class="group cursor-pointer">
    <!-- Thumbnail container estilo YouTube -->
    <div class="relative">
      <router-link :to="{ name: 'VideoPlayer', params: { id: video.id } }" class="block">
        <div class="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden">
          <img
            v-if="thumbnailUrl"
            :src="thumbnailUrl"
            :alt="video.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            @error="handleImageError"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-gray-200"
          >
            <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          
          <!-- Play overlay minimalista -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <div class="w-12 h-12 bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
              <svg class="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          
          <!-- Badge de duração estilo YouTube -->
          <div
            v-if="formattedDuration"
            class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-medium backdrop-blur-sm"
          >
            {{ formattedDuration }}
          </div>
          
          <!-- Badge de status apenas para vídeos não completados e quando relevante -->
          <div
            v-if="shouldShowStatusBadge"
            class="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium"
            :class="statusBadgeClass"
          >
            {{ statusText }}
          </div>
        </div>
      </router-link>
    </div>

    <!-- Informações do vídeo estilo YouTube -->
    <div class="flex items-start space-x-3 mt-3">
      <!-- Avatar do usuário -->
      <div class="flex-shrink-0 mt-1">
        <div class="w-9 h-9 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center">
          <span class="text-white font-medium text-sm">
            {{ userInitial }}
          </span>
        </div>
      </div>

      <!-- Detalhes do vídeo -->
      <div class="flex-1 min-w-0">
        <router-link :to="{ name: 'VideoPlayer', params: { id: video.id } }">
          <h3 class="text-sm font-medium text-gray-900 line-clamp-2 hover:text-gray-700 transition-colors leading-5 mb-1">
            {{ video.title }}
          </h3>
        </router-link>
        
        <p class="text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
          {{ video.user?.username || 'Usuário' }}
        </p>
        
        <div class="text-sm text-gray-500 mt-1 flex items-center space-x-1">
          <span>{{ timeAgo }}</span>
          <span v-if="video.original_resolution" class="before:content-['•'] before:mx-1">{{ video.original_resolution }}</span>
        </div>
      </div>
      
      <!-- Menu de opções -->
      <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button class="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  video: {
    type: Object,
    required: true
  }
})

const thumbnailUrl = computed(() => {
  if (!props.video.thumbnail_path) return null
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  return `${apiBaseUrl.replace('/api', '')}${props.video.thumbnail_path}`
})

const userInitial = computed(() => {
  const username = props.video.user?.username || 'U'
  return username.charAt(0).toUpperCase()
})

const formattedDuration = computed(() => {
  if (!props.video.duration) return null
  
  const totalSeconds = props.video.duration
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const timeAgo = computed(() => {
  if (!props.video.created_at) return ''
  
  const now = new Date()
  const createdAt = new Date(props.video.created_at)
  const diffInSeconds = Math.floor((now - createdAt) / 1000)
  
  if (diffInSeconds < 60) return 'há poucos segundos'
  if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} h`
  if (diffInSeconds < 2592000) return `há ${Math.floor(diffInSeconds / 86400)} dias`
  if (diffInSeconds < 31536000) return `há ${Math.floor(diffInSeconds / 2592000)} meses`
  return `há ${Math.floor(diffInSeconds / 31536000)} anos`
})

const statusBadgeClass = computed(() => {
  switch (props.video.status) {
    case 'uploading':
      return 'bg-blue-500 text-white'
    case 'processing':
      return 'bg-yellow-500 text-white'
    case 'failed':
      return 'bg-red-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
})

const shouldShowStatusBadge = computed(() => {
  // Não mostrar badge para vídeos completados ou na visualização de vídeos públicos
  if (props.video.status === 'completed') return false
  
  // Mostrar apenas para status relevantes que precisam de atenção do usuário
  return ['uploading', 'processing', 'failed'].includes(props.video.status)
})

const statusText = computed(() => {
  switch (props.video.status) {
    case 'uploading':
      return 'Enviando'
    case 'processing':
      return 'Processando'
    case 'failed':
      return 'Erro'
    default:
      return 'Pendente'
  }
})

const handleImageError = (event) => {
  event.target.style.display = 'none'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>