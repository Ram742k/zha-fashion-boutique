import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/css/style.css'
import App from './App.vue'

import axios from 'axios'

const app = createApp(App)
const pinia = createPinia()

const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

app.use(pinia)
app.use(router)

app.mount('#app')
