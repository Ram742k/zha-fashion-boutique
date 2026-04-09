<template>
  <div class="py-12 bg-white min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
         <!-- Left: Visual & Process -->
         <div class="space-y-12 animate-fade-in">
           <div>
             <span class="text-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">Designer Work</span>
             <h1 class="text-6xl font-playfair font-bold text-luxury-dark mb-8 leading-tight">Artistic <br /><span class="italic text-gold font-normal">Embroidery</span> Portfolio.</h1>
             <p class="text-gray-500 font-light leading-loose text-lg">We offer both machine and hand-embroidered designs for all your fashion needs. From intricate Zardosi to modern sequin work.</p>
           </div>
           
           <div class="aspect-square bg-beige-light group overflow-hidden shadow-2xl relative">
              <img src="/assets/embroidery.png" alt="Embroidery Detail" class="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-125" />
              <div class="absolute bottom-10 left-10 p-8 bg-white/80 backdrop-blur-md shadow-lg w-fit group-hover:-translate-y-4 transition-transform">
                 <p class="font-bold text-lg font-playfair italic">Gold Zardosi Detail</p>
                 <p class="text-[10px] uppercase text-gray-400 mt-1">Handcrafted in our studio</p>
              </div>
           </div>

           <div class="grid grid-cols-2 gap-8">
             <div class="p-6 border border-beige hover:border-gold transition-colors">
               <h4 class="font-playfair text-xl font-bold mb-3 italic">Hand Embroidery</h4>
               <p class="text-xs text-gray-500 leading-relaxed font-inter">Pure manual work for high-end boutique results.</p>
             </div>
             <div class="p-6 border border-beige hover:border-gold transition-colors">
               <h4 class="font-playfair text-xl font-bold mb-3 italic">Computer Work</h4>
               <p class="text-xs text-gray-500 leading-relaxed font-inter">Consistent, high-volume production with precision.</p>
             </div>
           </div>
         </div>

         <!-- Right: Custom Order Form -->
         <div class="bg-beige-light/50 p-12 lg:p-20 border border-beige animate-slide-up sticky top-32 h-fit overflow-hidden">
            <div class="absolute -top-20 -right-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
            
            <h2 class="text-3xl font-playfair mb-12 text-center uppercase tracking-widest border-b border-gold pb-6">Upload Your Design</h2>
            
            <form @submit.prevent="submitEmbroidery" class="space-y-12">
               <!-- Image Upload Box -->
               <div class="group">
                  <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept="image/*" />
                  <div @click="fileInput.click()" class="aspect-video border-2 border-dashed border-gold-dark/30 bg-white flex flex-col items-center justify-center p-12 cursor-pointer hover:bg-white hover:border-gold transition-all relative overflow-hidden">
                     <div v-if="!imagePreview" class="flex flex-col items-center">
                        <UploadIcon :size="48" class="text-gold mb-6 group-hover:scale-110 transition-transform" />
                        <p class="font-bold uppercase tracking-widest text-xs">Drop your sketch or photo here</p>
                        <p class="text-[10px] text-gray-400 mt-4 lowercase font-inter italic">(jpg, png or pdf max 25mb)</p>
                     </div>
                     <img v-else :src="imagePreview" class="absolute inset-0 w-full h-full object-cover" />
                     <button v-if="imagePreview" type="button" @click.stop="imagePreview = null" class="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg z-10">
                       <XIcon :size="16" />
                     </button>
                  </div>
               </div>

               <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div class="space-y-3">
                     <label class="text-[11px] uppercase tracking-widest font-bold text-gray-400">Approx Quantity</label>
                     <input type="number" v-model="form.quantity" placeholder="Min. 5 pieces" class="input-field bg-white" />
                  </div>
                  <div class="space-y-3">
                     <label class="text-[11px] uppercase tracking-widest font-bold text-gray-400">Embroidery Type</label>
                     <select v-model="form.type" class="input-field bg-white">
                        <option>Zardosi</option>
                        <option>Aari Work</option>
                        <option>Cut Work</option>
                        <option>Mirror Work</option>
                        <option>Applique</option>
                     </select>
                  </div>
               </div>

               <div class="space-y-3">
                  <label class="text-[11px] uppercase tracking-widest font-bold text-gray-400">Project Requirements</label>
                  <textarea v-model="form.requirements" rows="5" placeholder="Specify color combinations, thread type, etc." class="input-field bg-white resize-none"></textarea>
               </div>

               <button type="submit" class="btn-gold !bg-luxury-dark w-full !py-6 text-sm !font-bold tracking-[0.3em] shadow-lg hover:!bg-black transition-all">Submit for Professional Quote</button>
               
               <p class="text-center text-xs text-gray-400 italic">Expected reply within 12-24 hours via WhatsApp/Email.</p>
            </form>
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
  UploadCloud as UploadIcon,
  X as XIcon
} from 'lucide-vue-next'

const router = useRouter()
const fileInput = ref(null)
const imagePreview = ref(null)

const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
            imagePreview.value = event.target.result
        }
        reader.readAsDataURL(file)
    }
}

const form = reactive({
    quantity: 5,
    type: 'Zardosi',
    requirements: ''
})

const submitEmbroidery = async () => {
    try {
        const payload = {
            design_image: imagePreview.value,
            quantity: form.quantity,
            type: form.type,
            notes: form.requirements
        }
        await axios.post('http://localhost:5000/api/embroidery', payload)
        alert('Design submitted! Our team will get back to you with a quote.')
        router.push('/dashboard')
    } catch (error) {
        alert('Please login to submit your design.')
        router.push('/login')
    }
}
</script>
