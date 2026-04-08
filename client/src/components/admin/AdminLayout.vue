<template>
  <div class="flex min-h-screen bg-beige-light relative">
    <!-- Mobile Sidebar Overaly -->
    <div 
        v-if="sidebarOpen" 
        @click="sidebarOpen = false" 
        class="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500"
    ></div>

    <!-- Sidebar -->
    <AdminSidebar 
        :class="[
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            'fixed inset-y-0 left-0 z-50 shadow-2xl transition-transform duration-500 w-64'
        ]"
        @close="sidebarOpen = false"
    />

    <!-- Main Content -->
    <div class="flex-grow flex flex-col min-w-0 transition-all duration-500" :class="{'md:pl-64': true}">
      <AdminHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="p-4 md:p-8 flex-grow">
        <router-view v-slot="{ Component }">
          <transition name="fade-page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminSidebar from './AdminSidebar.vue'
import AdminHeader from './AdminHeader.vue'

const sidebarOpen = ref(false)
</script>

<style>
.fade-page-enter-active,
.fade-page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Hide horizontal scrollbar but keep functionality */
.min-w-0 {
    min-width: 0;
}
</style>
