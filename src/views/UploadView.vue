<template>
  <SidebarLayout page-title="Upload de Vídeo">
    <div class="max-w-screen-lg mx-auto">
      <!-- Header da página -->
      <div class="text-center mb-12">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Enviar novo vídeo</h1>
        <p class="text-gray-600">Compartilhe seu conteúdo com o mundo</p>
      </div>

      <div class="max-w-2xl mx-auto">
        <div class="card p-8">
          <form @submit.prevent="handleUpload" class="space-y-6">
            <!-- Área de upload modernizada -->
            <div class="space-y-4">
              <div 
                class="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                :class="{ 'border-black bg-gray-50': isDragOver }"
                @drop="handleDrop"
                @dragover.prevent="isDragOver = true"
                @dragleave="isDragOver = false"
                @click="!selectedFile && $refs.fileInput.click()"
              >
                <div v-if="!selectedFile" class="space-y-4">
                  <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Escolha seu vídeo</h3>
                    <p class="text-gray-600 mb-4">Arraste e solte ou clique para selecionar</p>
                    <input 
                      ref="fileInput"
                      type="file" 
                      class="hidden" 
                      accept="video/*"
                      @change="handleFileSelect"
                    >
                  </div>
                  <div class="flex items-center justify-center space-x-6 text-sm text-gray-500">
                    <span>MP4, MOV, AVI</span>
                    <span>•</span>
                    <span>Até 2GB</span>
                    <span>•</span>
                    <span>Sem limite de duração</span>
                  </div>
                </div>
                
                <div v-else class="space-y-4">
                  <div class="w-16 h-16 mx-auto bg-gray-900 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">{{ selectedFile.name }}</h3>
                    <p class="text-sm text-gray-500 mt-1">{{ formatFileSize(selectedFile.size) }}</p>
                  </div>
                  <button 
                    type="button" 
                    @click.stop="removeFile"
                    class="btn-ghost text-sm"
                  >
                    Remover arquivo
                  </button>
                </div>
              </div>
            </div>

            <!-- Campos do formulário -->
            <div class="space-y-6">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-900 mb-2">
                  Título do vídeo
                </label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  required
                  class="input-field-rounded"
                  placeholder="Ex: Como fazer um bolo de chocolate"
                />
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-900 mb-2">
                  Descrição
                </label>
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="4"
                  class="input-field-rounded resize-none"
                  placeholder="Conte mais sobre seu vídeo (opcional)"
                ></textarea>
              </div>
            </div>

            <!-- Configurações de privacidade -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-4">
                Quem pode ver este vídeo?
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label class="relative cursor-pointer">
                  <input
                    v-model="form.is_public"
                    :value="false"
                    type="radio"
                    class="sr-only"
                  />
                  <div class="p-4 border-2 rounded-xl transition-all"
                       :class="!form.is_public 
                         ? 'border-black bg-gray-50' 
                         : 'border-gray-200 hover:border-gray-300'"
                  >
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                      </div>
                      <div>
                        <div class="font-medium text-gray-900">Privado</div>
                        <div class="text-sm text-gray-500">Apenas você</div>
                      </div>
                    </div>
                  </div>
                </label>
                
                <label class="relative cursor-pointer">
                  <input
                    v-model="form.is_public"
                    :value="true"
                    type="radio"
                    class="sr-only"
                  />
                  <div class="p-4 border-2 rounded-xl transition-all"
                       :class="form.is_public 
                         ? 'border-black bg-gray-50' 
                         : 'border-gray-200 hover:border-gray-300'"
                  >
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
                        </svg>
                      </div>
                      <div>
                        <div class="font-medium text-gray-900">Público</div>
                        <div class="text-sm text-gray-500">Todos podem ver</div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>


            <!-- Progresso do upload -->
            <div v-if="uploading" class="bg-gray-50 rounded-xl p-6 space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </div>
                  <span class="font-medium text-gray-900">Enviando vídeo</span>
                </div>
                <span class="text-sm text-gray-600">{{ uploadProgress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-black h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${uploadProgress}%` }"
                ></div>
              </div>
            </div>

            <!-- Mensagens de status -->
            <div v-if="videosStore.error" class="bg-red-50 border border-red-200 rounded-xl p-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-red-800">Erro no upload</h3>
                  <p class="text-sm text-red-600 mt-1">{{ videosStore.error }}</p>
                </div>
              </div>
            </div>

            <div v-if="uploadSuccess" class="bg-green-50 border border-green-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-green-800">Upload concluído!</h3>
                    <p class="text-sm text-green-600 mt-1">Seu vídeo está sendo processado</p>
                  </div>
                </div>
                <router-link to="/my-videos" class="btn-secondary text-sm">
                  Ver vídeos
                </router-link>
              </div>
            </div>

            <!-- Botões de ação -->
            <div class="flex flex-col sm:flex-row gap-3 pt-4">
              <router-link to="/my-videos" class="btn-secondary flex-1 sm:flex-none text-center">
                Cancelar
              </router-link>
              <button
                type="submit"
                :disabled="!selectedFile || uploading"
                class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="uploading" class="flex items-center justify-center space-x-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <span>Enviando</span>
                </span>
                <span v-else>Publicar vídeo</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Informações importantes -->
        <div class="mt-12 bg-gray-50 rounded-2xl p-6">
          <div class="text-center mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Antes de enviar</h3>
            <p class="text-gray-600">Algumas informações importantes sobre o upload</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div class="space-y-2">
              <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <h4 class="font-medium text-gray-900">Formatos</h4>
              <p class="text-sm text-gray-600">MP4, MOV, AVI, MKV</p>
            </div>
            
            <div class="space-y-2">
              <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h4 class="font-medium text-gray-900">Tamanho</h4>
              <p class="text-sm text-gray-600">Até 2GB, sem limite de duração</p>
            </div>
            
            <div class="space-y-2">
              <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <h4 class="font-medium text-gray-900">Cobrança</h4>
              <p class="text-sm text-gray-600">$0,008 por segundo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SidebarLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
import { useVideosStore } from '@/stores/videos'

const videosStore = useVideosStore()
const router = useRouter()

const selectedFile = ref(null)
const selectedThumbnail = ref(null)
const thumbnailPreview = ref(null)
const isDragOver = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadSuccess = ref(false)

const form = reactive({
  title: '',
  description: '',
  is_public: false
})

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    if (!form.title) {
      form.title = file.name.replace(/\.[^/.]+$/, '') // Remove extension
    }
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    selectedFile.value = files[0]
    if (!form.title) {
      form.title = files[0].name.replace(/\.[^/.]+$/, '')
    }
  }
}

const removeFile = () => {
  selectedFile.value = null
  uploadProgress.value = 0
  uploadSuccess.value = false
}

const handleThumbnailSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedThumbnail.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      thumbnailPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeThumbnail = () => {
  selectedThumbnail.value = null
  thumbnailPreview.value = null
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleUpload = async () => {
  if (!selectedFile.value) return
  
  videosStore.clearError()
  uploading.value = true
  uploadProgress.value = 0
  uploadSuccess.value = false
  
  try {
    const formData = new FormData()
    formData.append('video', selectedFile.value)
    formData.append('title', form.title)
    formData.append('is_public', form.is_public)
    if (form.description) {
      formData.append('description', form.description)
    }
    if (selectedThumbnail.value) {
      formData.append('thumbnail', selectedThumbnail.value)
    }
    
    await videosStore.uploadVideo(formData, (progress) => {
      uploadProgress.value = progress
    })
    
    uploadSuccess.value = true
    
    // Reset form
    setTimeout(() => {
      form.title = ''
      form.description = ''
      form.is_public = false
      selectedFile.value = null
      selectedThumbnail.value = null
      thumbnailPreview.value = null
      uploadProgress.value = 0
    }, 2000)
    
  } catch (error) {
    console.error('Upload error:', error)
  } finally {
    uploading.value = false
  }
}
</script>