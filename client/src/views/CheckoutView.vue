<template>
  <div class="py-20 bg-beige-light/30 min-h-screen font-inter uppercase tracking-widest text-[10px] font-bold text-gray-500">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-16">
        <!-- Billing Details -->
        <div class="lg:w-2/3 animate-fade-in">
          <div class="bg-white p-12 shadow-sm border border-beige">
            <h2 class="text-3xl font-playfair font-bold text-luxury-dark mb-12 lowercase capitalize tracking-normal">Billing & Shipping</h2>
            
            <form @submit.prevent="processPayment" class="space-y-12">
                <div class="grid grid-cols-2 gap-8">
                   <div class="space-y-3">
                     <label>First Name</label>
                     <input type="text" v-model="addressForm.first_name" class="input-field" placeholder="John" required />
                   </div>
                   <div class="space-y-3">
                     <label>Last Name</label>
                     <input type="text" v-model="addressForm.last_name" class="input-field" placeholder="Doe" required />
                   </div>
                </div>

                <div class="space-y-3">
                   <label>Email Address</label>
                   <input type="email" v-model="addressForm.email" class="input-field" placeholder="john@example.com" required />
                </div>

                <div class="space-y-3">
                   <label>Phone Number</label>
                   <input type="tel" v-model="addressForm.phone" class="input-field" placeholder="+91 9876543210" required />
                </div>

                <div class="space-y-3 pt-6 border-t border-beige mt-12">
                   <label>Complete Address</label>
                   <textarea v-model="addressForm.address" rows="4" class="input-field" placeholder="House no, Street, Landmark..." required></textarea>
                </div>

                <div class="grid grid-cols-3 gap-8">
                   <div class="space-y-3">
                     <label>City / Town</label>
                     <input type="text" v-model="addressForm.city" class="input-field" placeholder="Chennai" required />
                   </div>
                   <div class="space-y-3">
                     <label>State</label>
                     <input type="text" v-model="addressForm.state" class="input-field" placeholder="Tamil Nadu" required />
                   </div>
                   <div class="space-y-3">
                     <label>Pincode</label>
                     <input type="text" v-model="addressForm.pincode" class="input-field" placeholder="600001" required />
                   </div>
                </div>

                <!-- Payment Methods -->
                <div class="pt-12 border-t border-beige">
                   <h3 class="text-lg font-playfair font-bold text-luxury-dark mb-8 lowercase capitalize tracking-normal">Payment Method</h3>
                   <div class="space-y-4">
                      <label class="flex items-center space-x-4 p-6 border border-beige cursor-pointer transition-all hover:bg-beige-light group" :class="paymentMethod === 'razorpay' ? 'bg-beige-light border-gold shadow-sm' : ''">
                         <input type="radio" value="razorpay" v-model="paymentMethod" name="payment" class="accent-gold h-5 w-5" />
                         <div class="flex-grow">
                            <p class="text-sm font-bold text-luxury-dark tracking-normal normal-case">Online Payment (Razorpay)</p>
                            <p class="text-[9px] text-gray-400 mt-1 uppercase tracking-widest leading-relaxed">Pay via Cards, UPI, Netbanking or Wallets securely.</p>
                         </div>
                         <CreditCardIcon class="text-gold" :size="24" />
                      </label>
                      <label class="flex items-center space-x-4 p-6 border border-beige cursor-pointer transition-all hover:bg-beige-light group" :class="paymentMethod === 'cod' ? 'bg-beige-light border-gold shadow-sm' : ''">
                         <input type="radio" value="cod" v-model="paymentMethod" name="payment" class="accent-gold h-5 w-5" />
                         <div class="flex-grow">
                            <p class="text-sm font-bold text-luxury-dark tracking-normal normal-case">Cash on Delivery (COD)</p>
                            <p class="text-[9px] text-gray-400 mt-1 uppercase tracking-widest leading-relaxed">Pay when your order reaches your doorstep (+₹99 charges).</p>
                         </div>
                         <TruckIcon class="text-gold" :size="24" />
                      </label>
                   </div>
                </div>

                <div class="pt-8">
                   <p class="text-[9px] text-gray-400 normal-case font-medium mb-12">Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <span class="text-gold underline cursor-pointer">privacy policy</span>.</p>
                   <button type="submit" class="btn-gold !w-full !py-6 text-sm tracking-[0.2em] font-bold shadow-xl hover:scale-[1.02] transform transition-transform" :disabled="isProcessing">
                     <span v-if="!isProcessing">Place Order - ₹{{ grandTotal.toLocaleString() }}</span>
                     <span v-else class="flex items-center justify-center space-x-2">
                        <Loader2Icon class="animate-spin" :size="16" />
                        <span>Processing Payment...</span>
                     </span>
                   </button>
                </div>
             </form>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:w-1/3 animate-slide-up">
           <div class="bg-white p-8 shadow-sm border border-beige sticky top-32">
              <h3 class="text-lg font-playfair font-bold text-luxury-dark mb-8 lowercase capitalize tracking-normal">Order Summary</h3>
              
              <div class="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
                 <div v-if="cartItems.length === 0" class="py-10 text-center text-xs text-gray-400 uppercase tracking-wider">
                   No items in cart
                 </div>
                 <div v-for="item in cartItems" :key="item.id" class="flex gap-4">
                    <div class="w-16 h-20 bg-beige-light flex-shrink-0">
                       <img :src="item.image" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-grow">
                       <p class="text-xs text-luxury-dark font-bold tracking-tight normal-case leading-tight mb-1">{{ item.name }}</p>
                       <p class="text-[9px] text-gray-400 uppercase tracking-widest">
                         Qty: {{ item.quantity }}
                         <span v-if="item.variant?.size">| Size: {{ item.variant.size }}</span>
                         <span v-if="item.variant?.color">| Color: {{ item.variant.color }}</span>
                       </p>
                       <p class="text-[10px] text-gold mt-2 font-bold font-inter tracking-normal">₹{{ (item.price * item.quantity).toLocaleString() }}</p>
                    </div>
                 </div>
              </div>

              <div class="space-y-4 pt-6 border-t border-beige">
                 <div class="flex justify-between">
                    <p>Subtotal</p>
                    <p class="text-luxury-dark font-bold font-inter tracking-normal">₹{{ subtotal.toLocaleString() }}</p>
                 </div>
                 <div class="flex justify-between" v-if="discount > 0">
                    <p>Discount</p>
                    <p class="text-red-500 font-bold font-inter tracking-normal">-₹{{ discount.toLocaleString() }}</p>
                 </div>
                 <div class="flex justify-between">
                    <p>Shipping</p>
                    <p class="text-green-600 font-bold tracking-normal uppercase italic text-[9px]">Complimentary</p>
                 </div>
                 <div class="flex justify-between" v-if="paymentMethod === 'cod'">
                    <p>COD Charges</p>
                    <p class="text-luxury-dark font-bold font-inter tracking-normal">₹99</p>
                 </div>
                 <div class="flex justify-between pt-4 border-t border-beige font-playfair lowercase capitalize tracking-normal text-xl text-luxury-dark">
                    <h3>Grand Total</h3>
                    <h3 class="font-bold underline decoration-gold-light underline-offset-8">₹{{ grandTotal.toLocaleString() }}</h3>
                 </div>
              </div>

              <div class="mt-10">
                 <div class="flex bg-beige-light p-2 items-center">
                    <input type="text" v-model="couponCode" placeholder="Coupon Code" class="bg-transparent border-none outline-none px-4 py-2 text-xs w-full uppercase tracking-widest font-bold" />
                    <button type="button" @click="applyCouponCode" class="bg-luxury-dark text-white text-[9px] px-6 py-2 uppercase tracking-widest font-bold hover:bg-gold transition-colors">Apply</button>
                 </div>
                 <p v-if="couponError" class="text-red-500 text-[8px] mt-2 uppercase tracking-wider">{{ couponError }}</p>
                 <p class="text-[8px] text-gray-400 mt-2 italic normal-case">Try WELCOME10 (10% off) or LUXURY500 (₹500 off)</p>
              </div>

              <div class="mt-8 pt-8 border-t border-beige flex gap-4 text-gray-400">
                 <ShieldCheckIcon :size="24" class="text-gold" />
                 <p class="text-[8px] font-medium leading-relaxed tracking-wider normal-case">SSL Encrypted Secure Payment <br/> 100% Authentic Product Guarantee</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore, useAuthStore } from '../store'
import axios from 'axios'
import { 
  CreditCard as CreditCardIcon, 
  Truck as TruckIcon,
  ShieldCheck as ShieldCheckIcon,
  Loader2 as Loader2Icon
} from 'lucide-vue-next'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const paymentMethod = ref('razorpay')
const isProcessing = ref(false)
const couponCode = ref('')
const couponError = ref('')

const addressForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  notes: ''
})

onMounted(() => {
  // Pre-fill email and name from auth store if logged in
  if (authStore.user) {
    const nameParts = (authStore.user.name || '').split(' ')
    addressForm.first_name = nameParts[0] || ''
    addressForm.last_name = nameParts.slice(1).join(' ') || ''
    addressForm.email = authStore.user.email || ''
    addressForm.phone = authStore.user.phone || ''
  }
})

const cartItems = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.subtotal)
const discount = computed(() => cartStore.discount)
const codCharge = computed(() => paymentMethod.value === 'cod' ? 99 : 0)
const grandTotal = computed(() => cartStore.total + codCharge.value)

const applyCouponCode = () => {
  couponError.value = ''
  if (!couponCode.value) return
  
  // Custom luxury codes validation
  const code = couponCode.value.toUpperCase().trim()
  if (code === 'WELCOME10') {
    cartStore.applyCoupon({ code, type: 'percent', value: 10 })
    alert('Coupon applied: 10% Off your order!')
  } else if (code === 'LUXURY500') {
    cartStore.applyCoupon({ code, type: 'flat', value: 500 })
    alert('Coupon applied: ₹500 Flat Off!')
  } else {
    couponError.value = 'Invalid coupon code.'
  }
}

const processPayment = async () => {
  if (!authStore.isAuthenticated) {
    alert('Please sign in or create an account to complete your purchase.')
    router.push('/login')
    return
  }

  if (cartItems.value.length === 0) {
    alert('Your shopping bag is empty. Please add items before checking out.')
    router.push('/shop')
    return
  }

  isProcessing.value = true
  
  try {
    const payload = {
      items: cartItems.value.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant
      })),
      total_amount: subtotal.value,
      discount_amount: discount.value,
      grand_total: grandTotal.value,
      payment_method: paymentMethod.value,
      shipping_address: {
        first_name: addressForm.first_name,
        last_name: addressForm.last_name,
        email: addressForm.email,
        phone: addressForm.phone,
        address: addressForm.address,
        city: addressForm.city,
        state: addressForm.state,
        pincode: addressForm.pincode
      },
      notes: addressForm.notes
    }

    const response = await axios.post('/orders', payload)
    alert(`Order placed successfully! Order ID: ${response.data.order_number}`)
    cartStore.clearCart()
    router.push('/dashboard')
  } catch (error) {
    console.error('Failed to submit order', error)
    alert(error.response?.data?.message || 'Failed to place order. Please try again.')
  } finally {
    isProcessing.value = false
  }
}
</script>
