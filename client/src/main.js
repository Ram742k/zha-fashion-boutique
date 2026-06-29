import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/css/style.css'
import App from './App.vue'

import axios from 'axios'

// Set axios default base URL (automatically target local backend if running frontend locally)
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || (isLocal ? 'http://localhost:5000/api' : 'https://zha-fashion-boutique.onrender.com/api');
window.axios = axios

const app = createApp(App)
const pinia = createPinia()

const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

app.use(pinia)
app.use(router)

app.mount('#app')

