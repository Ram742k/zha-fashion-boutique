<template>
  <div class="space-y-8">
    <div class="bg-white p-8 border border-beige/30 flex justify-between items-center">
        <div>
            <h3 class="text-3xl font-playfair font-bold text-brand-navy">Growth Engine</h3>
            <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-2">Managing discounts and promotional coupons</p>
        </div>
        <button class="btn-gold !text-[9px] !px-10 flex items-center space-x-2">
            <PlusIcon :size="14" />
            <span>New Campaign</span>
        </button>
    </div>

    <!-- Active Coupons -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="coupon in coupons" :key="coupon.id" class="p-8 border-2 border-dashed border-beige transition-all hover:border-brand-gold bg-white relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-12 h-12 bg-brand-gold/10 -mr-6 -mt-6 rounded-full group-hover:bg-brand-gold transition-colors"></div>
            
            <div class="mb-8">
                <span class="text-[9px] font-bold text-brand-rose uppercase tracking-widest">{{ coupon.type }}</span>
                <h4 class="text-2xl font-playfair font-bold text-brand-navy mt-2">{{ coupon.code }}</h4>
            </div>

            <div class="space-y-4">
                <div class="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                    <span class="text-gray-400">Discount</span>
                    <span class="text-brand-navy">{{ coupon.discount }}</span>
                </div>
                <div class="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                    <span class="text-gray-400">Status</span>
                    <span :class="coupon.isActive ? 'text-green-500' : 'text-gray-300'">{{ coupon.isActive ? 'Live' : 'Expired' }}</span>
                </div>
                <div class="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                    <span class="text-gray-400">Expiry</span>
                    <span class="text-brand-purple italic">{{ coupon.expiry }}</span>
                </div>
            </div>

            <div class="mt-8 pt-6 border-t border-beige/10 flex justify-between">
                <button class="text-[9px] font-bold uppercase tracking-widest text-brand-gold hover:text-brand-navy transition-colors">Edit</button>
                <button class="text-[9px] font-bold uppercase tracking-widest text-brand-rose hover:text-black transition-colors">Delete</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { Plus as PlusIcon } from 'lucide-vue-next'

const coupons = [
    { id: 1, code: 'ZHA-FSTV-20', type: 'Seasonal', discount: '20%', expiry: '20 APR 2026', isActive: true },
    { id: 2, code: 'WELCOME-500', type: 'Welcome', discount: '₹500 OFF', expiry: '31 DEC 2026', isActive: true },
    { id: 3, code: 'EMB-PRO-10', type: 'Service', discount: '10% OFF', expiry: '05 APR 2026', isActive: false },
    { id: 4, code: 'B2B-BULK-25', type: 'Enterprise', discount: '25% OFF', expiry: '15 MAY 2026', isActive: true }
]
</script>
