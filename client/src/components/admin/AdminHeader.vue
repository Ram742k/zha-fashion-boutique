<template>
  <header class="h-20 bg-white border-b border-beige/30 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 glass">
    <div class="flex items-center space-x-4">
      <!-- Mobile Menu Toggle -->
      <button @click="$emit('toggle-sidebar')" class="md:hidden p-2 text-brand-navy hover:text-brand-gold transition-colors">
        <MenuIcon :size="24" />
      </button>
      <h2 class="text-sm md:text-xl font-playfair font-bold text-brand-navy">{{ pageTitle }}</h2>
    </div>

    <div class="flex items-center space-x-4 md:space-x-8">
      <!-- Search Bar (Desktop only) -->
      <div class="hidden lg:flex items-center bg-beige-light px-4 py-2 border border-beige/30 min-w-[300px]">
        <SearchIcon :size="16" class="text-gray-400" />
        <input type="text" placeholder="Search orders, products..." class="bg-transparent border-none outline-none text-[10px] uppercase tracking-widest ml-3 w-full" />
      </div>

      <!-- Notifications -->
      <button @click="toggleNotifications" class="relative text-brand-navy p-2 hover:bg-beige/20 transition-all rounded-full">
        <BellIcon :size="18" md:size="20" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-brand-rose rounded-full"></span>
      </button>

      <!-- Profile -->
      <div class="flex items-center space-x-2 md:space-x-3">
        <div class="hidden sm:block text-right">
          <p class="text-[10px] md:text-xs font-bold text-brand-navy">Admin User</p>
          <p class="text-[8px] md:text-[9px] text-brand-gold uppercase tracking-widest font-bold leading-none">Root Access</p>
        </div>
        <div class="w-8 h-8 md:w-10 md:h-10 bg-brand-gold/20 rounded-full flex items-center justify-center border border-brand-gold/30">
          <UserIcon :size="16" md:size="20" class="text-brand-navy" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Search as SearchIcon, 
  Bell as BellIcon, 
  User as UserIcon, 
  Menu as MenuIcon 
} from 'lucide-vue-next'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const route = useRoute()

const toggleNotifications = () => {
  alert('No new notifications for current admin session.')
}

const pageTitle = computed(() => {
  const parts = route.path.split('/')
  const name = parts[parts.length - 1] || 'Dashboard'
  return name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ')
})
</script>
