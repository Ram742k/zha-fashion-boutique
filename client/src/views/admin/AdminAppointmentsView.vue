<template>
  <div class="space-y-12">
    <!-- Header -->
    <div class="flex justify-between items-center border-b border-beige/20 pb-6">
        <h2 class="text-3xl font-playfair font-bold text-brand-navy tracking-widest uppercase">Bridal Consultations</h2>
        <p class="text-xs text-gray-400 uppercase tracking-widest">Manage designer bookings</p>
    </div>

    <!-- Bookings Table -->
    <div class="bg-white border border-beige/30 overflow-hidden shadow-sm">
        <div class="p-8 border-b border-beige/20 flex justify-between items-center">
            <h3 class="text-lg font-playfair font-bold text-brand-navy">Active Booking Requests</h3>
            <span class="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Total: {{ appointments.length }}</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left min-w-[1000px]">
            <thead>
                <tr class="text-[10px] uppercase tracking-[0.3em] text-gray-400 border-b border-beige/10">
                    <th class="px-8 py-6 font-bold">Client / Contact</th>
                    <th class="px-8 py-6 font-bold">Booking Details</th>
                    <th class="px-8 py-6 font-bold">Wedding Date</th>
                    <th class="px-8 py-6 font-bold">Budget & Designer</th>
                    <th class="px-8 py-6 font-bold">Status</th>
                    <th class="px-8 py-6 font-bold text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="text-xs uppercase tracking-widest font-medium">
                <tr v-for="app in appointments" :key="app._id" class="border-b border-beige/5 hover:bg-beige-light/30 transition-all duration-300">
                    <td class="px-8 py-6">
                        <p class="font-bold text-brand-navy">{{ app.user?.name || 'Guest User' }}</p>
                        <p class="text-[9px] lowercase tracking-normal text-gray-400 font-inter mt-1">{{ app.user?.email }}</p>
                    </td>
                    <td class="px-8 py-6">
                        <p class="text-brand-gold font-bold">{{ formatDate(app.appointment_date) }}</p>
                        <p class="text-[9px] text-gray-400 mt-1 italic font-inter lowercase first-letter:uppercase">{{ app.appointment_time }}</p>
                    </td>
                    <td class="px-8 py-6 text-gray-500 italic">
                        {{ app.wedding_date ? formatDate(app.wedding_date) : 'N/A' }}
                    </td>
                    <td class="px-8 py-6">
                        <p class="font-bold text-brand-navy">₹{{ app.budget ? app.budget.toLocaleString() : 'Not Specified' }}</p>
                        <input 
                           type="text" 
                           v-model="app.preferred_designer" 
                           placeholder="Assign Designer"
                           class="mt-2 bg-beige-light border-none px-3 py-2 text-[9px] w-full font-bold outline-none focus:ring-1 ring-brand-gold text-brand-navy uppercase"
                           @change="updateDesigner(app)"
                        />
                    </td>
                    <td class="px-8 py-6">
                        <span :class="statusClass(app.status)" class="px-3 py-1 text-[9px] font-bold border italic capitalize">{{ app.status }}</span>
                    </td>
                    <td class="px-8 py-6 text-right space-x-2">
                        <button 
                           v-if="app.status === 'pending'"
                           @click="updateStatus(app._id, 'approved')"
                           class="text-green-600 hover:text-green-800 font-bold border border-green-200 px-3 py-2 bg-green-50 text-[9px]"
                        >
                           Approve
                        </button>
                        <button 
                           v-if="app.status === 'pending'"
                           @click="updateStatus(app._id, 'rejected')"
                           class="text-red-600 hover:text-red-800 font-bold border border-red-200 px-3 py-2 bg-red-50 text-[9px]"
                        >
                           Reject
                        </button>
                        <button 
                           @click="viewNotes(app)"
                           class="text-brand-navy hover:text-brand-gold font-bold border border-beige/10 px-3 py-2 bg-white text-[9px]"
                        >
                           Notes
                        </button>
                    </td>
                </tr>
            </tbody>
          </table>
        </div>
    </div>

    <!-- Notes Modal -->
    <div v-if="selectedApp" class="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-sm">
       <div class="bg-white p-8 max-w-lg w-full border border-brand-gold/20 shadow-2xl relative">
          <h3 class="text-xl font-playfair font-bold text-brand-navy mb-4 border-b pb-3 uppercase tracking-widest">Consultation Notes</h3>
          <p class="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-4">Client: {{ selectedApp.user?.name }}</p>
          
          <div class="space-y-4 font-inter">
             <div>
                <label class="block text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2">Requirements / Notes</label>
                <textarea 
                   v-model="selectedApp.notes" 
                   rows="4" 
                   class="w-full bg-beige-light border-0 p-3 text-xs outline-none focus:ring-1 ring-brand-gold resize-none"
                   placeholder="Enter notes..."
                ></textarea>
             </div>
             <div v-if="selectedApp.inspiration_images?.length">
                <label class="block text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2">Inspiration Image</label>
                <img :src="selectedApp.inspiration_images[0]" class="w-full max-h-48 object-cover border" />
             </div>
          </div>

          <div class="mt-8 flex justify-end space-x-4">
             <button @click="selectedApp = null" class="px-6 py-3 border text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:bg-beige-light">Close</button>
             <button @click="saveNotes" class="px-6 py-3 bg-brand-navy text-white hover:bg-brand-gold hover:text-white transition-colors text-[10px] uppercase tracking-widest font-bold">Save Notes</button>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const appointments = ref([])
const selectedApp = ref(null)

const fetchAppointments = async () => {
    try {
        const response = await axios.get('/admin/appointments')
        appointments.value = response.data
    } catch (error) {
        console.error('Failed to load appointments', error)
    }
}

onMounted(fetchAppointments)

const updateStatus = async (id, status) => {
    try {
        await axios.patch(`/admin/appointments/${id}/status`, { status })
        alert(`Appointment status updated to ${status}!`)
        fetchAppointments()
    } catch (error) {
        console.error(error)
        alert('Failed to update appointment status')
    }
}

const updateDesigner = async (app) => {
    try {
        await axios.patch(`/admin/appointments/${app._id}/designer`, {
            preferred_designer: app.preferred_designer
        })
        alert('Designer assigned successfully!')
    } catch (error) {
        console.error(error)
        alert('Failed to update designer')
    }
}

const viewNotes = (app) => {
    selectedApp.value = { ...app }
}

const saveNotes = async () => {
    try {
        await axios.patch(`/admin/appointments/${selectedApp.value._id}/designer`, {
            notes: selectedApp.value.notes
        })
        alert('Notes updated successfully!')
        selectedApp.value = null
        fetchAppointments()
    } catch (error) {
        console.error(error)
        alert('Failed to save notes')
    }
}

const statusClass = (status) => {
    if (status === 'approved') return 'bg-green-50 text-green-600 border-green-100'
    if (status === 'rejected') return 'bg-red-50 text-red-600 border-red-100'
    return 'bg-yellow-50 text-yellow-600 border-yellow-100'
}

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
}
</script>
