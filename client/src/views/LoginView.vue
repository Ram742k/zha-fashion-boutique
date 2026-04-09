<template>
  <div class="min-h-screen flex items-center justify-center bg-beige-light px-4">
    <div class="max-w-md w-full glass p-8 rounded-2xl shadow-2xl border border-brand-gold/20">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-playfair font-bold text-brand-navy mb-2 tracking-widest">WELCOME BACK</h1>
        <p class="text-xs text-brand-purple uppercase tracking-[0.2em] font-medium">Please enter your details</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-[10px] uppercase tracking-widest text-brand-navy font-bold mb-2 ml-1">Email Address</label>
          <input 
            v-model="form.email"
            type="email" 
            required
            class="w-full bg-white/50 border border-brand-gold/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all font-medium"
            placeholder="admin@gmail.com"
          />
        </div>

        <div>
          <label class="block text-[10px] uppercase tracking-widest text-brand-navy font-bold mb-2 ml-1">Password</label>
          <input 
            v-model="form.password"
            type="password" 
            required
            class="w-full bg-white/50 border border-brand-gold/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all font-medium"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="bg-red-50 text-red-500 text-[10px] p-3 rounded-lg uppercase tracking-widest font-bold text-center border border-red-100 italic">
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-brand-navy text-white font-bold py-4 rounded-xl uppercase tracking-[0.3em] text-[10px] hover:bg-brand-gold hover:shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
        >
          {{ loading ? 'Authenticating...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-10 text-center">
        <p class="text-[10px] uppercase tracking-widest text-brand-navy/60 font-medium">
          Don't have an account? 
          <router-link to="/register" class="text-brand-purple font-bold hover:text-brand-gold transition-colors ml-1 underline decoration-brand-gold/30 underline-offset-4">Register</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.post('https://zha-fashion-boutique.onrender.com/api/auth/login', form)
    const { access_token, user } = response.data
    
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    
    // Set axios default header
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    if (user.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>
