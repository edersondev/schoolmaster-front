<script setup>
import { shallowRef } from 'vue'

import AdminSidebar from './AdminSidebar.vue'
import AdminTopbar from './AdminTopbar.vue'

const isSidebarOpen = shallowRef(false)

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

    <ElDrawer
      v-model="isSidebarOpen"
      direction="ltr"
      size="18rem"
      :with-header="false"
      class="lg:hidden"
    >
      <div class="h-full border-r border-[color:var(--color-border)] bg-white/95">
        <AdminSidebar />
      </div>
    </ElDrawer>
  </div>
</template>
