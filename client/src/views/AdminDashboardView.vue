<template>
  <div class="flex h-screen bg-gray-100 font-inter">
    <!-- Sidebar -->
    <div class="w-64 bg-luxury-dark text-white p-8 flex flex-col justify-between">
       <div class="space-y-12">
          <h2 class="text-xl font-playfair font-bold text-gold tracking-widest uppercase">Zha Admin</h2>
          
          <nav class="space-y-8 uppercase text-[10px] tracking-[0.2em] font-bold text-gray-500">
             <div class="hover:text-gold transition-colors cursor-pointer flex items-center space-x-4 text-gold">
                <LayoutDashboardIcon :size="16" />
                <span>Dashboard</span>
             </div>
             <div class="hover:text-gold transition-colors cursor-pointer flex items-center space-x-4">
                <BoxIcon :size="16" />
                <span>Products</span>
             </div>
             <div class="hover:text-gold transition-colors cursor-pointer flex items-center space-x-4">
                <ShoppingBagIcon :size="16" />
                <span>Orders</span>
             </div>
             <div class="hover:text-gold transition-colors cursor-pointer flex items-center space-x-4">
                <ScissorsIcon :size="16" />
                <span>Custom stitching</span>
             </div>
             <div class="hover:text-gold transition-colors cursor-pointer flex items-center space-x-4">
                <PaletteIcon :size="16" />
                <span>Embroidery</span>
             </div>
             <div class="hover:text-gold transition-colors cursor-pointer flex items-center space-x-4">
                <UserIcon :size="16" />
                <span>Customers</span>
             </div>
          </nav>
       </div>

       <div class="pt-10 border-t border-gray-800">
          <p class="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Logged in as admin</p>
          <button @click="handleLogout" class="text-[10px] text-red-500 mt-4 uppercase font-bold hover:underline">Logout</button>
       </div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow overflow-y-auto p-12 bg-white/50 backdrop-blur-2xl">
       <div class="max-w-7xl mx-auto">
          <!-- Top Stats -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
             <div v-for="(stat, index) in stats" :key="index" class="bg-white p-8 border border-beige shadow-sm hover:translate-y-[-5px] transition-all transform duration-300">
                <p class="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-2">{{ stat.label }}</p>
                <div class="flex justify-between items-end">
                   <h3 class="text-3xl font-playfair font-bold text-luxury-dark">{{ stat.value }}</h3>
                   <span class="text-green-500 text-[9px] font-bold">+{{ stat.growth }}%</span>
                </div>
             </div>
          </div>

          <!-- Analysis Charts Placeholder -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
             <div class="bg-white p-10 border border-beige shadow-sm min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0 bg-gold/5 flex items-center justify-center pointer-events-none">
                  <div class="w-full h-[1px] bg-gold/20 top-1/4"></div>
                </div>
                <h4 class="font-playfair text-xl italic mb-4">Revenue Trend (6 Months)</h4>
                <div class="flex items-end gap-2 h-40">
                   <div v-for="h in [60,80,45,95,70,90]" :key="h" class="bg-gold-dark/40 w-8" :style="`height: ${h}%`" />
                </div>
             </div>
             <div class="bg-white border border-beige shadow-sm min-h-[400px]">
                <div class="p-8 border-b border-beige flex justify-between items-center">
                   <h3 class="font-playfair text-xl">Recent Custom Orders</h3>
                   <button class="text-[9px] uppercase font-bold text-gold tracking-widest">View All</button>
                </div>
                <!-- Mini Table -->
                <div class="overflow-x-auto">
                   <table class="w-full text-left text-xs">
                     <thead>
                       <tr class="bg-beige-light uppercase tracking-widest text-[9px] font-bold text-gray-500 border-b border-beige">
                         <th class="p-4">User</th>
                         <th class="p-4">Garment</th>
                         <th class="p-4">Status</th>
                         <th class="p-4">Action</th>
                       </tr>
                     </thead>
                     <tbody class="divide-y divide-beige font-inter tracking-normal normal-case font-medium">
                       <tr v-for="order in customOrders" :key="order.id" class="hover:bg-beige-light/30">
                         <td class="p-4">{{ order.user }}</td>
                         <td class="p-4">{{ order.type }}</td>
                         <td class="p-4">
                            <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-[8px] font-bold uppercase rounded-full">{{ order.status }}</span>
                         </td>
                         <td class="p-4 space-x-4">
                            <button class="text-gold font-bold hover:underline">Review</button>
                            <button class="text-green-600 font-bold hover:underline">Approve</button>
                         </td>
                       </tr>
                     </tbody>
                   </table>
                </div>
             </div>
          </div>

          <!-- Product Inventory -->
          <div class="bg-white border border-beige shadow-sm">
             <div class="p-8 border-b border-beige flex justify-between items-center">
                <h3 class="font-playfair text-xl">Top Inventory Performance</h3>
             </div>
             <div class="p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                   <div v-for="i in 4" :key="i" class="flex items-center space-x-4">
                      <div class="w-16 h-16 bg-gray-100 flex-shrink-0 animate-pulse"></div>
                      <div>
                         <p class="font-bold text-[10px] uppercase text-gray-500 mb-1 leading-tight h-8 overflow-hidden">Product SKU #ZH82{{i}} Designer Lehengas</p>
                         <p class="text-sm font-playfair font-bold text-luxury-dark">₹28,500 <span class="text-[9px] text-gray-400 font-inter">x 40 in stock</span></p>
                      </div>
                   </div>
                </div>
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
  LayoutDashboard as LayoutDashboardIcon,
  Box as BoxIcon,
  ShoppingBag as ShoppingBagIcon,
  Scissors as ScissorsIcon,
  Image as ImageIcon,
  User as UserIcon
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}

const stats = ref([
    { label: 'Total Sales', value: '₹0', growth: 0 },
    { label: 'Pending Orders', value: '0', growth: 0 },
    { label: 'Subscribers', value: '0', growth: 0 },
    { label: 'Active Projects', value: '0', growth: 0 },
])

const recentWork = ref([])

onMounted(async () => {
    try {
        const response = await axios.get('https://zha-fashion-boutique.onrender.com/api/admin/dashboard/stats')
        stats.value = response.data.stats
        recentWork.value = response.data.recentWork
    } catch (error) {
        console.error('Failed to load dashboard stats', error)
    }
})

const customOrders = [
    { id: 1, user: 'Priya Sharma', type: 'Bridal Blouse', status: 'pending' },
    { id: 2, user: 'Anita Nair', type: 'Lehenga Choli', status: 'awaiting-fabric' },
    { id: 3, user: 'Meera Das', type: 'Handwoven Saree', status: 'processing' },
    { id: 4, user: 'Sita Ram', type: 'Embroidery Work', status: 'pending' },
]
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
</style>
