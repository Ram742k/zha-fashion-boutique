<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="bg-white p-8 border border-beige/30 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
            <h3 class="text-3xl font-playfair font-bold text-brand-navy lowercase first-letter:uppercase">Embroidery <span class="italic text-brand-gold">Submissions</span></h3>
            <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-2">Manage artistic design requests and thread work quotes</p>
        </div>
        <button @click="fetchOrders" class="p-4 bg-beige-light hover:bg-brand-gold hover:text-white transition-all">
            <RefreshIcon :size="16" :class="{ 'animate-spin': loading }" />
        </button>
    </div>

    <!-- Requests Table -->
    <div class="bg-white border border-beige/30 shadow-sm relative overflow-hidden">
        <div v-if="loading" class="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center">
            <LoaderIcon class="animate-spin text-brand-gold" :size="30" />
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left min-w-[1000px]">
                <thead>
                    <tr class="text-[10px] uppercase tracking-[0.3em] text-gray-400 border-b border-beige/10 bg-beige-light/30">
                        <th class="px-8 py-6 font-bold">Order ID</th>
                        <th class="px-8 py-6 font-bold">Customer</th>
                        <th class="px-8 py-6 font-bold">Work Type</th>
                        <th class="px-8 py-6 font-bold">Quantity</th>
                        <th class="px-8 py-6 font-bold">Status</th>
                        <th class="px-8 py-6 font-bold text-right">Details</th>
                    </tr>
                </thead>
                <tbody class="text-xs uppercase tracking-widest font-medium">
                    <tr v-for="order in orders" :key="order._id" class="border-b border-beige/5 hover:bg-beige-light/30 transition-all duration-300">
                        <td class="px-8 py-6 font-bold text-brand-navy">{{ order.order_number }}</td>
                        <td class="px-8 py-6">
                            <p class="font-bold">{{ order.user?.name || 'Guest' }}</p>
                            <p class="text-[9px] text-gray-400">{{ order.user?.phone }}</p>
                        </td>
                        <td class="px-8 py-6 text-brand-gold font-bold italic">{{ order.type }}</td>
                        <td class="px-8 py-6 font-bold">{{ order.quantity }} pcs</td>
                        <td class="px-8 py-6">
                            <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-[8px] font-bold uppercase rounded-sm border border-yellow-200">{{ order.status }}</span>
                        </td>
                        <td class="px-8 py-6 text-right">
                            <button @click="selectedOrder = order" class="text-brand-gold font-bold">View Data</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div @click="selectedOrder = null" class="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"></div>
        <div class="bg-white w-full max-w-4xl relative z-10 shadow-2xl animate-fade-in-up">
            <div class="bg-brand-navy p-8 flex justify-between items-center text-white">
                <h4 class="text-2xl font-playfair font-bold text-brand-gold italic">Embroidery Request</h4>
                <button @click="selectedOrder = null"><XIcon :size="24" /></button>
            </div>
            <div class="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div class="space-y-6">
                    <h5 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 border-b border-beige/10 pb-2">Design Photo</h5>
                    <div class="aspect-video bg-beige-light border border-beige/10 overflow-hidden">
                        <img v-if="selectedOrder.design_image" :src="selectedOrder.design_image" class="w-full h-full object-contain" />
                        <div v-else class="w-full h-full flex items-center justify-center text-gray-300 italic">No image uploaded</div>
                    </div>
                </div>
                <div class="space-y-6">
                    <h5 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 border-b border-beige/10 pb-2">Customer Info</h5>
                    <p class="text-sm font-bold text-brand-navy">{{ selectedOrder.user?.name || 'Guest' }}</p>
                    <p class="text-xs text-gray-400">{{ selectedOrder.user?.phone || 'No phone provided' }}</p>

                    <h5 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 border-b border-beige/10 pb-2 mt-8">Requirements</h5>
                    <p class="text-xs text-gray-600 leading-relaxed italic">"{{ selectedOrder.notes || 'No specific instructions provided.' }}"</p>
                    <div class="pt-6 border-t border-beige/10">
                        <p class="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2">Quantity</p>
                        <p class="text-lg font-bold text-brand-navy">{{ selectedOrder.quantity }} Units</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { 
    RefreshCcw as RefreshIcon, 
    X as XIcon,
    Loader as LoaderIcon
} from 'lucide-vue-next'

const API_BASE = 'http://localhost:5000/api/admin/embroidery-submissions'

const orders = ref([])
const loading = ref(true)
const selectedOrder = ref(null)

onMounted(() => fetchOrders())

const fetchOrders = async () => {
    loading.value = true
    try {
        const response = await axios.get(API_BASE)
        orders.value = response.data
    } catch (error) {
        console.error('Data pull failed')
    } finally {
        loading.value = false
    }
}
</script>
