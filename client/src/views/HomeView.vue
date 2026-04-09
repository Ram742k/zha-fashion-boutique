<template>
  <div class="overflow-hidden bg-beige-light">
    <!-- Hero Section -->
    <section class="h-[95vh] relative flex items-center overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img :src="heroImage" alt="Luxury Boutique" class="w-full h-full object-cover scale-105 animate-slow-zoom" />
        <div class="absolute inset-0 bg-brand-navy/60 mix-blend-multiply"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <div class="max-w-4xl transform animate-slide-up">
          <div class="inline-flex items-center space-x-4 mb-8">
            <span class="w-12 h-[1px] bg-brand-gold"></span>
            <span class="text-brand-rose text-[11px] uppercase tracking-[0.4em] font-bold">Stylish Clothes, Stylish Life</span>
          </div>
          <h1 class="text-7xl md:text-9xl font-playfair font-bold text-white leading-[0.9] mb-10">
            Couture <br /><span class="text-brand-gold italic font-normal text-shimmer">Excellence.</span>
          </h1>
          <p class="text-lg text-white/80 font-light mb-12 max-w-lg leading-relaxed font-inter">
            Elevate your presence with ZHA Fashion Studio's handcrafted masterpieces. Where traditional craftsmanship meets contemporary vision.
          </p>
          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <router-link to="/shop" class="btn-gold text-center min-w-[220px]">Explore Collection</router-link>
            <router-link to="/custom-stitching" class="group flex items-center space-x-4 text-white uppercase tracking-[0.2em] text-xs font-bold hover:text-brand-gold transition-colors">
              <span>Custom Stitching</span>
              <div class="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center group-hover:border-brand-gold group-hover:scale-110 transition-all">
                <ArrowRightIcon :size="16" />
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-50">
        <span class="text-[9px] uppercase tracking-[0.3em] font-bold text-white">Scroll</span>
        <div class="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </section>

    <!-- Brand Philosophy -->
    <section class="py-32 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-20">
        <div class="w-full md:w-1/2 reveal reveal-left">
          <div class="relative group">
            <div class="absolute -top-10 -left-10 w-32 h-32 bg-brand-rose/10 rounded-full blur-3xl group-hover:bg-brand-gold/10 transition-colors duration-1000"></div>
            <img :src="category1" alt="Craftsmanship" class="rounded-sm shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-1000" />
            <div class="absolute -bottom-10 -right-10 bg-brand-navy p-10 text-white z-20 hidden md:block animate-slide-up">
              <p class="text-4xl font-playfair font-bold text-brand-gold mb-2">12+</p>
              <p class="text-[10px] uppercase tracking-widest text-brand-pink">Years of Craft</p>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/2 reveal reveal-right">
          <span class="text-brand-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block font-inter">Our Philosophy</span>
          <h2 class="text-5xl md:text-6xl font-playfair font-bold text-brand-navy mb-8 leading-tight">Artistic <span class="italic text-brand-gold font-normal">Soul,</span> <br/>Modern Silhouette.</h2>
          <p class="text-gray-500 font-light leading-loose mb-10 text-sm">
            At ZHA Fashion Studio, we believe that clothes are more than just garments—they are an extension of your personality. Our designers obsess over every detail, from the choice of fabric to the precision of the final stitch, ensuring that each piece is a unique work of art.
          </p>
          <div class="border-l-2 border-brand-rose pl-8 py-2">
            <p class="italic text-brand-navy font-medium font-playfair text-lg">"We don't just make dresses, we create confidence."</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Overview -->
    <section class="py-32 bg-beige-light border-y border-brand-gold/10">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div v-for="(service, index) in services" :key="index" class="reveal reveal-up hover-stack bg-white p-12 rounded-sm" :style="`transition-delay: ${index * 0.2}s`">
            <div class="w-16 h-16 bg-brand-navy text-brand-gold flex items-center justify-center mb-10 transform transition-transform duration-700 hover:rotate-[360deg]">
              <component :is="service.icon" :size="28" stroke-width="1.5" />
            </div>
            <h3 class="text-xl font-playfair font-bold mb-6 tracking-wider text-brand-navy">{{ service.title }}</h3>
            <p class="text-xs text-gray-500 leading-relaxed font-light uppercase tracking-wider">{{ service.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="py-32 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div class="reveal reveal-left">
            <span class="text-brand-rose uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block font-inter">Collections</span>
            <h2 class="text-5xl md:text-6xl font-playfair font-bold text-brand-navy">The <span class="italic text-brand-gold font-normal">Edit.</span></h2>
          </div>
          <router-link to="/shop" class="reveal reveal-right text-[10px] uppercase font-bold tracking-[0.3em] text-brand-navy group flex items-center space-x-3">
            <span>Discover Full Catalog</span>
            <div class="w-1 h-1 bg-brand-gold rounded-full group-hover:w-8 transition-all duration-500"></div>
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[700px]">
          <div class="lg:col-span-2 relative group overflow-hidden rounded-sm reveal reveal-up">
            <img :src="category1" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/20 to-transparent flex flex-col justify-end p-12 opacity-90">
              <h3 class="text-4xl font-playfair text-white mb-3">Royal Lehengas</h3>
              <p class="text-brand-pink text-[10px] mb-8 uppercase tracking-[0.4em] font-bold">Unparalleled Opulence</p>
              <router-link to="/shop?cat=lehengas" class="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-brand-gold hover:scale-110 transition-all duration-500">
                <ArrowRightIcon :size="20" />
              </router-link>
            </div>
          </div>
          <div class="space-y-6 flex flex-col reveal reveal-up" style="transition-delay: 0.2s">
            <div class="relative group overflow-hidden flex-grow rounded-sm">
              <img :src="category2" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div class="absolute inset-0 bg-brand-purple/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                <span class="text-white font-playfair text-2xl mb-2 italic">Essential</span>
                <span class="text-white/80 text-[10px] uppercase tracking-[0.3em] font-bold">Salwar Sets</span>
              </div>
            </div>
            <div class="relative group overflow-hidden flex-grow rounded-sm">
              <img :src="category3" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div class="absolute inset-0 bg-brand-rose/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                <span class="text-white font-playfair text-2xl mb-2 italic">Modern</span>
                <span class="text-white/80 text-[10px] uppercase tracking-[0.3em] font-bold">Anarkalis</span>
              </div>
            </div>
          </div>
          <div class="relative group overflow-hidden bg-brand-navy flex flex-col justify-center items-center text-center p-12 lg:col-span-1 rounded-sm reveal reveal-up" style="transition-delay: 0.4s">
             <div class="absolute inset-x-0 top-0 h-1 bg-brand-gold"></div>
             <div class="z-10">
               <div class="w-20 h-20 border border-brand-gold/30 rounded-full flex items-center justify-center mx-auto mb-10">
                 <PaletteIcon class="text-brand-gold animate-pulse" :size="32" />
               </div>
               <h3 class="text-2xl font-playfair italic text-white mb-6">Custom <br/> Embroidery</h3>
               <p class="text-brand-pink/50 text-[10px] mb-12 leading-loose uppercase tracking-widest font-bold">Bespoke artistry on luxury threads.</p>
               <router-link to="/embroidery" class="btn-gold !bg-transparent border border-brand-gold/50 !text-[10px] hover:!bg-brand-gold block">Order Artwork</router-link>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Arrivals -->
    <section class="py-32 bg-beige-light overflow-hidden">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-24 reveal reveal-up">
          <span class="text-brand-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block font-inter">New Season</span>
          <h2 class="font-playfair text-5xl md:text-6xl font-bold text-brand-navy italic">Latest Masterpieces</h2>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div v-for="(product, i) in featuredProducts" :key="product._id" class="group reveal reveal-up" :style="`transition-delay: ${i*0.1}s`">
            <router-link :to="'/product/' + product.slug">
              <div class="relative overflow-hidden aspect-[3/4.5] rounded-sm bg-white shadow-xl group-hover:shadow-2xl transition-all duration-700">
                <img :src="product.images?.[0] || '/assets/placeholder.png'" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                
                <!-- Badge -->
                <div class="absolute top-6 left-6 transition-all duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <span class="bg-brand-navy/80 backdrop-blur-md text-brand-gold text-[9px] px-4 py-2 uppercase tracking-tighter font-bold border border-brand-gold/20 italic">Bestseller</span>
                </div>
  
                <!-- Quick Action Box -->
                <div class="absolute inset-x-0 bottom-0 p-6 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <button class="w-full py-4 glass text-[10px] font-bold uppercase tracking-[0.2em] text-brand-navy hover:bg-brand-navy hover:text-white transition-all shadow-xl">
                    Quick View
                  </button>
                </div>
              </div>
              <div class="pt-8 text-center">
                <h4 class="font-playfair text-xl text-brand-navy mb-2 hover:text-brand-gold cursor-pointer transition-colors">{{ product.name }}</h4>
                <p class="text-brand-gold font-bold font-inter text-sm tracking-widest uppercase">₹{{ (product.sale_price || product.price).toLocaleString() }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-40 relative text-center bg-white overflow-hidden">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-rose/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="max-w-4xl mx-auto px-4 relative z-10 reveal reveal-up">
        <span class="text-brand-rose uppercase tracking-[0.4em] text-[10px] font-bold mb-10 block font-inter">Bespoke Experience</span>
        <h2 class="text-6xl md:text-8xl font-playfair font-bold text-brand-navy mb-12 leading-[1.1]">The Perfect <br/><span class="text-brand-gold italic font-normal">Fit</span> for You.</h2>
        <p class="text-gray-400 mb-16 max-w-2xl mx-auto text-sm leading-loose uppercase tracking-widest font-light">"Craftsmanship means no compromise. Every stitch, every bead, every thread is a testament to our dedication to excellence."</p>
        <router-link to="/custom-stitching" class="btn-gold !px-16 !py-5 inline-flex items-center space-x-4">
          <span class="tracking-[0.3em]">Start Custom Order</span>
          <ArrowRightIcon :size="18" />
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  Scissors as ScissorsIcon, 
  Palette as PaletteIcon, 
  Truck as TruckIcon,
  ArrowRight as ArrowRightIcon
} from 'lucide-vue-next'

// Official Brand Assets
const heroImage = '/assets/hero_fashion_studio.png' 
const category1 = '/assets/designer_lehenga.png'
const category2 = '/assets/lehengas.png' // Fallback
const category3 = '/assets/anarkalis.png' // Fallback

const imagesLoaded = ref(false)

const services = [
  { 
    title: 'Custom Stitching', 
    desc: 'Bespoke fit for your unique silhouette.', 
    icon: ScissorsIcon 
  },
  { 
    title: 'Embroidery Order', 
    desc: 'Intricate patterns that tell a story.', 
    icon: PaletteIcon 
  },
  { 
    title: 'Elite Delivery', 
    desc: 'White-glove service to your doorstep.', 
    icon: TruckIcon 
  }
]

const featuredProducts = ref([])
const loading = ref(true)

onMounted(async () => {
    try {
        const response = await axios.get('https://zha-fashion-boutique.onrender.com/api/products')
        // Take first 4 as arrivals for now
        featuredProducts.value = response.data.slice(0, 4)
    } catch (error) {
        console.error('Failed to load arrivals')
    } finally {
        loading.value = false
    }

    // Reveal animations on scroll
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
      }
    })
  }, observerOptions)

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})
</script>

<style scoped>
.animate-slow-zoom {
  animation: zoom 25s infinite alternate ease-in-out;
}

@keyframes zoom {
  from { transform: scale(1); }
  to { transform: scale(1.15); }
}

.bg-embroidery-pattern {
  background-image: radial-gradient(#B87333 0.5px, transparent 0.5px);
  background-size: 15px 15px;
}
</style>

