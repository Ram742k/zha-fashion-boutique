<template>
  <div class="py-24 bg-white min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h1 class="text-6xl font-playfair font-bold text-luxury-dark mb-6 tracking-widest uppercase italic">Zha Fashion</h1>
        <p class="text-xs uppercase tracking-[0.4em] text-gray-400 font-bold mb-12">Crafting Elegance Since 2026</p>
        <div class="w-1/3 h-px bg-gold mx-auto"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
         <div class="aspect-square bg-beige-light group overflow-hidden shadow-2xl relative order-2 md:order-1">
            <img src="/assets/hero.png" alt="Boutique Studio" class="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
            <div class="absolute inset-0 bg-gold/5 pointer-events-none group-hover:bg-transparent transition-colors"></div>
         </div>
         <div class="space-y-8 order-1 md:order-2">
            <h2 class="text-4xl font-playfair font-bold text-luxury-dark mb-6 leading-tight">Defining The New <span class="italic text-gold font-normal">Standard</span> In Craftsmanship</h2>
            <p class="text-gray-500 font-light leading-loose text-lg font-playfair">Zha Fashion was born from a desire to blend traditional Indian craftsmanship with modern, high-end aesthetics. We believe that every woman deserves a fit that feels like a second skin and a design that tells her personal story.</p>
            <p class="text-gray-500 font-light leading-loose text-lg font-playfair italic underline decoration-gold-light underline-offset-8">"Our boutique isn't just about selling clothes; it's about the heritage of thread and needle."</p>
            <div class="pt-8 space-y-6">
               <div class="flex items-center space-x-6 text-[10px] uppercase font-bold tracking-[0.2em] text-luxury-dark">
                  <div class="w-12 h-12 bg-beige-light flex items-center justify-center rounded-full"><CheckIcon :size="16" class="text-gold" /></div>
                  <p>Hand-Sourced Premium Silks</p>
               </div>
               <div class="flex items-center space-x-6 text-[10px] uppercase font-bold tracking-[0.2em] text-luxury-dark">
                  <div class="w-12 h-12 bg-beige-light flex items-center justify-center rounded-full"><CheckIcon :size="16" class="text-gold" /></div>
                  <p>Expert Master Designers (Aari & Zardosi)</p>
               </div>
               <div class="flex items-center space-x-6 text-[10px] uppercase font-bold tracking-[0.2em] text-luxury-dark">
                  <div class="w-12 h-12 bg-beige-light flex items-center justify-center rounded-full"><CheckIcon :size="16" class="text-gold" /></div>
                  <p>Global Boutique Delivery</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check as CheckIcon } from 'lucide-vue-next'
</script>
