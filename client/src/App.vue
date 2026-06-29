<template>
  <div class="min-h-screen flex flex-col bg-beige-light">
    <!-- Navigation -->
    <nav v-if="!isAdmin" class="glass sticky top-0 z-50 border-b border-beige/30 transition-all duration-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20 items-center">
          <div class="flex-shrink-0 flex items-center space-x-2 md:space-x-3">
            <img src="/assets/logo.png" class="w-10 h-10 md:w-12 md:h-12 object-contain hover:rotate-[360deg] transition-transform duration-1000" alt="ZHA Fashion Logo" />
            <router-link to="/" class="flex flex-col group">
              <span class="text-base md:text-xl font-playfair font-bold tracking-widest text-brand-gold leading-tight group-hover:text-brand-purple transition-colors duration-500">ZHA FASHION</span>
              <span class="text-[8px] md:text-[9px] font-inter font-bold tracking-[0.3em] text-brand-purple group-hover:text-brand-rose transition-colors duration-500">STUDIO</span>
            </router-link>
          </div>
          
          <!-- Desktop Menu -->
          <div class="hidden md:flex space-x-8 items-center uppercase tracking-[0.2em] text-[10px] font-bold">
            <router-link to="/" class="hover:text-brand-gold transition-colors relative group">
              Home
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover:w-full"></span>
            </router-link>
            <router-link to="/shop" class="hover:text-brand-gold transition-colors relative group">
              Shop
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover:w-full"></span>
            </router-link>
            <router-link to="/custom-stitching" class="hover:text-brand-gold transition-colors relative group text-brand-purple">
              Custom Stitching
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-purple transition-all group-hover:w-full"></span>
            </router-link>
            <router-link to="/embroidery" class="hover:text-brand-gold transition-colors relative group">
              Embroidery
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover:w-full"></span>
            </router-link>
            <router-link to="/gallery" class="hover:text-brand-gold transition-colors relative group">
              Gallery
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover:w-full"></span>
            </router-link>
          </div>

          <div class="flex items-center space-x-2.5 md:space-x-6">
            <!-- Mobile Hamburger Trigger -->
            <button @click="showMobileMenu = !showMobileMenu" class="md:hidden text-brand-navy hover:text-brand-gold transition-colors" aria-label="Toggle Menu">
              <MenuIcon :size="18" stroke-width="2.5" />
            </button>
            <button @click="showSearch = !showSearch" class="text-brand-navy hover:text-brand-gold transition-colors">
              <SearchIcon :size="18" stroke-width="2.5" />
            </button>
            <router-link to="/cart" class="relative group text-brand-navy hover:text-brand-gold transition-colors">
              <ShoppingBagIcon :size="18" stroke-width="2.5" />
              <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-brand-gold text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full animate-bounce">{{ cartCount }}</span>
            </router-link>
            <router-link to="/dashboard" class="text-brand-navy hover:text-brand-gold transition-colors">
              <UserIcon :size="18" stroke-width="2.5" />
            </router-link>
            <router-link to="/admin" class="w-8 h-8 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-white transition-all">
              <span class="text-[8px] font-bold">ADM</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Mobile Navigation Drawer -->
    <div v-show="showMobileMenu" class="fixed inset-0 z-50 md:hidden bg-brand-navy/60 backdrop-blur-sm" @click="showMobileMenu = false">
      <div class="w-64 bg-white h-full p-8 flex flex-col justify-between shadow-2xl relative" @click.stop>
        <div>
          <div class="flex justify-between items-center mb-12 border-b border-beige pb-4">
             <span class="font-playfair font-bold text-brand-gold tracking-widest text-base">ZHA STUDIO</span>
             <button @click="showMobileMenu = false" class="text-brand-navy hover:text-brand-gold">
                <XIcon :size="20" />
             </button>
          </div>
          <nav class="flex flex-col space-y-6 text-xs uppercase tracking-widest font-bold text-brand-navy">
            <router-link to="/" @click="showMobileMenu = false" class="hover:text-brand-gold transition-colors py-2">Home</router-link>
            <router-link to="/shop" @click="showMobileMenu = false" class="hover:text-brand-gold transition-colors py-2">Shop</router-link>
            <router-link to="/custom-stitching" @click="showMobileMenu = false" class="hover:text-brand-purple transition-colors py-2 text-brand-purple">Custom Stitching</router-link>
            <router-link to="/embroidery" @click="showMobileMenu = false" class="hover:text-brand-gold transition-colors py-2">Embroidery</router-link>
            <router-link to="/gallery" @click="showMobileMenu = false" class="hover:text-brand-gold transition-colors py-2">Gallery</router-link>
          </nav>
        </div>
        <div class="border-t border-beige pt-6 text-[9px] uppercase tracking-widest text-gray-400 font-bold">
          &copy; 2026 Zha Studio
        </div>
      </div>
    </div>
    
    <!-- Search Overlay -->
    <div v-show="showSearch" class="bg-brand-navy text-white py-6 border-b border-brand-gold/20 animate-fade-in relative z-40">
      <div class="max-w-3xl mx-auto px-4 flex items-center space-x-4">
        <SearchIcon :size="20" class="text-brand-gold" />
        <input 
          v-model="searchQuery" 
          @keyup.enter="handleSearchSubmit" 
          type="text" 
          placeholder="Search for sarees, lehengas, custom fabrics..." 
          class="bg-transparent border-none outline-none text-white text-base w-full placeholder:text-white/30 font-inter py-2"
        />
        <button @click="showSearch = false" class="text-xs uppercase tracking-widest text-brand-rose hover:text-white transition-colors">Close</button>
      </div>
    </div>

    <!-- Content -->
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade-page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer v-if="!isAdmin" class="bg-brand-navy text-beige-light pt-24 pb-12 mt-24 relative overflow-hidden">
      <!-- ... (rest of footer) ... -->
      <div class="absolute top-0 left-0 w-full h-1 bg-brand-gradient"></div>
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-16 mb-12">
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center space-x-3 mb-8">
            <div class="w-10 h-10 bg-brand-rose rounded-full flex items-center justify-center text-white font-playfair font-bold text-sm shadow-lg">Z</div>
            <h2 class="text-xl font-playfair font-bold text-brand-gold tracking-widest uppercase">Zha Studio</h2>
          </div>
          <p class="text-xs text-brand-pink/80 leading-relaxed max-w-xs font-medium uppercase tracking-wider">STYLISH CLOTHES, STYLISH LIFE. <br/><span class="text-[10px] lowercase normal-case opacity-60 font-light">Elevating your daily wear with professional couture and artistic design.</span></p>
        </div>
        <div>
          <h3 class="font-playfair text-lg text-brand-gold mb-8 italic">Quick Links</h3>
          <ul class="space-y-4 text-xs uppercase tracking-widest">
            <li><router-link to="/about" class="hover:text-brand-rose transition-colors">About Us</router-link></li>
            <li><router-link to="/contact" class="hover:text-brand-rose transition-colors">Contact Us</router-link></li>
            <li><router-link to="/shipping" class="hover:text-brand-rose transition-colors">Shipping Policy</router-link></li>
            <li><router-link to="/terms" class="hover:text-brand-rose transition-colors">Terms & Conditions</router-link></li>
          </ul>
        </div>
        <div>
          <h3 class="font-playfair text-lg text-brand-gold mb-8 italic">Categories</h3>
          <ul class="space-y-4 text-xs uppercase tracking-widest">
            <li><router-link to="/shop?cat=lehengas" class="hover:text-brand-rose transition-colors">Lehengas</router-link></li>
            <li><router-link to="/shop?cat=sarees" class="hover:text-brand-rose transition-colors">Designer Sarees</router-link></li>
            <li><router-link to="/shop?cat=kurti" class="hover:text-brand-rose transition-colors">Kurti Sets</router-link></li>
            <li><router-link to="/shop?cat=embroidery" class="hover:text-brand-rose transition-colors text-brand-rose">Custom Embroidery</router-link></li>
          </ul>
        </div>
        <div>
          <h3 class="font-playfair text-lg text-brand-gold mb-8 italic">Follow Us</h3>
          <div class="flex space-x-6 text-brand-pink">
            <a href="#" class="hover:text-brand-gold transition-all hover:scale-125"><InstagramIcon :size="20" /></a>
            <a href="#" class="hover:text-brand-gold transition-all hover:scale-125"><FacebookIcon :size="20" /></a>
            <a href="#" class="hover:text-brand-gold transition-all hover:scale-125"><TwitterIcon :size="20" /></a>
          </div>
          <div class="mt-10">
            <h4 class="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-4 font-bold">Newsletter</h4>
            <div class="flex group">
              <input type="email" placeholder="Email Address" class="bg-transparent border-b border-white/20 focus:border-brand-gold px-0 py-2 text-xs w-full outline-none transition-all placeholder:text-white/20" />
              <button class="ml-2 text-brand-gold hover:text-white tracking-[0.2em] uppercase text-[10px] font-bold">Join</button>
            </div>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/30 uppercase tracking-[0.3em] font-medium">
        <p>&copy; 2026 Zha Fashion. <span class="text-brand-gold italic lowercase normal-case tracking-normal">Crafted with Elegance.</span></p>
        <div class="mt-6 md:mt-0 flex space-x-8">
          <p class="hover:text-white transition-colors cursor-pointer">Privacy Policy</p>
          <p class="hover:text-white transition-colors cursor-pointer">Security</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from './store'
import { 
  Search as SearchIcon, 
  ShoppingBag as ShoppingBagIcon, 
  User as UserIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Menu as MenuIcon,
  X as XIcon
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const showSearch = ref(false)
const showMobileMenu = ref(false)
const searchQuery = ref('')
const cartCount = computed(() => cartStore.totalItems)

const handleSearchSubmit = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/shop', query: { q: searchQuery.value } })
    showSearch.value = false
    searchQuery.value = ''
  }
}

const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<style>
.fade-page-enter-active,
.fade-page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-page-enter-from,
.fade-page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
