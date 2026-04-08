<template>
  <aside class="bg-brand-navy min-h-screen text-white flex flex-col shadow-2xl">
    <div class="p-6 border-b border-white/5 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center text-brand-navy font-bold shadow-lg">Z</div>
        <span class="font-playfair font-bold tracking-widest text-lg">ZHA ADMIN</span>
      </div>
      <button @click="$emit('close')" class="md:hidden text-white/50 hover:text-white transition-colors">
        <XIcon :size="20" />
      </button>
    </div>

    <nav class="flex-grow py-6 overflow-y-auto custom-scrollbar">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.path">
          <router-link 
            :to="item.path" 
            @click="$emit('close')"
            class="flex items-center px-6 py-4 space-x-4 hover:bg-white/5 transition-all duration-300 group border-l-4 border-transparent"
            active-class="bg-white/10 !border-brand-gold !text-brand-gold font-bold shadow-xl"
          >
            <component :is="item.icon" :size="20" class="group-hover:scale-110 transition-transform" />
            <span class="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="p-6 border-t border-white/5">
      <button class="flex items-center space-x-4 text-white/30 hover:text-brand-rose transition-colors uppercase tracking-[0.2em] text-[10px] font-bold w-full text-left">
        <LogOutIcon :size="16" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { 
  LayoutDashboard as DashboardIcon, 
  ShoppingBag as ProductsIcon, 
  Layers as CategoriesIcon, 
  ShoppingCart as OrdersIcon, 
  Scissors as CustomOrdersIcon, 
  Palette as EmbroideryIcon,
  Users as UsersIcon, 
  CreditCard as SubscriptionIcon, 
  Ticket as CouponsIcon, 
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  X as XIcon
} from 'lucide-vue-next'

defineEmits(['close'])

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: DashboardIcon },
  { name: 'Products', path: '/admin/products', icon: ProductsIcon },
  { name: 'Categories', path: '/admin/categories', icon: CategoriesIcon },
  { name: 'Orders', path: '/admin/orders', icon: OrdersIcon },
  { name: 'Payments', path: '/admin/billing', icon: SubscriptionIcon },
  { name: 'Custom Stitching', path: '/admin/custom-orders', icon: CustomOrdersIcon },
  { name: 'Embroidery', path: '/admin/embroidery', icon: EmbroideryIcon },
  { name: 'Users', path: '/admin/users', icon: UsersIcon },
  { name: 'Settings', path: '/admin/settings', icon: SettingsIcon },
]
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}
</style>
