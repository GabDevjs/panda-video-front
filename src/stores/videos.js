import { defineStore } from 'pinia'
import api from '@/services/api'

export const useVideosStore = defineStore('videos', {
  state: () => ({
    videos: [],
    currentVideo: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    loading: false,
    uploading: false,
    error: null
  }),

  getters: {
    hasVideos: (state) => state.videos.length > 0
  },

  actions: {
    async fetchVideos(page = 1, limit = 10) {
      console.log('fetchVideos called with page:', page, 'limit:', limit)
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get(`/videos?page=${page}&limit=${limit}`)
        console.log('Videos response:', response.data)
        this.videos = response.data.videos
        this.pagination = response.data.pagination
        console.log('Videos store updated:', this.videos.length, 'videos')
      } catch (error) {
        console.error('Error fetching videos:', error)
        this.error = error.response?.data?.error || 'Erro ao carregar vídeos'
      } finally {
        this.loading = false
      }
    },

    async fetchVideo(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get(`/videos/${id}`)
        this.currentVideo = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erro ao carregar vídeo'
        throw error
      } finally {
        this.loading = false
      }
    },

    async uploadVideo(formData, onProgress) {
      this.uploading = true
      this.error = null
      
      try {
        const response = await api.post('/videos/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30 * 60 * 1000, // 30 minutos para uploads grandes
          onUploadProgress: (progressEvent) => {
            if (onProgress) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              )
              onProgress(progress)
            }
          }
        })
        
        // Atualizar lista de vídeos
        await this.fetchVideos(1, this.pagination.limit)
        
        return response.data
      } catch (error) {
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          this.error = 'Timeout no upload. Arquivo muito grande ou conexão lenta. Tente novamente.'
        } else {
          this.error = error.response?.data?.error || 'Erro ao fazer upload do vídeo'
        }
        throw error
      } finally {
        this.uploading = false
      }
    },

    clearError() {
      this.error = null
    },

    clearCurrentVideo() {
      this.currentVideo = null
    }
  }
})