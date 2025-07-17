<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Entre na sua conta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sistema de hospedagem de vídeos Panda Video
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Nome de usuário
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="input-field mt-1"
              placeholder="Digite seu nome de usuário"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input-field mt-1"
              placeholder="Digite sua senha"
            />
          </div>
        </div>

        <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ authStore.error }}
              </h3>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading">Entrando...</span>
            <span v-else>Entrar</span>
          </button>
        </div>

        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 class="text-sm font-medium text-blue-800 mb-2">Credenciais de teste:</h3>
          <p class="text-sm text-blue-700">
            <strong>Usuário:</strong> testuser<br>
            <strong>Senha:</strong> password
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  authStore.clearError()
  
  const result = await authStore.login(form.value)
  
  if (result.success) {
    router.push('/')
  }
}
</script>