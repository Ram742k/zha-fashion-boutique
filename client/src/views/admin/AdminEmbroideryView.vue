<template>
  <div class="space-y-8">
    <div class="bg-white p-8 border border-beige/30 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
            <h3 class="text-3xl font-playfair font-bold text-brand-navy lowercase first-letter:uppercase">Embroidery <span class="italic text-brand-gold">Designs</span></h3>
            <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-2">Showcase your signature stitching and thread work</p>
        </div>
        <button @click="showAddModal = true" class="btn-gold !text-[9px] !px-8 flex items-center space-x-2">
            <PlusIcon :size="14" />
            <span>Add Portfolio Item</span>
        </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-if="loading" class="col-span-full py-20 flex justify-center">
            <LoaderIcon class="animate-spin text-brand-gold" :size="40" />
        </div>
        <div v-for="item in works" :key="item.id" class="group bg-white border border-beige/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
            <div class="aspect-[4/5] overflow-hidden relative">
                <img :src="item.image_url" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                <div class="absolute inset-0 bg-brand-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <button @click="deleteItem(item.id)" class="p-3 bg-brand-rose text-white rounded-full hover:bg-black transition-colors">
                        <TrashIcon :size="16" />
                    </button>
                </div>
            </div>
            <div class="p-6">
                <h4 class="text-sm font-bold text-brand-navy uppercase tracking-widest mb-1">{{ item.title }}</h4>
                <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{{ item.category }}</p>
            </div>
        </div>
    </div>

    <!-- Modal for adding portfolio -->
    <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div @click="showAddModal = false" class="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"></div>
        <div class="bg-white w-full max-w-md relative z-10 shadow-2xl animate-fade-in-up">
            <div class="bg-brand-navy p-6 flex justify-between items-center text-brand-gold">
                <h4 class="text-xl font-playfair font-bold italic">Add New Work</h4>
                <button @click="showAddModal = false" class="text-white hover:text-brand-rose"><XIcon :size="24" /></button>
            </div>
            <form @submit.prevent="saveWork" class="p-8 space-y-6">
                <div class="space-y-4">
                    <label class="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-bold block">Art Title</label>
                    <input type="text" v-model="form.title" required class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-brand-navy focus:ring-1 ring-brand-gold outline-none" placeholder="e.g. Zardosi Bridal Pattern" />
                </div>
                <div class="space-y-4">
                    <label class="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-bold block">Category</label>
                    <input type="text" v-model="form.category" required class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-brand-navy focus:ring-1 ring-brand-gold outline-none" placeholder="e.g. Blouse" />
                </div>
                <div class="space-y-4">
                    <label class="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-bold block">Local Path (Image)</label>
                    <input type="text" v-model="form.image_url" required class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-brand-navy focus:ring-1 ring-brand-gold outline-none" placeholder="/assets/portfolio/..." />
                </div>
                <div class="flex justify-end pt-4">
                    <button type="submit" class="btn-gold !text-[10px] !px-12 py-3">Publish Item</button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { 
    Plus as PlusIcon, 
    Trash2 as TrashIcon,
    Loader as LoaderIcon,
    X as XIcon
} from 'lucide-vue-next'

const API_BASE = 'https://zha-fashion-backend.onrender.com/api/admin/embroidery'

const works = ref([])
const loading = ref(true)
const showAddModal = ref(false)
const form = reactive({ title: '', category: '', image_url: '' })

onMounted(() => fetchWorks())

const fetchWorks = async () => {
    loading.value = true
    try {
        const response = await axios.get(API_BASE)
        works.value = response.data
    } catch (error) {
        console.error('Portfolio load failed')
    } finally {
        loading.value = false
    }
}

const saveWork = async () => {
    try {
        await axios.post(API_BASE, form)
        await fetchWorks()
        showAddModal.value = false
        Object.assign(form, { title: '', category: '', image_url: '' })
    } catch (error) {
        console.error('Creation failed')
    }
}

const deleteItem = async (id) => {
    if (!confirm('Remove this art piece?')) return
    try {
        await axios.delete(`${API_BASE}/${id}`)
        await fetchWorks()
    } catch (error) {
        console.error('Delete failed')
    }
}
</script>
