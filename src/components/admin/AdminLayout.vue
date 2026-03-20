<script setup>
import { shallowRef } from 'vue'

import AdminSidebar from './AdminSidebar.vue'
import AdminTopbar from './AdminTopbar.vue'

const isSidebarOpen = shallowRef(false)
const isSidebarCollapsed = shallowRef(false)

const toggleDesktopSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleMobileSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="app-bg min-h-screen">
    <div class="flex min-h-screen">
      <aside
        class="hidden shrink-0 overflow-hidden border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)] transition-[width] duration-300 lg:block"
        :class="isSidebarCollapsed ? 'w-20' : 'w-72'"
      >
        <AdminSidebar :collapsed="isSidebarCollapsed" />
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          :is-sidebar-collapsed="isSidebarCollapsed"
          :is-mobile-sidebar-open="isSidebarOpen"
          @toggle-desktop-sidebar="toggleDesktopSidebar"
          @toggle-mobile-sidebar="toggleMobileSidebar"
        />

        <main class="flex-1 overflow-y-auto bg-[color:var(--color-background)] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div class="mx-auto w-full">
            <div class="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
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
      <div class="h-full border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <AdminSidebar :collapsed="false" />
      </div>
    </ElDrawer>
  </div>
</template>
