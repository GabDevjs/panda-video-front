<template>
  <SidebarLayout page-title="Faturamento">
    <div class="max-w-4xl mx-auto">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Faturamento</h1>
          <p class="mt-2 text-gray-600">Acompanhe seus custos de processamento de vídeos</p>
        </div>

        <!-- Loading State -->
        <div v-if="billingStore.loading" class="animate-pulse">
          <div class="card p-6 mb-6">
            <div class="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div class="h-12 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="billingStore.error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ billingStore.error }}
              </h3>
              <div class="mt-2">
                <button @click="loadBilling" class="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded">
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Billing Summary -->
        <div v-else class="space-y-6">
          <!-- Total Amount Card -->
          <div class="card p-8 text-center">
            <div class="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ billingStore.formattedTotal }}</h2>
            <p class="text-gray-600">Total acumulado de processamento</p>
          </div>

          <!-- Billing Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Pricing Info -->
            <div class="card p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Informações de Preço</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Taxa por minuto</span>
                  <span class="font-medium text-gray-900">$0.50</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Moeda</span>
                  <span class="font-medium text-gray-900">USD</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Arredondamento</span>
                  <span class="font-medium text-gray-900">Para cima</span>
                </div>
              </div>
              
              <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 class="font-medium text-blue-900 mb-2">Como funciona a cobrança?</h4>
                <p class="text-sm text-blue-800">
                  Você é cobrado por cada minuto de vídeo processado, 
                  arredondado para cima. Por exemplo, um vídeo de 1:30 
                  será cobrado como 2 minutos.
                </p>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="card p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Estatísticas Rápidas</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Total de vídeos</span>
                  <span class="font-medium text-gray-900">{{ totalVideos }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Vídeos processados</span>
                  <span class="font-medium text-gray-900">{{ completedVideos }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Minutos estimados</span>
                  <span class="font-medium text-gray-900">{{ estimatedMinutes }}</span>
                </div>
              </div>

              <div class="mt-6">
                <router-link to="/videos" class="btn-primary w-full text-center block">
                  Ver meus vídeos
                </router-link>
              </div>
            </div>
          </div>

          <!-- Billing Breakdown -->
          <div class="card p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Detalhamento por Status</h3>
            
            <div v-if="videosStore.hasVideos" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="text-center p-4 bg-green-50 rounded-lg">
                  <div class="text-2xl font-bold text-green-600">{{ completedVideos }}</div>
                  <div class="text-sm text-green-700">Concluídos</div>
                </div>
                <div class="text-center p-4 bg-yellow-50 rounded-lg">
                  <div class="text-2xl font-bold text-yellow-600">{{ processingVideos }}</div>
                  <div class="text-sm text-yellow-700">Processando</div>
                </div>
                <div class="text-center p-4 bg-blue-50 rounded-lg">
                  <div class="text-2xl font-bold text-blue-600">{{ uploadingVideos }}</div>
                  <div class="text-sm text-blue-700">Enviando</div>
                </div>
                <div class="text-center p-4 bg-red-50 rounded-lg">
                  <div class="text-2xl font-bold text-red-600">{{ failedVideos }}</div>
                  <div class="text-sm text-red-700">Falharam</div>
                </div>
              </div>

              <!-- Recent Processing Activity -->
              <div class="mt-8">
                <h4 class="font-medium text-gray-900 mb-4">Atividade Recente</h4>
                <div class="space-y-3">
                  <div 
                    v-for="video in recentCompletedVideos" 
                    :key="video.id"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div class="flex-1">
                      <p class="font-medium text-gray-900">{{ video.title }}</p>
                      <p class="text-sm text-gray-500">
                        {{ formatDate(video.updated_at || video.created_at) }}
                      </p>
                    </div>
                    <div class="text-right">
                      <div v-if="video.duration" class="text-sm">
                        <span class="text-gray-600">{{ Math.ceil(video.duration / 60) }} min</span>
                        <span class="text-primary-600 font-medium ml-2">
                          ${{ (Math.ceil(video.duration / 60) * 0.5).toFixed(2) }}
                        </span>
                      </div>
                      <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        Processado
                      </span>
                    </div>
                  </div>
                </div>
                
                <div v-if="recentCompletedVideos.length === 0" class="text-center py-8 text-gray-500">
                  <svg class="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Nenhum vídeo processado ainda
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum vídeo encontrado</h3>
              <p class="text-gray-500 mb-4">Faça o upload do seu primeiro vídeo para começar a usar o serviço.</p>
              <router-link to="/upload" class="btn-primary">
                Fazer Upload
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
import { useBillingStore } from '@/stores/billing'
import { useVideosStore } from '@/stores/videos'

const billingStore = useBillingStore()
const videosStore = useVideosStore()

const totalVideos = computed(() => videosStore.pagination.total)

const completedVideos = computed(() => {
  return videosStore.videos.filter(video => video.status === 'completed').length
})

const processingVideos = computed(() => {
  return videosStore.videos.filter(video => video.status === 'processing').length
})

const uploadingVideos = computed(() => {
  return videosStore.videos.filter(video => video.status === 'uploading').length
})

const failedVideos = computed(() => {
  return videosStore.videos.filter(video => video.status === 'failed').length
})

const estimatedMinutes = computed(() => {
  return videosStore.videos
    .filter(video => video.status === 'completed' && video.duration)
    .reduce((total, video) => total + Math.ceil(video.duration / 60), 0)
})

const recentCompletedVideos = computed(() => {
  return videosStore.videos
    .filter(video => video.status === 'completed')
    .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
    .slice(0, 5)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadBilling = async () => {
  await billingStore.fetchBilling()
}

onMounted(async () => {
  await Promise.all([
    billingStore.fetchBilling(),
    videosStore.fetchVideos(1, 50) // Buscar mais vídeos para estatísticas
  ])
})
</script>