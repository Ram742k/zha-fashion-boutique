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
import { ref, computed } from 'vue'
import { Heart as HeartIcon, ShoppingBag as ShoppingBagIcon } from 'lucide-vue-next'

const categories = ['All Collection', 'Sarees', 'Lehengas', 'Kurti Sets', 'Anarkalis', 'Gowns']
const activeCat = ref('All Collection')

const products = ref([
    { id: 1, name: 'Crimson Silk Saree with Zari Border', slug: 'crimson-saree', category: 'Sarees', price: 18500, sale_price: 15999, image: '/assets/shop1.png' },
    { id: 2, name: 'Hand-Embroidered Velvet Lehenga', slug: 'velvet-lehenga', category: 'Lehengas', price: 45000, image: '/assets/lehengas.png' },
    { id: 3, name: 'Royal Purple Gown', slug: 'blue-anarkali', category: 'Gowns', price: 45000, image: '/assets/shop2.png' },
    { id: 4, name: 'Emerald Green Georgette Gown', slug: 'green-gown', category: 'Gowns', price: 21000, image: '/assets/arrival1.png' },
    { id: 5, name: 'Ivory Chiffon Saree with Pearl Work', slug: 'ivory-saree', category: 'Sarees', price: 25000, image: '/assets/arrival2.png' },
    { id: 6, name: 'Peach Floral Print Kurti Set', slug: 'floral-kurti', category: 'Kurti Sets', price: 8500, sale_price: 6499, image: '/assets/arrival4.png' },
    { id: 7, name: 'Designer Aari Blouse', slug: 'gold-lehenga', category: 'Blouses', price: 8500, image: '/assets/shop3.png' },
    { id: 8, name: 'Organza Saree with Mirror Work', slug: 'organza-saree', category: 'Sarees', price: 19500, image: '/assets/arrival3.png' },
])

const filteredProducts = computed(() => {
    if (activeCat.value === 'All Collection') return products.value
    return products.value.filter(p => p.category === activeCat.value)
})
</script>
