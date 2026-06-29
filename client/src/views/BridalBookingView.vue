<template>
  <div class="py-12 bg-beige-light min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-16">
        <!-- left: Info & Philosophy -->
        <div class="lg:w-1/3">
          <div class="sticky top-32">
             <span class="text-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">Haute Couture</span>
             <h1 class="text-5xl font-playfair font-bold text-luxury-dark mb-8 leading-tight">Bridal <span class="italic text-gold font-normal">Consultation</span> Booking</h1>
             <p class="text-gray-600 mb-8 leading-relaxed font-light">Let our lead bridal designers craft your dream wedding silhouette. Experience a personalized, detail-oriented design session covering sketches, fabrics, and measurement guides.</p>
             
             <div class="space-y-6 mt-12">
               <div class="flex items-start space-x-4">
                 <div class="bg-gold/10 p-2 rounded-full text-gold"><CalendarIcon :size="20" /></div>
                 <div><p class="font-bold text-sm">Flexible Timings</p><p class="text-xs text-gray-400">Choose a convenient slot for in-person or video calls.</p></div>
               </div>
               <div class="flex items-start space-x-4">
                 <div class="bg-gold/10 p-2 rounded-full text-gold"><UserIcon :size="20" /></div>
                 <div><p class="font-bold text-sm">Dedicated Designer</p><p class="text-xs text-gray-400">Assigned professional designer throughout your journey.</p></div>
               </div>
             </div>
          </div>
        </div>

        <!-- Right: Bridal Consultation Form -->
        <div class="lg:w-2/3">
          <div class="bg-white p-12 border border-beige-dark shadow-xl animate-slide-up">
            <h2 class="text-3xl font-playfair mb-8 border-b border-beige pb-6">Consultation Request Form</h2>
            
            <form @submit.prevent="submitBooking" class="space-y-10">
              <!-- Date & Time Selection -->
               <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div>
                    <label class="block text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Preferred Consultation Date</label>
                    <input type="date" required v-model="form.appointment_date" class="input-field bg-beige-light border-0" />
                 </div>
                 <div>
                    <label class="block text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Preferred Time Slot</label>
                    <select required v-model="form.appointment_time" class="input-field bg-beige-light border-0">
                      <option>10:00 AM - 12:00 PM</option>
                      <option>12:00 PM - 02:00 PM</option>
                      <option>03:00 PM - 05:00 PM</option>
                      <option>05:00 PM - 07:00 PM</option>
                    </select>
                 </div>
              </div>

              <!-- Wedding Details -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-beige pt-10">
                 <div>
                    <label class="block text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Wedding / Occasion Date</label>
                    <input type="date" v-model="form.wedding_date" class="input-field bg-beige-light border-0" />
                 </div>
                 <div>
                    <label class="block text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Estimated Budget (INR)</label>
                    <input type="number" placeholder="e.g. 50000" v-model="form.budget" class="input-field bg-beige-light border-0" />
                 </div>
              </div>

              <!-- Preferred Designer -->
              <div>
                 <label class="block text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Preferred Designer</label>
                 <select v-model="form.preferred_designer" class="input-field bg-beige-light border-0">
                   <option>Lead Bridal Designer (Mythili)</option>
                   <option>Embroidery Expert (Karthik)</option>
                   <option>Senior Couture Stylist (Ramya)</option>
                   <option>Any Available Stylist</option>
                 </select>
              </div>

              <!-- Inspiration upload -->
              <div class="border-t border-beige pt-10">
                 <label class="block text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Upload Inspiration Sketches / Photos</label>
                 <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept="image/*" />
                 <div @click="fileInput.click()" class="border-2 border-dashed border-beige-dark p-12 text-center bg-beige-light/50 flex flex-col items-center group cursor-pointer hover:bg-beige-light hover:border-gold transition-all relative">
                    <div v-if="!previewImage" class="flex flex-col items-center">
                       <UploadIcon class="text-gold mb-4 group-hover:-translate-y-1 transition-transform" :size="32" />
                       <p class="text-sm font-medium">Click to upload inspiration image</p>
                       <p class="text-[10px] uppercase text-gray-400 mt-2">PNG, JPG up to 10MB</p>
                    </div>
                    <img v-else :src="previewImage" class="absolute inset-0 w-full h-full object-cover" />
                    <button v-if="previewImage" type="button" @click.stop="previewImage = null" class="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg z-10">
                      <XIcon :size="16" />
                    </button>
                 </div>
              </div>

              <!-- Notes -->
              <div>
                 <label class="block text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Special Requirements / Measurements Info</label>
                 <textarea v-model="form.notes" placeholder="Tell us about your wedding theme, color preferences, or customization requests..." rows="5" class="input-field bg-beige-light border-0 resize-none"></textarea>
              </div>

              <div class="pt-10 flex flex-col items-center">
                 <button type="submit" class="btn-gold !px-20 !py-5 shadow-2xl hover:scale-105 transition-transform">
                   Request Consultation Booking
                 </button>
                 <p class="text-center text-[10px] uppercase text-gray-400 mt-6 tracking-widest font-bold">Booking confirmation details will be sent via WhatsApp/Email</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { 
  Calendar as CalendarIcon, 
  User as UserIcon, 
  Upload as UploadIcon,
  X as XIcon
} from 'lucide-vue-next'

const router = useRouter()
const fileInput = ref(null)
const previewImage = ref(null)

const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
            previewImage.value = event.target.result
        }
        reader.readAsDataURL(file)
    }
}

const form = reactive({
    appointment_date: '',
    appointment_time: '10:00 AM - 12:00 PM',
    wedding_date: '',
    budget: '',
    preferred_designer: 'Lead Bridal Designer (Mythili)',
    notes: ''
})

const submitBooking = async () => {
    try {
        const payload = {
            appointment_date: form.appointment_date,
            appointment_time: form.appointment_time,
            wedding_date: form.wedding_date,
            budget: form.budget ? parseFloat(form.budget) : undefined,
            preferred_designer: form.preferred_designer,
            notes: form.notes,
            inspiration_images: previewImage.value ? [previewImage.value] : []
        }
        await axios.post('/appointments', payload)
        alert('Bridal consultation request submitted! Our styling desk will contact you to confirm the time slot.')
        router.push('/dashboard')
    } catch (error) {
        alert('Please login to book a consultation.')
        router.push('/login')
    }
}
</script>
