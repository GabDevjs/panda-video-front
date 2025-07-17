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
          Criar nova conta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Registre-se no Panda Video
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
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
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field mt-1"
              placeholder="Digite seu email"
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

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="input-field mt-1"
              placeholder="Confirme sua senha"
            />
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ error }}
              </h3>
            </div>
          </div>
        </div>

        <div v-if="success" class="bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                {{ success }}
              </h3>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Criando conta...</span>
            <span v-else>Criar conta</span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Já tem uma conta? 
            <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
              Faça login aqui
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  error.value = ''
  success.value = ''
  
  // Validações
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'As senhas não coincidem'
    return
  }
  
  if (form.value.password.length < 6) {
    error.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }
  
  loading.value = true
  
  try {
    const result = await authStore.register(form.value)
    
    if (result.success) {
      success.value = 'Conta criada com sucesso! Redirecionando...'
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      error.value = result.error || 'Erro ao criar conta'
    }
  } catch (err) {
    error.value = 'Erro interno. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>