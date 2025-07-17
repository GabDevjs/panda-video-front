<template>
  <div class="w-full h-full relative rounded-lg overflow-hidden bg-gray-900">
    <!-- Loading overlay -->
    <div v-if="loading" class="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-10 backdrop-blur-sm">
      <div class="text-center text-white px-6 py-4 bg-black bg-opacity-50 rounded-lg">
        <div class="animate-spin mx-auto h-12 w-12 mb-4 text-primary-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </div>
        <p class="text-base font-medium">{{ loadingText }}</p>
        <div class="mt-2 w-32 h-1 bg-gray-600 rounded-full mx-auto overflow-hidden">
          <div class="h-full bg-primary-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
    
    <!-- Play button overlay when paused -->
    <div v-if="!loading && !isPlaying" class="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
      <div class="bg-black bg-opacity-50 rounded-full p-4 text-white opacity-75 hover:opacity-100 transition-opacity">
        <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    </div>

    <!-- Quality Selector -->
    <div v-if="availableQualities.length > 0" class="absolute top-4 right-4 z-20">
      <div class="relative">
        <button
          @click="showQualitySelector = !showQualitySelector"
          class="bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-opacity-75 transition-all flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>{{ getCurrentQualityText() }}</span>
        </button>
        
        <div v-if="showQualitySelector" class="absolute right-0 mt-2 bg-black bg-opacity-90 rounded-lg overflow-hidden shadow-lg min-w-32">
          <button
            @click="changeQuality(-1)"
            class="block w-full px-4 py-2 text-left text-white text-sm hover:bg-primary-600 transition-colors"
            :class="{ 'bg-primary-500': currentQuality === -1 }"
          >
            Auto
          </button>
          <button
            v-for="(quality, index) in availableQualities"
            :key="index"
            @click="changeQuality(index)"
            class="block w-full px-4 py-2 text-left text-white text-sm hover:bg-primary-600 transition-colors"
            :class="{ 'bg-primary-500': currentQuality === index }"
          >
            {{ quality.height }}p
          </button>
        </div>
      </div>
    </div>
    
    <video 
      ref="videoElement"
      class="w-full h-full bg-black rounded-lg"
      controls
      preload="auto"
      playsinline
      autoplay
      @loadstart="onLoadStart"
      @canplay="onCanPlay"
      @loadeddata="onLoadedData"
      @error="onError"
      @play="onPlay"
      @pause="onPause"
    >
      Seu navegador não suporta a reprodução de vídeo HLS.
    </video>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['ready', 'error', 'play', 'pause', 'qualityChange'])

const videoElement = ref(null)
const loading = ref(false)
const loadingText = ref('Carregando vídeo...')
const isPlaying = ref(false)
const showQualitySelector = ref(false)
const availableQualities = ref([])
const currentQuality = ref(-1) // -1 = auto
let hls = null
let loadTimeout = null

const onLoadStart = () => {
  loading.value = true
  loadingText.value = 'Iniciando carregamento...'
}

const onCanPlay = () => {
  loading.value = false
  emit('ready')
  // Tentar autoplay
  tryAutoplay()
}

const onLoadedData = () => {
  loading.value = false
  emit('ready')
}

const onError = (event) => {
  console.error('Video error:', event)
  loading.value = false
  emit('error', event)
}

const onPlay = () => {
  isPlaying.value = true
  emit('play')
}

const onPause = () => {
  isPlaying.value = false
  emit('pause')
}

const tryAutoplay = async () => {
  if (videoElement.value) {
    try {
      // Ativar áudio (desmutar)
      videoElement.value.muted = false
      // Tentar reproduzir
      await videoElement.value.play()
      console.log('Autoplay iniciado com sucesso com áudio ativo')
    } catch (error) {
      console.log('Autoplay bloqueado pelo navegador:', error.message)
      // Se autoplay falhar, ainda assim garantir que o áudio esteja ativo
      videoElement.value.muted = false
    }
  }
}

const getCurrentQualityText = () => {
  if (currentQuality.value === -1) return 'Auto'
  if (availableQualities.value[currentQuality.value]) {
    return `${availableQualities.value[currentQuality.value].height}p`
  }
  return 'Auto'
}

const changeQuality = (qualityIndex) => {
  if (hls) {
    if (qualityIndex === -1) {
      hls.currentLevel = -1 // Auto quality
    } else {
      hls.currentLevel = qualityIndex
    }
    currentQuality.value = qualityIndex
    showQualitySelector.value = false
    emit('qualityChange', qualityIndex === -1 ? 'auto' : availableQualities.value[qualityIndex])
  }
}

const destroyHls = () => {
  if (hls) {
    try {
      hls.destroy()
    } catch (error) {
      console.warn('Error destroying HLS:', error)
    }
    hls = null
  }
  
  if (loadTimeout) {
    clearTimeout(loadTimeout)
    loadTimeout = null
  }
}

const loadHlsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Hls) {
      resolve(window.Hls)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.14/dist/hls.min.js'
    script.onload = () => resolve(window.Hls)
    script.onerror = () => reject(new Error('Failed to load HLS.js'))
    document.head.appendChild(script)
  })
}

const initializePlayer = async () => {
  if (!videoElement.value || !props.src) {
    return
  }

  console.log('Initializing HLS player with:', props.src)
  loading.value = true
  loadingText.value = 'Carregando player...'
  
  destroyHls()

  // Timeout para garantir que o loading não fique infinito
  loadTimeout = setTimeout(() => {
    if (loading.value) {
      console.log('Player loading timeout')
      loading.value = false
    }
  }, 15000)

  try {
    const Hls = await loadHlsScript()
    loadingText.value = 'Conectando ao stream...'
    
    if (Hls && Hls.isSupported()) {
      console.log('Using HLS.js for playback')
      hls = new Hls({
        startLevel: -1,
        capLevelToPlayerSize: true,
        maxLoadingDelay: 4,
        maxBufferLength: 30,
        maxBufferSize: 60 * 1000 * 1000,
        enableWorker: true,
        debug: false
      })

      hls.loadSource(props.src)
      hls.attachMedia(videoElement.value)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed successfully')
        loading.value = false
        
        // Populate available qualities
        availableQualities.value = hls.levels.map(level => ({
          width: level.width,
          height: level.height,
          bitrate: level.bitrate
        }))
        
        console.log('Available qualities:', availableQualities.value)
        
        emit('ready')
        // Tentar autoplay após o manifest ser carregado
        tryAutoplay()
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data)
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Network error, attempting recovery...')
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error, attempting recovery...')
              hls.recoverMediaError()
              break
            default:
              console.log('Fatal error, falling back to native video')
              destroyHls()
              useNativeVideo()
              break
          }
        }
      })

    } else if (videoElement.value.canPlayType('application/vnd.apple.mpegurl')) {
      useNativeVideo()
    } else {
      console.error('HLS not supported in this browser')
      loading.value = false
      emit('error', new Error('HLS not supported'))
    }
  } catch (error) {
    console.error('Failed to initialize HLS player:', error)
    useNativeVideo()
  }
}

const useNativeVideo = () => {
  console.log('Using native HLS support')
  loadingText.value = 'Carregando com player nativo...'
  
  videoElement.value.src = props.src
  
  const onNativeReady = () => {
    loading.value = false
    emit('ready')
    videoElement.value.removeEventListener('loadeddata', onNativeReady)
    videoElement.value.removeEventListener('canplay', onNativeReady)
    // Ativar áudio para player nativo
    videoElement.value.muted = false
    // Tentar autoplay com video nativo
    tryAutoplay()
  }
  
  videoElement.value.addEventListener('loadeddata', onNativeReady)
  videoElement.value.addEventListener('canplay', onNativeReady)
}

// Watch for src changes
watch(() => props.src, (newSrc) => {
  if (newSrc) {
    initializePlayer()
  }
}, { immediate: true })

onMounted(() => {
  if (props.src) {
    initializePlayer()
  }
})

onUnmounted(() => {
  destroyHls()
})
</script>