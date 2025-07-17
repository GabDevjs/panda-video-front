import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/login', credentials)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.error || 'Erro ao fazer login'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/register', userData)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.error || 'Erro ao criar conta'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    clearError() {
      this.error = null
    }
  }
})