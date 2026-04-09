<template>
  <div class="py-20 bg-beige-light/30 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-playfair font-bold text-luxury-dark mb-16 tracking-widest uppercase">Shopping Bag</h1>

      <div class="flex flex-col lg:flex-row gap-20">
        <!-- Cart Table -->
        <div class="lg:w-2/3">
          <div class="overflow-x-auto">
            <table class="w-full text-left uppercase tracking-widest text-[9px] font-bold text-gray-400">
              <thead>
                <tr class="border-b border-beige">
                  <th class="pb-10 font-medium">Product</th>
                  <th class="pb-10 font-medium">Quantity</th>
                  <th class="pb-10 font-medium">Price</th>
                  <th class="pb-10 font-medium">Total</th>
                  <th class="pb-10 font-medium"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-beige font-inter tracking-normal normal-case font-medium">
                <tr v-for="item in cartItems" :key="item.id" class="animate-fade-in">
                  <td class="py-10 flex items-center space-x-6">
                    <div class="w-24 h-32 bg-beige-light">
                      <img :src="item.image" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p class="text-sm font-bold text-luxury-dark leading-tight">{{ item.name }}</p>
                      <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Size: {{ item.size }}</p>
                    </div>
                  </td>
                  <td class="py-10">
                    <div class="flex items-center space-x-3 border border-gray-100 p-2 w-fit">
                      <button @click="cartStore.updateQuantity(item.id, item.quantity - 1, item.variant)" class="w-6 h-6 flex items-center justify-center hover:bg-beige">-</button>
                      <span class="w-6 text-center text-xs font-bold">{{ item.quantity }}</span>
                      <button @click="cartStore.updateQuantity(item.id, item.quantity + 1, item.variant)" class="w-6 h-6 flex items-center justify-center hover:bg-beige">+</button>
                    </div>
                  </td>
                  <td class="py-10 text-sm font-bold text-luxury-dark font-inter tracking-tight">₹{{ item.price.toLocaleString() }}</td>
                  <td class="py-10 text-sm font-bold text-luxury-dark font-inter tracking-tight">₹{{ (item.price * item.quantity).toLocaleString() }}</td>
                  <td class="py-10">
                    <button @click="removeItem(item)" class="text-red-400 hover:text-red-600 transition-colors">
                       <TrashIcon :size="16" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="cartItems.length === 0" class="py-40 text-center flex flex-col items-center">
             <ShoppingIcon :size="48" class="text-beige mb-6" />
             <h3 class="text-2xl font-playfair text-gray-400">Your shopping bag is empty.</h3>
             <router-link to="/shop" class="mt-8 text-gold uppercase tracking-widest text-xs border-b border-gold-light pb-1">Start Shopping</router-link>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:w-1/3">
           <div class="bg-white p-12 shadow-sm border border-beige animate-slide-up sticky top-32">
              <h2 class="text-xl font-playfair mb-10 border-b border-beige pb-6">Order Total</h2>

              <div class="space-y-6 mb-12 uppercase tracking-widest text-[9px] font-bold text-gray-500">
                 <div class="flex justify-between">
                    <p>Subtotal</p>
                    <p class="text-luxury-dark font-bold font-inter tracking-normal text-sm">₹{{ total.toLocaleString() }}</p>
                 </div>
                 <div class="flex justify-between">
                    <p>Shipping</p>
                    <p class="text-green-600 font-bold tracking-normal italic uppercase">Complimentary</p>
                 </div>
                 <div class="flex justify-between pt-6 border-t border-beige text-luxury-dark">
                    <h3 class="text-lg font-playfair lowercase first-letter:uppercase tracking-normal font-bold">Estimated Total</h3>
                    <h3 class="text-lg font-bold font-inter tracking-normal">₹{{ total.toLocaleString() }}</h3>
                 </div>
              </div>

              <router-link to="/checkout" class="btn-gold !w-full !py-6 text-sm tracking-[0.3em] font-bold shadow-xl hover:bg-gold-dark block text-center">
                 Secure Checkout
              </router-link>

              <div class="mt-8 pt-8 border-t border-beige">
                 <p class="text-[8px] uppercase tracking-[0.2em] leading-relaxed text-gray-400 text-center">Taxes and Duties will be calculated in checkout where applicable.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../store'
import { 
  Trash2 as TrashIcon,
  ShoppingBag as ShoppingIcon
} from 'lucide-vue-next'

const cartStore = useCartStore()
const cartItems = computed(() => cartStore.items)
const total = computed(() => cartStore.total)

const removeItem = (item) => {
    if (confirm('Remove item from bag?')) {
        cartStore.removeFromCart(item.id, item.variant)
    }
}
</script>
