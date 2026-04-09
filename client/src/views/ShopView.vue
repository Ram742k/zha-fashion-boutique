<template>
  <div class="py-12 bg-white min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb / Header -->
      <div class="mb-12">
        <nav class="flex space-x-2 text-xs uppercase tracking-widest text-gray-400 mb-4">
          <router-link to="/">Home</router-link>
          <span>/</span>
          <span class="text-luxury-dark">Shop Collection</span>
        </nav>
        <h1 class="text-4xl font-playfair font-bold text-luxury-dark tracking-wider uppercase">Our Collection</h1>
      </div>

      <!-- Filters & Sorting -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-y border-beige mb-12">
        <div class="flex flex-wrap gap-4 mb-4 md:mb-0">
          <button v-for="cat in categories" :key="cat" @click="activeCat = cat" :class="activeCat === cat ? 'bg-gold text-white' : 'border border-gray-200 text-gray-500 hover:border-gold'" class="px-6 py-2 text-[10px] uppercase tracking-[0.2em] transition-all">
            {{ cat }}
          </button>
        </div>
        <div class="flex items-center space-x-6 text-sm text-luxury-dark">
          <div class="flex items-center space-x-2 cursor-pointer group">
            <span class="font-medium">Sort By:</span>
            <select class="bg-transparent border-none outline-none font-bold uppercase tracking-widest text-[10px] pointer-events-auto">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
          <p class="text-xs text-gray-400 border-l border-gray-200 pl-6 uppercase tracking-widest">Showing {{ filteredProducts.length }} products</p>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
        <div v-for="product in filteredProducts" :key="product.id" class="group animate-fade-in relative">
          <!-- Wishlist button -->
          <button class="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full text-gold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm">
            <HeartIcon :size="16" />
          </button>

          <router-link :to="'/product/' + product.slug" class="block">
            <div class="aspect-[4/5] bg-beige-light overflow-hidden relative mb-6">
              <img :src="product.image" :alt="product.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <!-- Hover effect buttons -->
              <div class="absolute bottom-0 left-0 right-0 p-4 bg-white/20 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button class="w-full bg-luxury-dark text-white py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors">Add to Bag</button>
              </div>
            </div>
            <div>
              <span class="text-[9px] uppercase tracking-widest text-gold mb-2 block font-bold">{{ product.category }}</span>
              <h3 class="text-md font-playfair font-medium text-luxury-dark mb-1 h-12 overflow-hidden">{{ product.name }}</h3>
              <div class="flex items-center space-x-3">
                 <span v-if="product.sale_price" class="text-xs line-through text-gray-400">₹{{ product.price.toLocaleString() }}</span>
                 <span class="text-sm font-bold text-luxury-dark">₹{{ (product.sale_price || product.price).toLocaleString() }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div v-if="filteredProducts.length === 0" class="py-40 text-center flex flex-col items-center">
        <ShoppingBagIcon :size="48" class="text-beige-dark mb-6" />
        <h3 class="text-2xl font-playfair text-gray-400">No products found matching your filter.</h3>
        <button @click="activeCat = 'All Collection'" class="mt-8 text-gold uppercase tracking-widest text-xs border-b border-gold-light pb-1">Reset Filters</button>
      </div>

      <!-- Pagination -->
      <div class="mt-24 pt-10 border-t border-beige flex justify-center space-x-4">
        <button v-for="p in 3" :key="p" class="w-10 h-10 border border-gray-200 text-sm flex items-center justify-center hover:bg-gold hover:text-white transition-all" :class="p === 1 ? 'bg-gold text-white border-gold' : ''">{{ p }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Heart as HeartIcon, ShoppingBag as ShoppingBagIcon } from 'lucide-vue-next'

const categories = ref(['All Collection'])
const activeCat = ref('All Collection')
const products = ref([])

onMounted(async () => {
    try {
        const catRes = await axios.get('https://zha-fashion-boutique.onrender.com/api/categories')
        categories.value = ['All Collection', ...catRes.data.map(c => c.name)]
        
        const prodRes = await axios.get('https://zha-fashion-boutique.onrender.com/api/products')
        products.value = prodRes.data.map(p => ({
            id: p._id,
            name: p.name,
            slug: p.slug,
            category: p.category_id?.name || 'Uncategorized',
            price: p.price,
            sale_price: p.sale_price,
            image: p.images?.[0] || '/assets/placeholder.png'
        }))
    } catch (error) {
        console.error('Failed to fetch shop data', error)
    }
})

const filteredProducts = computed(() => {
    if (activeCat.value === 'All Collection') return products.value
    return products.value.filter(p => p.category === activeCat.value)
})
</script>
