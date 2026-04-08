<template>
  <div class="py-12 bg-beige-light min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-16">
        <!-- left: Info & Visual -->
        <div class="lg:w-1/3">
          <div class="sticky top-32">
             <span class="text-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">Bespoke Experience</span>
             <h1 class="text-5xl font-playfair font-bold text-luxury-dark mb-8 leading-tight">Your <span class="italic text-gold font-normal">Perfect Fit</span> Guaranteed.</h1>
             <p class="text-gray-600 mb-8 leading-relaxed">Our master tailors ensure that every garment is crafted precisely to your measurements. Whether it's a blouse, lehenga, or salwar set, we bring your vision to life.</p>
             
             <div class="space-y-6 mt-12">
               <div class="flex items-start space-x-4">
                 <div class="bg-gold/10 p-2 rounded-full text-gold"><CheckIcon :size="20" /></div>
                 <div><p class="font-bold text-sm">Perfect Fit</p><p class="text-xs text-gray-400">Multiple measurement points addressed.</p></div>
               </div>
               <div class="flex items-start space-x-4">
                 <div class="bg-gold/10 p-2 rounded-full text-gold"><CheckIcon :size="20" /></div>
                 <div><p class="font-bold text-sm">Expert Design Consultation</p><p class="text-xs text-gray-400">Personal calls for design confirmation.</p></div>
               </div>
               <div class="flex items-start space-x-4">
                 <div class="bg-gold/10 p-2 rounded-full text-gold"><CheckIcon :size="20" /></div>
                 <div><p class="font-bold text-sm">Global Shipping</p><p class="text-xs text-gray-400">We deliver your custom fit worldwide.</p></div>
               </div>
             </div>

             <div class="mt-16 p-8 border border-white bg-white shadow-sm flex items-center space-x-6">
                <WhatsappIcon class="text-green-500" :size="32" />
                <div>
                   <p class="text-xs font-bold uppercase tracking-widest text-gold mb-1">Need help with measurements?</p>
                   <p class="text-sm font-playfair">Chat with our Designer</p>
                </div>
             </div>
          </div>
        </div>

        <!-- Right: The Form -->
        <div class="lg:w-2/3">
          <div class="bg-white p-12 border border-beige-dark shadow-xl animate-slide-up">
            <h2 class="text-3xl font-playfair mb-8 border-b border-beige pb-6">Measurement Order Form</h2>
            
            <form @submit.prevent="submitOrder" class="space-y-10">
              <!-- Service Selection -->
               <div>
                <label class="block text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 font-inter">Step 1: Choose Garment Type</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   <div v-for="type in garmentTypes" :key="type" @click="formData.garmentType = type" :class="formData.garmentType === type ? 'bg-gold text-white' : 'bg-beige-light text-luxury-dark hover:border-gold border border-transparent'" class="p-6 text-center cursor-pointer transition-all">
                      <span class="text-xs font-bold uppercase tracking-widest">{{ type }}</span>
                   </div>
                </div>
              </div>

              <!-- Measurement Details -->
              <div v-if="formData.garmentType">
                <label class="block text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-10 font-inter">Step 2: Enter Measurements (inches)</label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-y-8 gap-x-6">
                  <div v-for="(val, key) in measurements[formData.garmentType.toLowerCase()]" :key="key" class="space-y-2">
                    <label class="text-[10px] uppercase tracking-wider font-semibold text-gray-500">{{ key }}</label>
                    <input type="number" step="0.5" v-model="formData.measurements[key]" placeholder="0.0" class="w-full bg-beige-light border-0 px-4 py-4 focus:ring-1 focus:ring-gold outline-none text-sm transition-all text-center rounded-sm" />
                  </div>
                </div>
              </div>

              <!-- Fabric selection -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-beige pt-10">
                 <div>
                    <label class="block text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Fabric Choice</label>
                    <select v-model="formData.fabricType" class="input-field bg-beige-light border-0">
                      <option>Pure Silk</option>
                      <option>Chiffon</option>
                      <option>Raw Silk</option>
                      <option>Velvet</option>
                      <option>Organza</option>
                    </select>
                 </div>
                 <div>
                   <label class="block text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Expected Deadline</label>
                   <input type="date" v-model="formData.deadline" class="input-field bg-beige-light border-0" />
                 </div>
              </div>

              <!-- File upload -->
              <div class="border-t border-beige pt-10">
                 <label class="block text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Upload Reference Design (Optional)</label>
                 <div class="border-2 border-dashed border-beige-dark p-12 text-center bg-beige-light/50 flex flex-col items-center group cursor-pointer hover:bg-beige-light hover:border-gold transition-all">
                    <UploadIcon class="text-gold mb-4 group-hover:-translate-y-1 transition-transform" :size="32" />
                    <p class="text-sm font-medium">Click or drag image to upload</p>
                    <p class="text-[10px] uppercase text-gray-400 mt-2">PNG, JPG up to 10MB</p>
                 </div>
              </div>

              <!-- Notes -->
              <div>
                 <label class="block text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Additional Notes</label>
                 <textarea v-model="formData.notes" placeholder="e.g. Neck design, sleeve length, specific buttons..." rows="4" class="input-field bg-beige-light border-0 resize-none"></textarea>
              </div>

              <div class="pt-10 flex flex-col items-center">
                 <button class="btn-gold !px-20 !py-5 shadow-2xl hover:scale-105 transition-transform">
                   Request Price Estimate
                 </button>
                 <p class="text-[10px] uppercase text-gray-400 mt-6 tracking-widest font-bold">Secure Order | No immediate payment required</p>
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
import { 
  Check as CheckIcon, 
  MessageCircle as WhatsappIcon, 
  Upload as UploadIcon
} from 'lucide-vue-next'

const garmentTypes = ['Blouse', 'Salwar Kameez', 'Lehenga', 'Gown']

const formData = reactive({
    garmentType: 'Blouse',
    measurements: {},
    fabricType: 'Pure Silk',
    deadline: '',
    notes: ''
})

const measurements = {
    blouse: { 'Bust': 0, 'Waist': 0, 'Shoulder': 0, 'Sleeve Length': 0, 'Arm Hole': 0, 'Front Neck': 0, 'Back Neck': 0, 'Total Length': 0 },
    'salwar kameez': { 'Bust': 0, 'Waist': 0, 'Hip': 0, 'Shoulder': 0, 'Kurti Length': 0, 'Pant Length': 0, 'Sleeve': 0 },
    lehenga: { 'Waist': 0, 'Length': 0, 'Hip': 0, 'Blouse Bust': 0, 'Blouse Length': 0 },
    gown: { 'Full Length': 0, 'Bust': 0, 'Waist': 0, 'Shoulder': 0, 'Arm Hole': 0 }
}

const submitOrder = () => {
    console.log('Submitting Order:', formData)
    alert('Order request submitted! Our designer will contact you shortly with a quote.')
}
</script>
