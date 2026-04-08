<template>
  <div class="py-24 bg-white min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h1 class="text-6xl font-playfair font-bold text-luxury-dark mb-6 tracking-widest uppercase italic">Contact Us</h1>
        <p class="text-xs uppercase tracking-[0.4em] text-gray-400 font-bold mb-12">Connect With Our Design Studio</p>
        <div class="w-1/3 h-px bg-gold mx-auto"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
         <div class="space-y-12">
            <h2 class="text-4xl font-playfair font-bold text-luxury-dark mb-6 leading-tight">We Love Talking <span class="italic text-gold font-normal">Fashion</span>.</h2>
            <p class="text-gray-500 font-light leading-loose text-lg font-playfair">Whether you have a question about an existing order or want to discuss a new custom stitching project, our team of dedicated fashion consultants is here to assist you.</p>

            <div class="space-y-10 pt-10">
               <div class="flex items-center space-x-6 text-[11px] uppercase font-bold tracking-[0.2em] text-luxury-dark border-l-2 border-gold pl-8">
                  <div class="bg-beige-light p-3 rounded-full text-gold"><PhoneIcon :size="20" /></div>
                  <p>Customer Support: +91 91234 56789</p>
               </div>
               <div class="flex items-center space-x-6 text-[11px] uppercase font-bold tracking-[0.2em] text-luxury-dark border-l-2 border-gold pl-8">
                  <div class="bg-beige-light p-3 rounded-full text-gold"><MailIcon :size="20" /></div>
                  <p>Inquiries: hello@zhafashion.com</p>
               </div>
               <div class="flex items-center space-x-6 text-[11px] uppercase font-bold tracking-[0.2em] text-luxury-dark border-l-2 border-gold pl-8">
                  <div class="bg-beige-light p-3 rounded-full text-gold"><MapIcon :size="20" /></div>
                  <p>Boutique Address: No.12, Luxury Street, Nungambakkam, Chennai 600034</p>
               </div>
            </div>
         </div>

         <div class="bg-beige-light/30 p-12 border border-beige shadow-xl animate-slide-up h-fit relative overflow-hidden">
            <div class="absolute -top-10 -right-10 w-24 h-24 bg-gold/10 rounded-full blur-3xl"></div>
            <h3 class="text-2xl font-playfair font-bold text-luxury-dark mb-10 border-b border-beige pb-6">Send An Inquiry</h3>
            
            <form class="grid grid-cols-1 md:grid-cols-2 gap-10 font-inter uppercase tracking-widest text-[9px] font-bold text-gray-400">
               <div class="space-y-4">
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" class="input-field bg-white border-beige" />
               </div>
               <div class="space-y-4">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" class="input-field bg-white border-beige" />
               </div>
               <div class="space-y-4 md:col-span-2">
                  <label>Reason For Contacting</label>
                  <select class="input-field bg-white border-beige">
                     <option>New Custom Order</option>
                     <option>Existing Order Inquiries</option>
                     <option>Collaborations / Business</option>
                     <option>Other / Feedbacks</option>
                  </select>
               </div>
               <div class="space-y-4 md:col-span-2">
                  <label>Your Message / Requirements</label>
                  <textarea rows="6" placeholder="Tell us what you're looking for..." class="input-field bg-white border-beige resize-none"></textarea>
               </div>
               <div class="md:col-span-2 pt-8">
                  <button class="btn-gold !w-full !px-12 !py-6 !bg-luxury-dark hover:!bg-black transition-colors font-bold tracking-[0.4em] uppercase text-xs">Send Your Thoughts</button>
               </div>
            </form>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Phone as PhoneIcon, 
  Mail as MailIcon, 
  MapPin as MapIcon 
} from 'lucide-vue-next'
</script>
