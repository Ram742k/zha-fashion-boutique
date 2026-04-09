<template>
  <div class="py-12 bg-white min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex space-x-2 text-xs uppercase tracking-widest text-gray-400 mb-12">
        <router-link to="/">Home</router-link>
        <span>/</span>
        <router-link to="/shop">Shop</router-link>
        <span>/</span>
        <span class="text-luxury-dark">{{ product.name }}</span>
      </nav>

      <div class="flex flex-col lg:flex-row gap-20">
        <!-- Image Gallery -->
        <div class="lg:w-1/2 space-y-4">
          <div class="aspect-[4/5] bg-beige-light overflow-hidden shadow-sm">
            <img :src="mainImage" class="w-full h-full object-cover" />
          </div>
          <div class="grid grid-cols-4 gap-4">
            <div v-for="(img, i) in product.images" :key="i" class="aspect-square bg-beige-light cursor-pointer hover:opacity-80 transition-opacity border" :class="mainImage === img ? 'border-gold' : 'border-transparent'" @click="mainImage = img">
              <img :src="img" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="lg:w-1/2">
          <div class="sticky top-32">
            <span class="text-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">{{ product.category }}</span>
            <h1 class="text-4xl font-playfair font-bold text-luxury-dark mb-6 leading-tight">{{ product.name }}</h1>
            
            <div class="flex items-center space-x-4 mb-8">
               <span v-if="product.sale_price" class="text-xl line-through text-gray-400">₹{{ product.price.toLocaleString() }}</span>
               <span class="text-2xl font-bold text-gold-dark font-inter">₹{{ (product.sale_price || product.price).toLocaleString() }}</span>
            </div>

            <p class="text-gray-600 mb-10 leading-relaxed font-light">{{ product.description }}</p>

            <!-- Attributes -->
            <div class="space-y-8 mb-12 py-8 border-y border-beige">
              <div v-if="product.variants.sizes">
                <label class="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4">Select Size</label>
                <div class="flex space-x-4">
                   <button v-for="size in product.variants.sizes" :key="size" @click="selectedSize = size" :class="selectedSize === size ? 'bg-luxury-dark text-white' : 'border border-gray-200 text-gray-500 hover:border-gold'" class="w-12 h-12 text-xs flex items-center justify-center transition-all">
                     {{ size }}
                   </button>
                </div>
              </div>
              <div v-if="product.variants.colors">
                <label class="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4">Select Color</label>
                <div class="flex space-x-4">
                   <button v-for="color in product.variants.colors" :key="color" @click="selectedColor = color" :class="selectedColor === color ? 'ring-2 ring-gold ring-offset-2' : ''" :style="`background-color: ${color.toLowerCase()}`" class="w-8 h-8 rounded-full border border-gray-100 transition-all"></button>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <button @click="addToBag" class="btn-gold !flex-grow !py-5 flex items-center justify-center space-x-3 shadow-xl">
                <BagIcon :size="18" />
                <span>Add to Shopping Bag</span>
              </button>
              <button class="btn-outline !px-6 py-5 hover:bg-beige-light">
                <HeartIcon :size="20" />
              </button>
            </div>

            <div class="mt-12 flex items-center space-x-8 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
               <div class="flex items-center space-x-2"><TruckIcon :size="16" /><p>Free Worldwide Shipping</p></div>
               <div class="flex items-center space-x-2"><RefreshIcon :size="16" /><p>30 Days Returns</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '../store'
import { 
  ShoppingBag as BagIcon, 
  Heart as HeartIcon, 
  Truck as TruckIcon,
  RefreshCcw as RefreshIcon
} from 'lucide-vue-next'

const route = useRoute()
const cartStore = useCartStore()
const product = ref({
    name: 'Loading...',
    description: '',
    price: 0,
    images: [],
    variants: {}
})
const loading = ref(true)
const mainImage = ref('')
const selectedSize = ref('')
const selectedColor = ref('')

onMounted(async () => {
    try {
        const response = await axios.get(`https://zha-fashion-boutique.onrender.com/api/products/${route.params.slug}`)
        product.value = response.data
        mainImage.value = product.value.images[0] || '/assets/placeholder.png'
        if (product.value.variants?.sizes?.length) selectedSize.value = product.value.variants.sizes[0]
        if (product.value.variants?.colors?.length) selectedColor.value = product.value.variants.colors[0]
    } catch (error) {
        console.error('Failed to load product')
    } finally {
        loading.value = false
    }
})

const addToBag = () => {
    cartStore.addToCart({
        id: product.value._id,
        name: product.value.name,
        price: product.value.sale_price || product.value.price,
        image: product.value.images[0] || '/assets/placeholder.png',
        variant: {
            size: selectedSize.value,
            color: selectedColor.value
        }
    })
    alert('Added to your shopping bag!')
}
</script>
