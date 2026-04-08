<template>
  <div class="space-y-12">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div v-for="stat in stats" :key="stat.name" class="bg-white p-8 border border-beige/30 hover-stack group">
        <div class="flex justify-between items-start mb-6">
          <div class="w-12 h-12 bg-beige-light flex items-center justify-center text-brand-gold">
            <component :is="iconMap[stat.icon]" :size="24" />
          </div>
          <span :class="[stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500', 'text-[10px] font-bold tracking-widest uppercase']">
            {{ stat.change }}
          </span>
        </div>
        <h3 class="text-3xl font-playfair font-bold text-brand-navy mb-1">{{ stat.value }}</h3>
        <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold leading-none">{{ stat.name }}</p>
      </div>
    </div>

    <!-- Charts and Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Revenue Chart -->
      <div class="lg:col-span-2 bg-white p-8 border border-beige/30">
        <div class="flex justify-between items-center mb-10">
          <h3 class="text-xl font-playfair font-bold text-brand-navy">Revenue Overview</h3>
          <select class="text-[10px] uppercase tracking-widest font-bold bg-transparent border-none outline-none text-brand-gold cursor-pointer">
            <option>Last 30 Days</option>
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
        </div>
        <div class="h-[400px] flex items-end space-x-4">
          <!-- Mock Chart Visualization -->
          <div v-for="(h, i) in [40, 65, 45, 80, 55, 90, 70]" :key="i" class="flex-grow bg-beige-light relative group cursor-pointer" :style="`height: ${h}%`">
            <div class="absolute inset-0 bg-brand-gold scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500 opacity-60"></div>
          </div>
        </div>
        <div class="flex justify-between mt-6 text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>

      <!-- Recent Custom Orders -->
      <div class="bg-brand-navy p-8 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 bg-brand-gold opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <h3 class="text-xl font-playfair font-bold mb-8 relative z-10">Recent Tailoring</h3>
        <div class="space-y-6 relative z-10">
          <div v-for="order in recentWork" :key="order.id" class="flex items-center space-x-4 group cursor-pointer">
            <div class="w-10 h-10 border border-white/10 overflow-hidden">
              <img :src="order.image" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <div class="flex-grow">
              <p class="text-[10px] font-bold tracking-widest truncate uppercase">{{ order.customer }}</p>
              <p class="text-[9px] text-brand-gold uppercase tracking-widest font-medium">{{ order.service }}</p>
            </div>
            <span class="text-[8px] px-2 py-1 border border-white/20 uppercase tracking-tighter">{{ order.status }}</span>
          </div>
        </div>
        <button class="w-full mt-10 py-4 border border-white/10 hover:bg-white/5 transition-colors text-[10px] uppercase tracking-[0.3em] font-bold">View Pipeline</button>
      </div>
    </div>

    <!-- Active Orders Table -->
    <div class="bg-white border border-beige/30 overflow-hidden shadow-sm">
        <div class="p-8 border-b border-beige/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 class="text-xl font-playfair font-bold text-brand-navy uppercase tracking-widest">Recent Orders</h3>
            <button class="text-[10px] uppercase tracking-widest text-brand-gold font-bold hover:text-brand-purple transition-colors">Manage All Records</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left min-w-[800px]">
            <thead>
                <tr class="text-[10px] uppercase tracking-[0.3em] text-gray-400 border-b border-beige/10">
                    <th class="px-8 py-6 font-bold">Order ID</th>
                    <th class="px-8 py-6 font-bold">Product Name</th>
                    <th class="px-8 py-6 font-bold">Total Price</th>
                    <th class="px-8 py-6 font-bold">Current Status</th>
                    <th class="px-8 py-6 font-bold text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="text-xs uppercase tracking-widest font-medium">
                <tr v-for="order in shipments" :key="order.id" class="border-b border-beige/5 hover:bg-beige-light/30 transition-all duration-300">
                    <td class="px-8 py-6 font-bold text-brand-navy">{{ order.id }}</td>
                    <td class="px-8 py-6 text-gray-500 italic">{{ order.product }}</td>
                    <td class="px-8 py-6 font-bold text-brand-gold">{{ order.amount }}</td>
                    <td class="px-8 py-6">
                        <span class="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-bold border border-green-100 italic">{{ order.status }}</span>
                    </td>
                    <td class="px-8 py-6 text-right">
                        <button class="text-brand-navy hover:text-brand-gold transition-colors font-bold border border-beige/10 px-4 py-2 bg-white">Update</button>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { 
  TrendingUp as RevenueIcon, 
  ShoppingBag as OrdersIcon, 
  Scissors as CustomIcon, 
  Users as UsersIcon 
} from 'lucide-vue-next'

const iconMap = {
  TrendingUp: RevenueIcon,
  ShoppingBag: OrdersIcon,
  Scissors: CustomIcon,
  Users: UsersIcon
}

const stats = ref([])
const recentWork = ref([])
const shipments = ref([])
const loading = ref(true)

onMounted(() => fetchDashboardData())

const fetchDashboardData = async () => {
    loading.value = true
    try {
        const response = await axios.get('https://zha-fashion-backend.onrender.com/api/admin/dashboard/stats')
        stats.value = response.data.stats
        recentWork.value = response.data.recentWork
        shipments.value = response.data.shipments
    } catch (error) {
        console.error('Core Sync Failure', error)
    } finally {
        loading.value = false
    }
}
</script>
