import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/shop', name: 'shop', component: () => import('../views/ShopView.vue') },
  { path: '/product/:slug', name: 'product-detail', component: () => import('../views/ProductDetailView.vue') },
  { path: '/custom-stitching', name: 'custom-stitching', component: () => import('../views/CustomStitchingView.vue') },
  { path: '/embroidery', name: 'embroidery', component: () => import('../views/EmbroideryView.vue') },
  { path: '/gallery', name: 'gallery', component: () => import('../views/GalleryView.vue') },
  { path: '/cart', name: 'cart', component: () => import('../views/CartView.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('../views/CheckoutView.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
  {
    path: '/admin',
    component: () => import('../components/admin/AdminLayout.vue'),
    redirect: { name: 'admin-dashboard' },
    children: [
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboardView.vue') },
      { path: 'products', name: 'admin-products', component: () => import('../views/admin/AdminProductsView.vue') },
      { path: 'categories', name: 'admin-categories', component: () => import('../views/admin/AdminCategoriesView.vue') },
      { path: 'orders', name: 'admin-orders', component: () => import('../views/admin/AdminOrdersView.vue') },
      { path: 'billing', name: 'admin-billing', component: () => import('../views/admin/AdminBillingView.vue') },
      { path: 'custom-orders', name: 'admin-custom-orders', component: () => import('../views/admin/AdminCustomOrdersView.vue') },
      { path: 'embroidery', name: 'admin-embroidery', component: () => import('../views/admin/AdminEmbroideryView.vue') },
      { path: 'users', name: 'admin-users', component: () => import('../views/admin/AdminUsersView.vue') },
      { path: 'subscriptions', name: 'admin-subscriptions', component: () => import('../views/admin/AdminSubscriptionsView.vue') },
      { path: 'coupons', name: 'admin-coupons', component: () => import('../views/admin/AdminCouponsView.vue') },
      { path: 'settings', name: 'admin-settings', component: () => import('../views/admin/AdminSettingsView.vue') },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router
