<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="bg-white p-8 border border-beige/30 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
            <h3 class="text-3xl font-playfair font-bold text-brand-navy lowercase first-letter:uppercase">Custom <span class="italic text-brand-gold">Stitching</span></h3>
            <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-2">Manage personalized tailoring requests and measurements</p>
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
                        <th class="px-8 py-6 font-bold">Request ID</th>
                        <th class="px-8 py-6 font-bold">Customer</th>
                        <th class="px-8 py-6 font-bold">Dress Type</th>
                        <th class="px-8 py-6 font-bold">Price Quote</th>
                        <th class="px-8 py-6 font-bold">Order Status</th>
                        <th class="px-8 py-6 font-bold text-right">Details</th>
                    </tr>
                </thead>
                <tbody class="text-xs uppercase tracking-widest font-medium">
                    <tr v-for="order in orders" :key="order.id" class="border-b border-beige/5 hover:bg-beige-light/30 transition-all duration-300">
                        <td class="px-8 py-6 font-bold text-brand-navy">#{{ order.id }}</td>
                        <td class="px-8 py-6">
                            <p class="font-bold">{{ order.user?.name || 'Guest' }}</p>
                            <p class="text-[9px] text-gray-400">{{ order.user?.phone }}</p>
                        </td>
                        <td class="px-8 py-6 text-brand-gold font-bold italic">{{ order.dress_type }}</td>
                        <td class="px-8 py-6">
                            <div v-if="order.status === 'pending'" class="flex items-center space-x-2">
                                <input type="number" v-model="order.quotation_amount" class="w-24 bg-beige-light border-none px-2 py-1 text-[10px] font-bold" placeholder="Set Price" />
                                <button @click="updateQuotation(order)" class="text-brand-gold hover:text-brand-navy"><ArrowRightIcon :size="14" /></button>
                            </div>
                            <span v-else class="font-bold text-brand-purple">₹{{ order.quotation_amount }}</span>
                        </td>
                        <td class="px-8 py-6">
                            <select v-model="order.status" @change="updateStatus(order)" class="bg-beige-light/50 border-none px-3 py-1 text-[10px] font-bold uppercase outline-none">
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="cutting">Cutting</option>
                                <option value="stitching">Stitching</option>
                                <option value="ready">Ready</option>
                                <option value="delivered">Delivered</option>
                            </select>
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
                <h4 class="text-2xl font-playfair font-bold text-brand-gold italic">Request Details</h4>
                <button @click="selectedOrder = null"><XIcon :size="24" /></button>
            </div>
            <div class="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div class="space-y-6">
                    <h5 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 border-b border-beige/10 pb-2">Measurement Guide</h5>
                    <div class="grid grid-cols-2 gap-4">
                        <div v-for="(val, key) in selectedOrder.measurements" :key="key" class="bg-beige-light/30 p-4 border border-beige/10">
                            <p class="text-[8px] uppercase tracking-widest text-gray-400 font-bold mb-1">{{ key }}</p>
                            <p class="text-sm font-bold text-brand-navy">{{ val }} in</p>
                        </div>
                    </div>
                </div>
                <div class="space-y-6">
                    <h5 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 border-b border-beige/10 pb-2">Customer Info</h5>
                    <p class="text-sm font-bold text-brand-navy">{{ selectedOrder.user?.name || 'Guest' }}</p>
                    <p class="text-xs text-gray-400">{{ selectedOrder.user?.phone || 'No phone provided' }}</p>
                    
                    <h5 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 border-b border-beige/10 pb-2 mt-8">Requirements</h5>
                    <p class="text-xs text-gray-600 leading-relaxed italic">"{{ selectedOrder.requirements || 'No specific instructions provided.' }}"</p>
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
    Loader as LoaderIcon,
    ChevronRight as ArrowRightIcon
} from 'lucide-vue-next'

const API_BASE = 'http://localhost:5000/api/admin/custom-orders'

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

const updateQuotation = async (order) => {
    try {
        await axios.patch(`${API_BASE}/${order.id}/quotation`, { amount: order.quotation_amount })
        alert('Price updated!')
    } catch (error) {
        console.error('Update failed')
    }
}

const updateStatus = async (order) => {
    try {
        await axios.patch(`${API_BASE}/${order.id}/status`, { status: order.status })
    } catch (error) {
        console.error('Status sync failure')
    }
}
</script>
