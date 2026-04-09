<template>
  <div class="space-y-8 max-w-5xl">
    <!-- Notification -->
    <div v-if="notification" :class="[notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'p-4 rounded-sm border border-current font-bold text-[10px] uppercase tracking-widest transition-all duration-300 shadow-sm']">
      {{ notification.message }}
    </div>

    <div class="bg-white p-8 border border-beige/30 shadow-sm">
        <h3 class="text-3xl font-playfair font-bold text-brand-navy lowercase first-letter:uppercase">Store <span class="italic text-brand-gold">Settings</span></h3>
        <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-2">Manage your studio brand and payment options</p>
    </div>

    <!-- Configuration Form -->
    <div class="space-y-6 relative">
        <div v-if="loading" class="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center">
            <LoaderIcon class="animate-spin text-brand-gold" :size="30" />
        </div>

        <!-- Brand Essentials -->
        <div class="bg-white border border-beige/30 overflow-hidden shadow-sm">
            <div class="p-8 bg-beige-light/30 border-b border-beige/10">
                <h4 class="text-lg font-playfair font-bold text-brand-navy italic uppercase tracking-widest">Brand Info</h4>
            </div>
            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div class="space-y-4">
                    <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400 block">Studio Name</label>
                    <input type="text" v-model="settings.store_name" class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-brand-navy focus:ring-1 ring-brand-gold outline-none" />
                </div>
                <div class="space-y-4">
                    <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400 block">Currency</label>
                    <select v-model="settings.currency" class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-brand-navy focus:ring-1 ring-brand-gold outline-none">
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                    </select>
                </div>
                <div class="col-span-full space-y-4">
                    <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400 block">Logo Image</label>
                    <div class="flex flex-col sm:flex-row items-center space-y-8 sm:space-y-0 sm:space-x-10 p-6 md:p-10 bg-dotted-pattern border-2 border-dashed border-beige/50">
                        <div class="p-4 bg-white shadow-lg border border-beige/20 w-32 h-32 flex items-center justify-center overflow-hidden">
                            <img v-if="logoPreview || settings.logo_url" :src="logoPreview || settings.logo_url" class="max-w-full max-h-full object-contain" />
                            <ImageIcon v-else class="text-beige" :size="40" />
                        </div>
                        <div class="flex flex-col space-y-4 text-center sm:text-left">
                            <input type="file" ref="logoInput" @change="handleLogoUpload" accept="image/*" class="hidden" />
                            <button @click="$refs.logoInput.click()" class="btn-gold !text-[9px] !px-10">Upload New Logo</button>
                            <p class="text-[9px] text-gray-400 italic font-medium leading-relaxed">Best: PNG with transparent background.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment Setup -->
        <div class="bg-white border border-beige/30 overflow-hidden shadow-sm">
            <div class="p-8 bg-brand-navy border-b border-white/5 flex items-center space-x-4">
                <div class="w-10 h-10 bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                    <CreditCardIcon :size="20" />
                </div>
                <h4 class="text-lg font-playfair font-bold text-white italic uppercase tracking-widest">Payments (Razorpay)</h4>
            </div>
            <div class="p-8 space-y-10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div class="space-y-4">
                        <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400 block">Public Key (API Key)</label>
                        <input type="password" v-model="settings.razorpay_key" class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-brand-navy focus:ring-1 ring-brand-gold outline-none" />
                    </div>
                    <div class="space-y-4">
                        <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400 block">Secret Key</label>
                        <input type="password" v-model="settings.razorpay_secret" class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-brand-navy focus:ring-1 ring-brand-gold outline-none" placeholder="Enter key secret" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="flex justify-end pt-10">
        <button @click="saveSettings" :disabled="saving" class="btn-gold !px-20 !py-5 shadow-2xl flex items-center space-x-3">
            <LoaderIcon v-if="saving" class="animate-spin" :size="16" />
            <span>Save All Changes</span>
        </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { 
    CreditCard as CreditCardIcon,
    Loader as LoaderIcon,
    Image as ImageIcon
} from 'lucide-vue-next'

const API_BASE = 'http://localhost:5000/api/admin/settings'

const settings = ref({
    store_name: '',
    currency: 'INR',
    razorpay_key: '',
    razorpay_secret: '',
    logo_url: ''
})

const loading = ref(true)
const saving = ref(false)
const notification = ref(null)
const logoPreview = ref(null)
const selectedLogo = ref(null)

onMounted(() => fetchSettings())

const fetchSettings = async () => {
    loading.value = true
    try {
        const response = await axios.get(API_BASE)
        Object.assign(settings.value, response.data)
    } catch (error) {
        showNotification('Failed to load settings', 'error')
    } finally {
        loading.value = false
    }
}

const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedLogo.value = file
        logoPreview.value = URL.createObjectURL(file)
    }
}

const saveSettings = async () => {
    saving.value = true
    
    // Use FormData for possible file upload
    const formData = new FormData()
    formData.append('store_name', settings.value.store_name)
    formData.append('currency', settings.value.currency)
    formData.append('razorpay_key', settings.value.razorpay_key || '')
    formData.append('razorpay_secret', settings.value.razorpay_secret || '')
    
    if (selectedLogo.value) {
        formData.append('logo_file', selectedLogo.value)
    }

    try {
        await axios.post(API_BASE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        showNotification('Settings updated successfully', 'success')
        await fetchSettings()
        logoPreview.value = null
        selectedLogo.value = null
    } catch (error) {
        showNotification('Failed to update settings', 'error')
    } finally {
        saving.value = false
    }
}

const showNotification = (message, type = 'success') => {
    notification.value = { message, type }
    setTimeout(() => { notification.value = null }, 5000)
}
</script>

<style scoped>
.bg-dotted-pattern {
    background-image: radial-gradient(var(--color-beige) 1px, transparent 1px);
    background-size: 10px 10px;
}
</style>
