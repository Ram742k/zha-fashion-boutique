<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="bg-white p-8 border border-beige/30 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
            <h3 class="text-3xl font-playfair font-bold text-brand-navy lowercase first-letter:uppercase">Payments & <span class="italic text-brand-gold">Invoices</span></h3>
            <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-2">Manage your sales, payments and print receipts</p>
        </div>
        <div class="flex items-center space-x-4">
             <div class="text-right hidden md:block">
                <p class="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-1">Total Sales Amount</p>
                <p class="text-xl font-playfair font-bold text-brand-navy">₹{{ formatPrice(totalRevenue) }}</p>
            </div>
            <button @click="fetchInvoices" class="p-4 bg-beige-light hover:bg-brand-gold hover:text-white transition-all">
                <RefreshIcon :size="16" :class="{ 'animate-spin': loading }" />
            </button>
        </div>
    </div>

    <!-- Active Invoices Table -->
    <div class="bg-white border border-beige/30 shadow-sm relative overflow-hidden">
        <div v-if="loading" class="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center">
            <LoaderIcon class="animate-spin text-brand-gold" :size="30" />
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left min-w-[1000px]">
                <thead>
                    <tr class="text-[10px] uppercase tracking-[0.3em] text-gray-400 border-b border-beige/10 bg-beige-light/30">
                        <th class="px-8 py-6 font-bold">Order #</th>
                        <th class="px-8 py-6 font-bold">Customer Info</th>
                        <th class="px-8 py-6 font-bold">Payment Date</th>
                        <th class="px-8 py-6 font-bold">Total Bill</th>
                        <th class="px-8 py-6 font-bold">Payment Status</th>
                        <th class="px-8 py-6 font-bold text-right">Invoice</th>
                    </tr>
                </thead>
                <tbody class="text-xs uppercase tracking-widest font-medium">
                    <tr v-if="invoices.length === 0 && !loading">
                        <td colspan="6" class="px-8 py-16 text-center text-gray-400 italic">No payments found yet.</td>
                    </tr>
                    <tr v-for="order in invoices" :key="order.id" class="border-b border-beige/5 hover:bg-beige-light/30 transition-all duration-300">
                        <td class="px-8 py-6">
                            <span class="font-bold text-brand-navy">{{ order.order_number }}</span>
                        </td>
                        <td class="px-8 py-6">
                            <p class="font-bold mb-1">{{ order.user?.name || 'Guest User' }}</p>
                            <p class="text-[9px] text-gray-400 tracking-tighter">{{ order.user?.email }}</p>
                        </td>
                        <td class="px-8 py-6 text-gray-400 font-bold italic">{{ formatDate(order.created_at) }}</td>
                        <td class="px-8 py-6 font-bold text-brand-purple">₹{{ formatPrice(order.grand_total) }}</td>
                        <td class="px-8 py-6">
                            <span 
                                class="px-3 py-1 text-[9px] font-bold border"
                                :class="order.payment_status === 'paid' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-brand-rose border-brand-rose/20'"
                            >
                                {{ order.payment_status }}
                            </span>
                        </td>
                        <td class="px-8 py-6 text-right">
                            <button 
                                @click="downloadInvoice(order.id)"
                                class="btn-outline !py-2 !px-4 !text-[8px] flex items-center space-x-2 ml-auto"
                            >
                                <DownloadIcon :size="12" />
                                <span>Get Invoice</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { 
    RefreshCcw as RefreshIcon, 
    Download as DownloadIcon,
    Loader as LoaderIcon
} from 'lucide-vue-next'

const API_BASE = 'https://zha-fashion-backend.onrender.com/api/admin/orders'

const invoices = ref([])
const loading = ref(true)

onMounted(() => fetchInvoices())

const fetchInvoices = async () => {
    loading.value = true
    try {
        const response = await axios.get(API_BASE)
        invoices.value = response.data
    } catch (error) {
        console.error('Data failed to load')
    } finally {
        loading.value = false
    }
}

const totalRevenue = computed(() => {
    return invoices.value
        .filter(o => o.payment_status === 'paid')
        .reduce((acc, o) => acc + parseFloat(o.grand_total), 0)
})

const downloadInvoice = (orderId) => {
    window.open(`${API_BASE}/${orderId}/invoice`, '_blank')
}

const formatPrice = (price) => parseFloat(price).toLocaleString('en-IN', { maximumFractionDigits: 0 })
const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
</script>
