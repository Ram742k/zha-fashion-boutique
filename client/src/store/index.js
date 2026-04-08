import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    wishlist: [],
    coupon: null,
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    discount: (state) => {
        if (!state.coupon) return 0
        if (state.coupon.type === 'percent') return (state.subtotal * state.coupon.value) / 100
        return state.coupon.value
    },
    total: (state) => state.subtotal - state.discount,
  },
  actions: {
    addToCart(product, quantity = 1, variant = null) {
      const existing = this.items.find(i => i.id === product.id && JSON.stringify(i.variant) === JSON.stringify(variant))
      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({ ...product, quantity, variant })
      }
    },
    removeFromCart(productId, variant = null) {
      this.items = this.items.filter(i => !(i.id === productId && JSON.stringify(i.variant) === JSON.stringify(variant)))
    },
    applyCoupon(coupon) {
      this.coupon = coupon
    },
    clearCart() {
        this.items = []
        this.coupon = null
    }
  }
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  actions: {
    setUser(user, token) {
      this.user = user
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
