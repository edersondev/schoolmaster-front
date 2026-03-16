<script setup>
import { shallowRef } from 'vue'

import AdminSidebar from './AdminSidebar.vue'
import AdminTopbar from './AdminTopbar.vue'

const isSidebarOpen = shallowRef(false)

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="app-bg min-h-screen">
    <div class="flex min-h-screen">
      <aside class="hidden w-72 shrink-0 border-r border-[color:var(--color-border)] bg-white/80 lg:block">
        <AdminSidebar />
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <AdminTopbar @toggle-sidebar="toggleSidebar" />

        <main class="flex-1 overflow-y-auto px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div class="mx-auto w-full max-w-6xl">
            <div class="rounded-2xl border border-[color:var(--color-border)] bg-white/80 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
              <router-view />
            </div>
          </div>
        </main>
      </div>
    </div>

    <transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
        @click="closeSidebar"
      ></div>
    </transition>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="-translate-x-full opacity-0"
    >
      <aside
        v-if="isSidebarOpen"
        class="fixed inset-y-0 left-0 z-50 w-72 border-r border-[color:var(--color-border)] bg-white/95 shadow-2xl lg:hidden"
      >
        <AdminSidebar />
      </aside>
    </transition>
  </div>
</template>
