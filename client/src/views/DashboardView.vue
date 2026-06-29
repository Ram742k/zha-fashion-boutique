<template>
  <div class="py-24 bg-white min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-20">
        <!-- Sidebar Navigation -->
        <div class="lg:w-1/4">
          <div class="space-y-12">
            <div>
               <h1 class="text-4xl font-playfair font-bold text-luxury-dark mb-4 lowercase first-letter:uppercase">Hello, {{ profile.first_name }}</h1>
               <span class="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-12 block">Member since April 2026</span>
            </div>
            
            <nav class="space-y-8 uppercase text-[10px] tracking-[0.2em] font-bold text-gray-500">
               <div @click="activeTab = 'profile'" :class="{'text-gold border-gold': activeTab === 'profile'}" class="hover:text-gold transition-colors cursor-pointer flex items-center space-x-4 border-l-2 pl-6 border-transparent">
                  <UserIcon :size="16" />
                  <span>Profile & Security</span>
               </div>
               <div @click="activeTab = 'orders'" :class="{'text-gold border-gold': activeTab === 'orders'}" class="hover:text-gold transition-colors cursor-pointer flex items-center space-x-4 pl-6 border-l-2 border-transparent">
                  <ShoppingBagIcon :size="16" />
                  <span>Order History</span>
               </div>
               <div @click="activeTab = 'custom'" :class="{'text-gold border-gold': activeTab === 'custom'}" class="hover:text-gold transition-colors cursor-pointer flex items-center space-x-4 pl-6 border-l-2 border-transparent">
                  <ScissorsIcon :size="16" />
                  <span>Custom stitching</span>
               </div>
            </nav>

            <div class="pt-8 border-t border-beige">
               <button @click="handleLogout" class="text-xs text-red-500 uppercase tracking-widest font-bold hover:underline">Log out</button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:w-3/4">
            <!-- Order History View -->
            <div v-if="activeTab === 'orders'" class="animate-fade-in">
                <h2 class="text-2xl font-playfair font-bold text-luxury-dark mb-10 border-b border-beige pb-6 uppercase tracking-widest">Order Vault</h2>
                <div class="space-y-6">
                    <div v-for="order in orders" :key="order.id" class="p-8 border border-beige bg-white hover:shadow-xl transition-all duration-500">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <p class="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1">Fiscal ID</p>
                                <p class="text-sm font-bold text-luxury-dark">{{ order.order_number }}</p>
                            </div>
                            <div>
                                <p class="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1">Status</p>
                                <p class="text-[9px] font-bold text-gold-dark uppercase tracking-widest">{{ order.status }}</p>
                            </div>
                            <div class="text-right">
                                <button 
                                    @click="downloadInvoice(order.id)"
                                    class="flex items-center space-x-3 text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-dark hover:text-gold transition-colors"
                                >
                                    <DownloadIcon :size="14" />
                                    <span>Download Invoice</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Custom Stitching View -->
            <div v-if="activeTab === 'custom'" class="animate-fade-in">
                <h2 class="text-2xl font-playfair font-bold text-luxury-dark mb-10 border-b border-beige pb-6 uppercase tracking-widest">Custom Tailoring Orders</h2>
                <div v-if="customOrders.length === 0" class="text-center py-12 text-gray-400 italic text-sm">No custom stitching requests found.</div>
                <div v-else class="space-y-6">
                    <div v-for="order in customOrders" :key="order._id" class="p-8 border border-beige bg-white hover:shadow-xl transition-all duration-500">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                            <div>
                                <p class="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1">Order #</p>
                                <p class="text-sm font-bold text-luxury-dark">{{ order.order_number }}</p>
                            </div>
                            <div>
                                <p class="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1">Garment & Fabric</p>
                                <p class="text-xs font-bold text-luxury-dark capitalize">{{ order.item_type }} - {{ order.fabric }}</p>
                            </div>
                            <div>
                                <p class="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1">Price Estimate</p>
                                <p class="text-xs font-bold text-luxury-dark">{{ order.price_estimate ? '₹' + order.price_estimate.toLocaleString() : 'Awaiting Quote' }}</p>
                            </div>
                            <div>
                                <p class="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1">Status</p>
                                <span class="px-2 py-1 text-[9px] font-bold border uppercase tracking-wider bg-gold-dark/10 text-gold-dark border-gold-dark/20 capitalize">{{ order.status }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profile View -->
            <div v-if="activeTab === 'profile'" class="animate-fade-in text-inter">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                    <div class="bg-beige-light/30 p-10 border border-beige">
                        <h2 class="text-xl font-playfair font-bold text-luxury-dark mb-6 lowercase first-letter:uppercase tracking-normal italic">Order Tracking</h2>
                        <p class="text-xs text-gray-500 leading-relaxed font-inter">View your active shipments and real-time delivery status for current orders.</p>
                    </div>
                    <div class="bg-beige-light/30 p-10 border border-beige">
                        <h2 class="text-xl font-playfair font-bold text-luxury-dark mb-6 lowercase first-letter:uppercase tracking-normal italic">Custom Stitching</h2>
                        <p class="text-xs text-gray-500 leading-relaxed font-inter">Request status for custom tailoring is active in your pipeline tab.</p>
                    </div>
                    <div class="bg-beige-light/30 p-10 border border-beige flex flex-col justify-between">
                        <div>
                            <h2 class="text-xl font-playfair font-bold text-luxury-dark mb-6 lowercase first-letter:uppercase tracking-normal italic">Bridal Consultation</h2>
                            <p class="text-xs text-gray-500 leading-relaxed font-inter mb-4">Book a luxury bridal design session with our stylist desk.</p>
                        </div>
                        <router-link to="/bridal-consultation" class="text-[10px] uppercase tracking-widest font-bold text-gold hover:underline">Book Session &rarr;</router-link>
                    </div>
                </div>

                <h2 class="text-2xl font-playfair font-bold text-luxury-dark mb-10 border-b border-beige pb-6 uppercase tracking-widest">Account Details</h2>
                <form @submit.prevent="saveProfile" class="grid grid-cols-1 md:grid-cols-2 gap-10 font-inter uppercase tracking-widest text-[9px] font-bold text-gray-400">
                    <div class="space-y-4">
                        <label>First Name</label>
                        <input type="text" v-model="profile.first_name" class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-luxury-dark outline-none focus:ring-1 ring-gold" />
                    </div>
                    <div class="space-y-4">
                        <label>Last Name</label>
                        <input type="text" v-model="profile.last_name" class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-luxury-dark outline-none focus:ring-1 ring-gold" />
                    </div>
                    <div class="space-y-4">
                        <label>Email Address</label>
                        <input type="email" v-model="profile.email" class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-luxury-dark outline-none focus:ring-1 ring-gold" />
                    </div>
                    <div class="space-y-4">
                        <label>Phone Number</label>
                        <input type="tel" v-model="profile.phone" class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-luxury-dark outline-none focus:ring-1 ring-gold" />
                    </div>
                    <div class="pt-8">
                        <button type="submit" class="btn-gold !bg-luxury-dark !text-[10px] !px-12 hover:bg-black transition-colors">Save Profile</button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store'
import axios from 'axios'
import { 
  User as UserIcon, 
  ShoppingBag as ShoppingBagIcon, 
  Scissors as ScissorsIcon, 
  Download as DownloadIcon,
  Heart as HeartIcon, 
  Settings as SettingsIcon 
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}

const activeTab = ref('profile')
const profile = ref({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
})

const orders = ref([])
const customOrders = ref([])

onMounted(async () => {
    try {
        const userRes = await axios.get('/auth/me')
        const names = (userRes.data.name || '').split(' ')
        profile.value.first_name = names[0] || ''
        profile.value.last_name = names.slice(1).join(' ')
        profile.value.email = userRes.data.email
        profile.value.phone = userRes.data.phone || ''

        const orderRes = await axios.get('/orders/my-orders')
        orders.value = orderRes.data

        const customRes = await axios.get('/custom-orders/my-orders')
        customOrders.value = customRes.data
    } catch (error) {
        console.error('Failed to load dashboard data', error)
    }
})

const saveProfile = async () => {
    try {
        const name = `${profile.value.first_name} ${profile.value.last_name}`
        const response = await axios.put('/auth/profile', {
            name,
            email: profile.value.email,
            phone: profile.value.phone
        })
        const user = response.data
        localStorage.setItem('user', JSON.stringify(user))
        authStore.user = user
        alert('Profile updated successfully!')
    } catch (error) {
        console.error('Failed to update profile', error)
        alert(error.response?.data?.message || 'Failed to update profile')
    }
}

const downloadInvoice = (orderId) => {
    window.open(`${axios.defaults.baseURL}/orders/${orderId}/invoice?token=${localStorage.getItem('token')}`, '_blank')
}
</script>

<style scoped>
@keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
</style>
