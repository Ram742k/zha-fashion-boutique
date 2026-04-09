<template>
  <div class="space-y-8">
    <div v-if="notification" :class="[notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'p-4 rounded-sm border border-current font-bold text-[10px] uppercase tracking-widest']">
      {{ notification.message }}
    </div>

    <div class="bg-white p-8 border border-beige/30 flex justify-between items-center shadow-sm">
        <div>
            <h3 class="text-3xl font-playfair font-bold text-brand-navy lowercase first-letter:uppercase">Patron <span class="italic text-brand-purple">Directory</span></h3>
            <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-2">Managing customer profiles and engagement history</p>
        </div>
        <div class="flex items-center space-x-6">
            <button @click="fetchUsers" class="p-4 bg-beige-light hover:bg-brand-purple hover:text-white transition-all shadow-sm">
                <RefreshIcon :size="16" :class="{ 'animate-spin': loading }" />
            </button>
        </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white border border-beige/30 shadow-sm relative overflow-hidden">
        <div v-if="loading" class="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center">
            <LoaderIcon class="animate-spin text-brand-purple" :size="30" />
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left min-w-[1000px]">
                <thead>
                    <tr class="text-[10px] uppercase tracking-[0.3em] text-gray-400 border-b border-beige/10 bg-beige-light/30">
                        <th class="px-8 py-6 font-bold">Patron</th>
                        <th class="px-8 py-6 font-bold">Role & Identity</th>
                        <th class="px-8 py-6 font-bold">Contact Intelligence</th>
                        <th class="px-8 py-6 font-bold">Registration Date</th>
                        <th class="px-8 py-6 font-bold">Status</th>
                        <th class="px-8 py-6 font-bold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-xs uppercase tracking-widest font-medium">
                    <tr v-if="users.length === 0 && !loading">
                        <td colspan="6" class="px-8 py-16 text-center text-gray-400 italic">No patron records found.</td>
                    </tr>
                    <tr v-for="user in users" :key="user.id" class="border-b border-beige/5 hover:bg-beige-light/30 transition-all duration-300">
                        <td class="px-8 py-6">
                            <div class="flex items-center space-x-4">
                                <div class="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center text-brand-gold text-[10px] font-bold shadow-lg">
                                    {{ getInitials(user.name) }}
                                </div>
                                <p class="font-bold text-brand-navy">{{ user.name }}</p>
                            </div>
                        </td>
                        <td class="px-8 py-6">
                            <span class="text-brand-purple font-bold">{{ user.role }}</span>
                        </td>
                        <td class="px-8 py-6">
                            <p class="text-gray-500 lowercase normal-case tracking-normal mb-1">{{ user.email }}</p>
                            <p v-if="user.phone" class="text-[9px] text-gray-400 font-bold">{{ user.phone }}</p>
                        </td>
                        <td class="px-8 py-6 text-gray-400 font-bold italic">{{ formatDate(user.created_at) }}</td>
                        <td class="px-8 py-6">
                            <button 
                                @click="toggleStatus(user)"
                                class="px-3 py-1 text-[9px] font-bold transition-all border outline-none"
                                :class="user.status === 'active' ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white' : 'bg-red-50 text-brand-rose border-brand-rose/20 hover:bg-brand-rose hover:text-white'"
                            >
                                {{ user.status === 'active' ? 'Active' : 'Blocked' }}
                            </button>
                        </td>
                        <td class="px-8 py-6 text-right">
                            <div class="flex justify-end space-x-4">
                                <button @click="showUserDetails(user)" class="text-gray-400 hover:text-brand-gold transition-colors"><ViewIcon :size="16" /></button>
                                <button @click="confirmDelete(user)" class="text-gray-400 hover:text-brand-rose transition-colors"><TrashIcon :size="16" /></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- User Details Modal -->
    <div v-if="selectedUser" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div @click="selectedUser = null" class="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"></div>
        <div class="bg-white max-w-md w-full relative z-10 shadow-2xl border border-brand-purple/20 overflow-hidden animate-fade-in-up">
            <div class="bg-brand-navy p-8 text-center relative overflow-hidden">
                <div class="absolute inset-0 bg-brand-purple/10"></div>
                <div class="w-20 h-20 rounded-full bg-brand-gold text-brand-navy font-playfair font-bold text-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl relative z-10 border-4 border-white/20">
                    {{ getInitials(selectedUser.name) }}
                </div>
                <h4 class="text-2xl font-playfair font-bold text-white relative z-10">{{ selectedUser.name }}</h4>
                <p class="text-[10px] uppercase tracking-[0.4em] text-brand-gold relative z-10 mt-2">{{ selectedUser.role }}</p>
            </div>
            <div class="p-10 space-y-8">
                <div class="flex items-center space-x-6">
                    <div class="p-3 bg-beige-light rounded-full text-brand-purple"><EmailIcon :size="18" /></div>
                    <div>
                        <p class="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Email Access</p>
                        <p class="text-sm font-bold text-brand-navy">{{ selectedUser.email }}</p>
                    </div>
                </div>
                <div v-if="selectedUser.phone" class="flex items-center space-x-6">
                    <div class="p-3 bg-beige-light rounded-full text-brand-purple"><PhoneIcon :size="18" /></div>
                    <div>
                        <p class="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Communication Line</p>
                        <p class="text-sm font-bold text-brand-navy">{{ selectedUser.phone }}</p>
                    </div>
                </div>
                <button @click="selectedUser = null" class="w-full btn-gold !py-4 text-[10px] tracking-[0.3em] font-bold">Close Profile</button>
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
    Eye as ViewIcon, 
    Trash2 as TrashIcon,
    Mail as EmailIcon,
    Phone as PhoneIcon,
    Loader as LoaderIcon
} from 'lucide-vue-next'

const API_BASE = 'https://zha-fashion-boutique.onrender.com/api/admin'

const users = ref([])
const loading = ref(true)
const selectedUser = ref(null)
const notification = ref(null)

onMounted(() => fetchUsers())

const fetchUsers = async () => {
    loading.value = true
    try {
        const response = await axios.get(`${API_BASE}/users`)
        users.value = response.data
    } catch (error) {
        showNotification('Sync Error: Internal patron network unreachable', 'error')
    } finally {
        loading.value = false
    }
}

const toggleStatus = async (user) => {
    try {
        await axios.post(`${API_BASE}/users/${user.id}/toggle`)
        user.status = user.status === 'active' ? 'blocked' : 'active'
        showNotification(`Identity Status Shifted: ${user.name} is now ${user.status}`, 'success')
    } catch (error) {
        showNotification('Access Override Failed', 'error')
    }
}

const confirmDelete = async (user) => {
    if (confirm(`Permanent Deletion: Erase ${user.name} from studio archives?`)) {
        try {
            await axios.delete(`${API_BASE}/users/${user.id}`)
            showNotification('Record Erasure Successful', 'success')
            await fetchUsers()
        } catch (error) {
            showNotification('Erasure Denied by System', 'error')
        }
    }
}

const showUserDetails = (user) => {
    selectedUser.value = user
}

const showNotification = (message, type = 'success') => {
    notification.value = { message, type }
    setTimeout(() => { notification.value = null }, 5000)
}

const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
</script>

<style scoped>
@keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
</style>
