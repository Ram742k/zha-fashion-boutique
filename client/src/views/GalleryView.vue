<template>
  <div class="py-12 bg-white min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 px-4">
        <h1 class="text-5xl font-playfair font-bold text-luxury-dark mb-6 tracking-widest uppercase">The <span class="italic text-gold font-normal">Lookbook</span></h1>
        <p class="text-xs uppercase tracking-[0.4em] text-gray-400 font-bold mb-12">A curated collection of our finest handcrafted works</p>
        <div class="w-24 h-px bg-gold mx-auto"></div>
      </div>

      <!-- Masonry-like Grid -->
      <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        <div v-for="item in galleryItems" :key="item.id" class="break-inside-avoid relative group overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 bg-beige-light">
          <img :src="item.image" :alt="item.title" class="w-full h-auto object-cover transition-transform duration-[4s] group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-luxury-dark/90 via-luxury-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
             <span class="text-gold text-[9px] uppercase tracking-widest font-bold mb-2">{{ item.tag }}</span>
             <h3 class="text-xl font-playfair text-white mb-4 italic">{{ item.title }}</h3>
             <button class="bg-white/10 backdrop-blur-md text-white border border-white/30 px-6 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-luxury-dark transition-colors w-fit">View Craftsmanship</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const galleryItems = [
    { id: 1, image: 'https://images.unsplash.com/photo-1594465919760-442ef5469af5?w=800', title: 'The Royal Velvet Set', tag: 'Handmade' },
    { id: 2, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', title: 'Golden Threads', tag: 'Embroidery' },
    { id: 3, image: 'https://images.unsplash.com/photo-1610030467222-38d0696eb8038c?w=1000', title: 'Ivory Chiffon Whisper', tag: 'Boutique' },
    { id: 4, image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800', title: 'Peacock Motifs', tag: 'Aari Work' },
    { id: 5, image: 'https://images.unsplash.com/photo-1598507045484-9ca950dc9670?w=600', title: 'Zha Classics', tag: 'Premium' },
    { id: 6, image: 'https://images.unsplash.com/photo-1594465919760-442ef5469af5?w=900', title: 'Summer Breeze Kurti', tag: 'Couture' },
    { id: 7, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=700', title: 'Regal Zari Work', tag: 'Luxury' },
    { id: 8, image: 'https://images.unsplash.com/photo-1610030467222-38d0696eb8038c?w=900', title: 'Bridal Dream', tag: 'Signature' },
]
</script>
