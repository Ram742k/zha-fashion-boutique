<template>
  <div class="space-y-8">
    <div class="bg-white p-8 border border-beige/30">
        <h3 class="text-3xl font-playfair font-bold text-brand-navy">Feature Management</h3>
        <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-2">Enabling enterprise communication tools (Email, WA, SMS)</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Feature Status -->
        <div class="bg-white border border-beige/30 p-8">
            <h4 class="text-xl font-playfair font-bold text-brand-navy mb-8">System Communications</h4>
            <div class="space-y-6">
                <div v-for="feature in features" :key="feature.name" class="flex items-center justify-between p-6 bg-beige-light/30 border border-beige/20 group hover:border-brand-gold transition-all">
                    <div class="flex items-center space-x-6">
                        <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-gold shadow-sm group-hover:scale-110 transition-transform">
                            <component :is="feature.icon" :size="24" />
                        </div>
                        <div>
                            <p class="text-xs font-bold text-brand-navy uppercase tracking-widest">{{ feature.name }} Notifications</p>
                            <p class="text-[9px] text-gray-400 font-bold tracking-tighter">{{ feature.desc }}</p>
                        </div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="feature.enabled" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
                    </label>
                </div>
            </div>
            <button class="w-full mt-10 btn-gold !py-4 uppercase tracking-[0.3em] text-xs">Save Master Config</button>
        </div>

        <!-- Subscription Overview -->
        <div class="bg-brand-navy p-8 text-white relative">
            <h4 class="text-xl font-playfair font-bold mb-10">Client Subscriptions</h4>
            <div class="space-y-4">
                <div v-for="sub in subscriptions" :key="sub.id" class="p-6 border border-white/5 bg-white/5 group hover:bg-white/10 transition-all">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-navy text-[10px] font-bold">{{ sub.userInitial }}</div>
                            <span class="text-xs font-bold tracking-widest uppercase">{{ sub.userName }}</span>
                        </div>
                        <span class="text-[8px] px-2 py-1 bg-brand-gold/20 text-brand-gold font-bold uppercase tracking-tighter">{{ sub.plan }}</span>
                    </div>
                    <div class="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                        <span class="text-white/40">Expires</span>
                        <span class="text-brand-pink">{{ sub.expiry }}</span>
                    </div>
                    <div class="mt-4 pt-4 border-t border-white/5 flex space-x-2">
                        <div v-for="feat in sub.allowed" :key="feat" class="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-brand-gold">
                            <DotIcon :size="12" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Mail as EmailIcon, 
  MessageSquare as WAIcon, 
  Smartphone as SMSIcon,
  Dot as DotIcon
} from 'lucide-vue-next'

const features = ref([
    { name: 'Email', icon: EmailIcon, desc: 'Transactional & Marketing emails', enabled: true },
    { name: 'WhatsApp', icon: WAIcon, desc: 'Real-time order updates via WA Business API', enabled: true },
    { name: 'SMS', icon: SMSIcon, desc: 'OTP and urgent delivery alerts', enabled: false }
])

const subscriptions = [
    { id: 1, userName: 'Ishani Roy', userInitial: 'IR', plan: 'Enterprise', expiry: '24 DEC 2026', allowed: ['email', 'wa', 'sms'] },
    { id: 2, userName: 'Zoya Khan', userInitial: 'ZK', plan: 'Boutique', expiry: '10 SEP 2026', allowed: ['email', 'wa'] },
    { id: 3, userName: 'Neha Verma', userInitial: 'NV', plan: 'Boutique', expiry: '15 NOV 2026', allowed: ['email', 'wa'] }
]
</script>
