<template>
  <div class="space-y-8">
    <!-- Notifications -->
    <div v-if="notification" :class="[notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'p-4 rounded-sm flex justify-between items-center shadow-sm border border-current opacity-90 transition-all duration-300']">
      <span class="text-[10px] uppercase tracking-widest font-bold">{{ notification.message }}</span>
      <button @click="notification = null" class="text-xs font-bold">&times;</button>
    </div>

    <!-- Header Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 border border-beige/30 shadow-sm">
        <div>
            <h3 class="text-3xl font-playfair font-bold text-brand-navy mb-2 lowercase first-letter:uppercase">Product <span class="italic text-brand-gold">List</span></h3>
            <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Total Products: {{ products.length }}</p>
        </div>
        <div class="flex space-x-4">
            <button @click="exportItems" class="btn-outline !text-[9px] !px-6 flex items-center space-x-2" :disabled="exporting">
                <DownloadIcon v-if="!exporting" :size="14" />
                <LoaderIcon v-else :size="14" class="animate-spin" />
                <span>{{ exporting ? 'Downloading...' : 'Download CSV' }}</span>
            </button>
            <button @click="openAddModal" class="btn-gold !text-[9px] !px-8 flex items-center space-x-2">
                <PlusIcon :size="14" />
                <span>Add Product</span>
            </button>
        </div>
    </div>

    <!-- List Section -->
    <div class="bg-white border border-beige/30 shadow-sm relative overflow-hidden">
        <div v-if="loading" class="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <LoaderIcon class="animate-spin text-brand-gold" :size="40" />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left min-w-[1000px]">
            <thead>
                <tr class="text-[10px] uppercase tracking-[0.3em] text-gray-400 border-b border-beige/20 bg-beige-light/30">
                    <th class="px-8 py-6 font-bold">Image</th>
                    <th class="px-8 py-6 font-bold">Product Name</th>
                    <th class="px-8 py-6 font-bold">Category</th>
                    <th class="px-8 py-6 font-bold">Price</th>
                    <th class="px-8 py-6 font-bold">Stock</th>
                    <th class="px-8 py-6 font-bold">Status</th>
                    <th class="px-8 py-6 font-bold text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="text-xs uppercase tracking-widest font-medium">
                <tr v-if="products.length === 0 && !loading">
                  <td colspan="7" class="px-8 py-20 text-center text-gray-400 font-bold italic">No products found. Add your first product above.</td>
                </tr>
                <tr v-for="product in products" :key="product.id" class="border-b border-beige/10 hover:bg-beige-light/30 transition-all duration-300 group">
                    <td class="px-8 py-6">
                        <div class="w-16 h-20 bg-beige-light border border-beige/30 overflow-hidden">
                            <img :src="getImage(product)" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Product" />
                        </div>
                    </td>
                    <td class="px-8 py-6">
                        <p class="font-bold text-brand-navy mb-1">{{ product.name }}</p>
                        <p class="text-[9px] text-gray-400 lowercase font-bold">{{ product.slug }}</p>
                    </td>
                    <td class="px-8 py-6 text-brand-purple italic font-bold">{{ product.category?.name || 'No Category' }}</td>
                    <td class="px-8 py-6 font-bold text-brand-navy">₹{{ formatPrice(product.price) }}</td>
                    <td class="px-8 py-6 font-bold">{{ product.stock }} Units</td>
                    <td class="px-8 py-6">
                        <span v-if="product.status" class="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-bold border border-green-100">Live</span>
                        <span v-else class="px-3 py-1 bg-gray-100 text-gray-400 text-[9px] font-bold border border-gray-200">Hidden</span>
                    </td>
                    <td class="px-8 py-6 text-right">
                        <div class="flex justify-end space-x-4">
                            <button @click="editProduct(product)" class="p-2 border border-beige/30 hover:bg-brand-gold hover:text-white transition-all duration-300 bg-white">
                                <EditIcon :size="14" />
                            </button>
                            <button @click="confirmDelete(product)" class="p-2 border border-beige/30 hover:bg-brand-rose hover:text-white transition-all duration-300 bg-white">
                                <TrashIcon :size="14" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
          </table>
        </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div @click="closeModal" class="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"></div>
        <div class="bg-white w-full max-w-2xl relative z-10 shadow-2xl border border-brand-gold/20 overflow-hidden transform animate-fade-in-up">
            <div class="bg-brand-navy px-8 py-6 flex justify-between items-center">
                <h4 class="text-xl font-playfair font-bold text-brand-gold italic">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h4>
                <button @click="closeModal" class="text-white hover:text-brand-rose transition-colors"><XIcon :size="24" /></button>
            </div>
            
            <form @submit.prevent="saveProduct" class="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-4 md:col-span-2">
                        <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400 block">Product Name</label>
                        <input type="text" v-model="form.name" required class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-brand-navy focus:ring-1 ring-brand-gold outline-none" placeholder="Enter product name" />
                    </div>

                    <div class="space-y-4">
                        <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400 block">Select Category</label>
                        <select v-model="form.category_id" required class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-brand-navy focus:ring-1 ring-brand-gold outline-none">
                            <option value="" disabled>Select a category</option>
                            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>
                    </div>

                    <div class="space-y-4">
                        <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400 block">Stock Quantity</label>
                        <input type="number" v-model="form.stock" required min="0" class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-brand-navy focus:ring-1 ring-brand-gold outline-none" />
                    </div>

                    <div class="space-y-4">
                        <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400 block">Regular Price (INR)</label>
                        <input type="number" v-model="form.price" required min="0" step="0.01" class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-brand-navy focus:ring-1 ring-brand-gold outline-none" />
                    </div>

                    <div class="space-y-4">
                        <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400 block">Sale Price (Optional)</label>
                        <input type="number" v-model="form.sale_price" min="0" step="0.01" class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-brand-navy focus:ring-1 ring-brand-gold outline-none" />
                    </div>

                    <div class="space-y-4 md:col-span-2">
                        <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400 block">Product Description</label>
                        <textarea v-model="form.description" rows="4" class="w-full bg-beige-light border-none px-6 py-4 text-xs font-bold text-brand-navy focus:ring-1 ring-brand-gold outline-none resize-none" placeholder="Describe the item..."></textarea>
                    </div>

                    <div class="space-y-4 md:col-span-2">
                      <label class="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400 block">Product Image</label>
                      <div class="flex items-center space-x-6 bg-beige-light p-6 border border-dashed border-beige/50">
                          <div class="w-20 h-24 bg-white border border-beige shadow-sm overflow-hidden flex-shrink-0">
                              <img v-if="previewImage" :src="previewImage" class="w-full h-full object-cover" />
                              <div v-else class="w-full h-full flex items-center justify-center text-beige">
                                  <ImageIcon :size="30" />
                              </div>
                          </div>
                          <div class="flex-grow">
                              <input type="file" @change="handleFileUpload" accept="image/*" class="hidden" ref="fileInput" />
                              <button type="button" @click="$refs.fileInput.click()" class="btn-outline !text-[9px] !px-6 !py-2">Upload Image</button>
                              <p class="text-[8px] text-gray-400 mt-2 italic">Allowed: JPG, PNG. Max: 2MB.</p>
                          </div>
                      </div>
                    </div>

                    <div class="md:col-span-2 flex items-center space-x-8 py-4 border-t border-beige/10 mt-4">
                      <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" v-model="form.is_featured" class="w-4 h-4 text-brand-gold rounded focus:ring-brand-gold" />
                        <span class="text-[9px] uppercase tracking-widest font-bold text-brand-navy">Show on Home Page</span>
                      </label>
                      <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" v-model="form.status" class="w-4 h-4 text-brand-gold rounded focus:ring-brand-gold" />
                        <span class="text-[9px] uppercase tracking-widest font-bold text-brand-navy">Make Public</span>
                      </label>
                    </div>
                </div>

                <div class="flex justify-end space-x-4 pt-10 border-t border-beige/10">
                    <button type="button" @click="closeModal" class="btn-outline !px-10 !py-4 font-bold tracking-widest text-[9px]">Cancel</button>
                    <button type="submit" :disabled="saving" class="btn-gold !px-16 !py-4 font-bold tracking-widest text-[9px] flex items-center space-x-2">
                        <LoaderIcon v-if="saving" class="animate-spin" :size="14" />
                        <span>{{ isEditing ? 'Update Product' : 'Save Product' }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div @click="showDeleteModal = false" class="absolute inset-0 bg-brand-navy/60 backdrop-blur-md"></div>
        <div class="bg-white max-w-md w-full relative z-10 p-10 text-center shadow-2xl border border-brand-rose/20 transform animate-fade-in">
            <div class="w-16 h-16 bg-brand-rose/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertTriangleIcon class="text-brand-rose" :size="32" />
            </div>
            <h4 class="text-2xl font-playfair font-bold text-brand-navy mb-4">Delete Product?</h4>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mb-10 leading-relaxed">Are you sure you want to remove this item? This action will also delete the saved image file.</p>
            <div class="flex space-x-4">
                <button @click="showDeleteModal = false" class="flex-grow btn-outline !py-4 !text-[9px] font-bold tracking-[0.2em]">No, Keep It</button>
                <button @click="performDelete" :disabled="deleting" class="flex-grow bg-brand-rose text-white py-4 text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl">
                  {{ deleting ? 'Deleting...' : 'Yes, Delete' }}
                </button>
            </div>
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
  Download as DownloadIcon,
  X as XIcon,
  Loader as LoaderIcon,
  Image as ImageIcon,
  AlertTriangle as AlertTriangleIcon
} from 'lucide-vue-next'

const API_BASE = 'http://localhost:8000/api/admin'

const products = ref([])
const categories = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const exporting = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const currentProductId = ref(null)
const productToDelete = ref(null)
const notification = ref(null)
const previewImage = ref(null)
const selectedFile = ref(null)

const form = reactive({
  name: '',
  category_id: '',
  price: 0,
  sale_price: 0,
  stock: 0,
  description: '',
  images: [],
  is_featured: false,
  status: true
})

onMounted(async () => {
    await fetchCategories()
    await fetchProducts()
})

const fetchProducts = async () => {
    loading.value = true
    try {
        const response = await axios.get(`${API_BASE}/products`)
        products.value = response.data
    } catch (error) {
        showNotification('Could not load products', 'error')
    } finally {
        loading.value = false
    }
}

const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE}/categories`)
        categories.value = response.data
    } catch (error) {
        console.error('Category load failed')
    }
}

const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedFile.value = file
        previewImage.value = URL.createObjectURL(file)
    }
}

const openAddModal = () => {
    isEditing.value = false
    resetForm()
    showModal.value = true
}

const editProduct = (product) => {
    isEditing.value = true
    currentProductId.value = product.id
    Object.assign(form, {
        name: product.name,
        category_id: product.category_id,
        price: product.price,
        sale_price: product.sale_price,
        stock: product.stock,
        description: product.description,
        images: product.images || [],
        is_featured: Boolean(product.is_featured),
        status: Boolean(product.status)
    })
    previewImage.value = getImage(product)
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    resetForm()
}

const resetForm = () => {
    form.name = ''
    form.category_id = ''
    form.price = 0
    form.sale_price = 0
    form.stock = 0
    form.description = ''
    form.images = []
    form.is_featured = false
    form.status = true
    previewImage.value = null
    selectedFile.value = null
    currentProductId.value = null
}

const saveProduct = async () => {
    saving.value = true
    
    // Use FormData for file upload
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('category_id', form.category_id)
    formData.append('price', form.price)
    formData.append('sale_price', form.sale_price || 0)
    formData.append('stock', form.stock)
    formData.append('description', form.description || '')
    formData.append('is_featured', form.is_featured ? 1 : 0)
    formData.append('status', form.status ? 1 : 0)
    
    if (selectedFile.value) {
        formData.append('image_file', selectedFile.value)
    }

    try {
        if (isEditing.value) {
            // Laravel requires _method=PUT for multipart/form-data PUT requests
            formData.append('_method', 'PUT')
            await axios.post(`${API_BASE}/products/${currentProductId.value}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            showNotification('Product updated successfully', 'success')
        } else {
            await axios.post(`${API_BASE}/products`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            showNotification('New product added to catalog', 'success')
        }
        await fetchProducts()
        closeModal()
    } catch (error) {
        showNotification('Failed to save product details', 'error')
    } finally {
        saving.value = false
    }
}

const confirmDelete = (product) => {
    productToDelete.value = product
    showDeleteModal.value = true
}

const performDelete = async () => {
    if (!productToDelete.value) return
    deleting.value = true
    try {
        await axios.delete(`${API_BASE}/products/${productToDelete.value.id}`)
        showNotification('Product and assets deleted', 'success')
        await fetchProducts()
        showDeleteModal.value = false
    } catch (error) {
        showNotification('Delete failed', 'error')
    } finally {
        deleting.value = false
        productToDelete.value = null
    }
}

const exportItems = () => {
    exporting.value = true
    try {
        window.location.href = `${API_BASE}/products/export`
        setTimeout(() => { exporting.value = false }, 3000)
    } catch (error) {
        showNotification('Export failed', 'error')
        exporting.value = false
    }
}

const showNotification = (message, type = 'success') => {
    notification.value = { message, type }
    setTimeout(() => { notification.value = null }, 5000)
}

const formatPrice = (price) => parseFloat(price).toLocaleString('en-IN')
const getImage = (product) => (product.images && product.images.length > 0) ? product.images[0] : '/assets/logo.png'
</script>

<style scoped>
@keyframes fade-in-up {
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
</style>
