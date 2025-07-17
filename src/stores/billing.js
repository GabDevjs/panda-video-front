import { defineStore } from 'pinia'
import api from '@/services/api'

export const useBillingStore = defineStore('billing', {
  state: () => ({
    billing: {
      total: 0,
      currency: 'USD'
    },
    loading: false,
    error: null
  }),

  getters: {
    formattedTotal: (state) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'USD'
      }).format(state.billing.total)
    }
  },

  actions: {
    async fetchBilling() {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get('/billing')
        this.billing = response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erro ao carregar faturamento'
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})