<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="bg-white p-8 border border-beige/30 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
            <h3 class="text-3xl font-playfair font-bold text-brand-navy lowercase first-letter:uppercase">Recent <span class="italic text-brand-gold">Orders</span></h3>
            <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-2">View and manage customer purchases</p>
        </div>
        <button @click="fetchOrders" class="p-4 bg-beige-light hover:bg-brand-gold hover:text-white transition-all">
            <RefreshIcon :size="16" :class="{ 'animate-spin': loading }" />
        </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 border border-beige/30 shadow-sm">
            <p class="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-2">{{ stat.label }}</p>
            <p class="text-2xl font-playfair font-bold text-brand-navy">{{ stat.value }}</p>
        </div>
    </div>

    <!-- Table -->
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
                        <th class="px-8 py-6 font-bold">Email</th>
                        <th class="px-8 py-6 font-bold">Amount</th>
                        <th class="px-8 py-6 font-bold">Status</th>
                        <th class="px-8 py-6 font-bold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-xs uppercase tracking-widest font-medium">
                    <tr v-for="order in orders" :key="order.id" class="border-b border-beige/5 hover:bg-beige-light/30 transition-all duration-300">
                        <td class="px-8 py-6 font-bold text-brand-navy">{{ order.order_number }}</td>
                        <td class="px-8 py-6 font-bold">{{ order.user?.name || 'Guest' }}</td>
                        <td class="px-8 py-6 text-gray-400">{{ order.user?.email || 'N/A' }}</td>
                        <td class="px-8 py-6 font-bold text-brand-purple">₹{{ formatPrice(order.grand_total) }}</td>
                        <td class="px-8 py-6">
                            <select 
                                v-model="order.status" 
                                @change="updateStatus(order)"
                                class="bg-beige-light/50 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-1 ring-brand-gold"
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </td>
                        <td class="px-8 py-6 text-right">
                            <button @click="viewDetails(order)" class="text-brand-gold hover:text-brand-navy font-bold flex items-center space-x-2 ml-auto">
                                <span>Details</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div @click="selectedOrder = null" class="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"></div>
        <div class="bg-white w-full max-w-4xl relative z-10 shadow-2xl overflow-hidden animate-fade-in-up">
            <div class="bg-brand-navy p-8 flex justify-between items-center text-white">
                <div>
                  <h4 class="text-2xl font-playfair font-bold text-brand-gold italic">Order Detail</h4>
                  <p class="text-[9px] uppercase tracking-widest font-bold text-white/50 mt-1">ID: {{ selectedOrder.order_number }}</p>
                </div>
                <button @click="selectedOrder = null"><XIcon :size="24" /></button>
            </div>
            
            <div class="p-10">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div class="space-y-6">
                        <h5 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 border-b border-beige/10 pb-2">Customer Info</h5>
                        <div class="space-y-4">
                            <div>
                                <p class="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Name</p>
                                <p class="text-sm font-bold text-brand-navy">{{ selectedOrder.user?.name || 'Guest' }}</p>
                            </div>
                            <div>
                                <p class="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Email</p>
                                <p class="text-sm font-bold text-brand-navy">{{ selectedOrder.user?.email || 'N/A' }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="md:col-span-2 space-y-6">
                        <h5 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 border-b border-beige/10 pb-2">Order Items</h5>
                        <div class="space-y-4">
                            <div v-for="item in selectedOrder.items" :key="item.id" class="flex justify-between items-center bg-beige-light/30 p-4 border border-beige/10">
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-16 bg-white border border-beige/20">
                                        <img :src="item.product?.images?.[0] || '/assets/logo.png'" class="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p class="text-xs font-bold text-brand-navy">{{ item.product?.name || 'Custom Item' }}</p>
                                        <p class="text-[10px] text-gray-400">Qty: {{ item.quantity }}</p>
                                    </div>
                                </div>
                                <span class="text-xs font-bold text-brand-purple">₹{{ formatPrice(item.price * item.quantity) }}</span>
                            </div>
                        </div>
                        
                        <div class="pt-6 border-t border-beige/10 flex justify-between items-center">
                            <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount Paid</span>
                            <span class="text-xl font-playfair font-bold text-brand-navy">₹{{ formatPrice(selectedOrder.grand_total) }}</span>
                        </div>
                    </div>
                </div>

                <div class="pt-10 flex justify-end">
                    <button 
                        @click="downloadInvoice(selectedOrder)" 
                        class="btn-gold !text-[10px] !px-12 flex items-center space-x-3 shadow-2xl"
                    >
                        <DownloadIcon :size="16" />
                        <span>Print Invoice</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { 
    RefreshCcw as RefreshIcon, 
    X as XIcon,
    Loader as LoaderIcon,
    Download as DownloadIcon
} from 'lucide-vue-next'

const API_BASE = 'http://localhost:5000/api/admin'

const orders = ref([])
const loading = ref(true)
const selectedOrder = ref(null)

onMounted(() => fetchOrders())

const fetchOrders = async () => {
    loading.value = true
    try {
        const response = await axios.get(`${API_BASE}/orders`)
        orders.value = response.data
    } catch (error) {
        console.error('Order load failed')
    } finally {
        loading.value = false
    }
}

const stats = computed(() => {
    return [
        { label: 'Total Orders', value: orders.value.length },
        { label: 'Pending Payment', value: orders.value.filter(o => o.payment_status === 'unpaid').length },
        { label: 'To Deliver', value: orders.value.filter(o => o.status === 'processing' || o.status === 'pending').length },
        { label: 'Total Revenue', value: '₹' + formatPrice(orders.value.filter(o => o.payment_status === 'paid').reduce((acc, o) => acc + parseFloat(o.grand_total), 0)) }
    ]
})

const updateStatus = async (order) => {
    try {
        await axios.patch(`${API_BASE}/orders/${order.id}/status`, { status: order.status })
    } catch (error) {
        console.error('Status sync failure')
    }
}

const viewDetails = (order) => { selectedOrder.value = order }
const downloadInvoice = (order) => {
    window.open(`${API_BASE}/orders/${order.id}/invoice`, '_blank')
}

const formatPrice = (price) => parseFloat(price).toLocaleString('en-IN', { maximumFractionDigits: 0 })
</script>

<style scoped>
@keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
</style>
