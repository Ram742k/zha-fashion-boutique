<template>
  <div class="space-y-8">
    <div class="bg-white p-8 border border-beige/30 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
            <h3 class="text-3xl font-playfair font-bold text-brand-navy lowercase first-letter:uppercase">Product <span class="italic text-brand-gold">Categories</span></h3>
            <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-2">Manage how your items are grouped and displayed</p>
        </div>
        <button @click="openModal" class="btn-gold !text-[9px] !px-8 flex items-center space-x-2">
            <PlusIcon :size="14" />
            <span>Add Category</span>
        </button>
    </div>

    <div class="bg-white border border-beige/30 shadow-sm relative overflow-hidden">
        <div v-if="loading" class="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center">
            <LoaderIcon class="animate-spin text-brand-gold" :size="30" />
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left min-w-[600px]">
                <thead>
                    <tr class="text-[10px] uppercase tracking-[0.3em] text-gray-400 border-b border-beige/10 bg-beige-light/30">
                        <th class="px-8 py-6 font-bold">Category Name</th>
                        <th class="px-8 py-6 font-bold">Web Link (Slug)</th>
                        <th class="px-8 py-6 font-bold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-xs uppercase tracking-widest font-medium">
                    <tr v-if="categories.length === 0 && !loading">
                        <td colspan="3" class="px-8 py-20 text-center text-gray-400 italic font-bold">No categories found. Create your first group above.</td>
                    </tr>
                    <tr v-for="cat in categories" :key="cat.id" class="border-b border-beige/5 hover:bg-beige-light/30 transition-all duration-300">
                        <td class="px-8 py-6 font-bold text-brand-navy">{{ cat.name }}</td>
                        <td class="px-8 py-6 text-gray-400 italic">/{{ cat.slug }}</td>
                        <td class="px-8 py-6 text-right">
                            <div class="flex justify-end space-x-4">
                                <button @click="editCategory(cat)" class="p-2 border border-beige/30 hover:bg-brand-gold hover:text-white transition-all bg-white" title="Edit">
                                    <EditIcon :size="14" />
                                </button>
                                <button @click="deleteCategory(cat.id)" class="p-2 border border-beige/30 hover:bg-brand-rose hover:text-white transition-all bg-white" title="Delete">
                                    <TrashIcon :size="14" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div @click="showModal = false" class="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"></div>
        <div class="bg-white w-full max-w-md relative z-10 shadow-2xl animate-fade-in-up">
            <div class="bg-brand-navy p-6 flex justify-between items-center text-brand-gold">
                <h4 class="text-xl font-playfair font-bold italic">{{ isEditing ? 'Edit Category' : 'New Category' }}</h4>
                <button @click="showModal = false" class="text-white hover:text-brand-rose"><XIcon :size="24" /></button>
            </div>
            <form @submit.prevent="saveCategory" class="p-8 space-y-6">
                <div class="space-y-3">
                    <label class="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-bold">Category Name</label>
                    <input type="text" v-model="form.name" required class="w-full bg-beige-light border-none px-6 py-4 font-bold text-brand-navy text-xs outline-none focus:ring-1 ring-brand-gold" placeholder="e.g. Silk Sarees" />
                </div>
                <div class="flex justify-end space-x-4 pt-4">
                    <button type="button" @click="showModal = false" class="btn-outline !text-[9px] !px-6">Cancel</button>
                    <button type="submit" :disabled="saving" class="btn-gold !text-[9px] !px-10 flex items-center space-x-2">
                        <LoaderIcon v-if="saving" class="animate-spin" :size="12" />
                        <span>{{ isEditing ? 'Save Changes' : 'Create Category' }}</span>
                    </button>
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
    Edit2 as EditIcon, 
    Trash2 as TrashIcon,
    X as XIcon,
    Loader as LoaderIcon
} from 'lucide-vue-next'

const API_BASE = 'https://zha-fashion-backend.onrender.com/api/admin/categories'

const categories = ref([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const currentId = ref(null)

const form = reactive({ name: '' })

onMounted(() => fetchCategories())

const fetchCategories = async () => {
    loading.value = true
    try {
        const response = await axios.get(API_BASE)
        categories.value = response.data
    } catch (error) {
        console.error('Load failed')
    } finally {
        loading.value = false
    }
}

const openModal = () => {
    isEditing.value = false
    form.name = ''
    showModal.value = true
}

const editCategory = (cat) => {
    isEditing.value = true
    currentId.value = cat.id
    form.name = cat.name
    showModal.value = true
}

const saveCategory = async () => {
    saving.value = true
    try {
        if (isEditing.value) {
            await axios.put(`${API_BASE}/${currentId.value}`, form)
        } else {
            await axios.post(API_BASE, form)
        }
        await fetchCategories()
        showModal.value = false
    } catch (error) {
        console.error('Save failed')
    } finally {
        saving.value = false
    }
}

const deleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
        await axios.delete(`${API_BASE}/${id}`)
        await fetchCategories()
    } catch (error) {
        console.error('Delete failed')
    }
}
</script>

<style scoped>
@keyframes fade-in-up {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
</style>
