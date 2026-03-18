<script setup>
import { shallowRef } from 'vue'
import { ArrowLeft, ArrowRight, Expand } from '@element-plus/icons-vue'
import AdminUserMenu from './AdminUserMenu.vue'
import AdminUserNotification from './AdminUserNotification.vue'

const { isSidebarCollapsed } = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggleDesktopSidebar', 'toggleMobileSidebar'])
const searchQuery = shallowRef('')
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-[color:var(--color-border)] bg-white/80 backdrop-blur">
    <div class="flex items-center gap-4 px-4 py-4 sm:px-4 lg:px-4">
      <ElButton
        class="!hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm lg:!flex"
        circle
        @click="emit('toggleDesktopSidebar')"
      >
        <span class="sr-only">Toggle sidebar</span>
        <ElIcon class="text-lg">
          <ArrowLeft v-if="!isSidebarCollapsed" />
          <ArrowRight v-else />
        </ElIcon>
      </ElButton>

      <ElButton
        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:!hidden"
        plain
        @click="emit('toggleMobileSidebar')"
      >
        <span class="sr-only">Toggle sidebar</span>
        <ElIcon class="text-lg">
          <Expand />
        </ElIcon>
      </ElButton>

      <div class="flex flex-1 items-center gap-3">
        <div class="hidden text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">
          Overview
        </div>
        <div class="flex-1">
          <ElInput
            v-model="searchQuery"
            class="h-11"
            input-class="h-11 rounded-xl border border-slate-200 bg-white/70 pl-10 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
            placeholder="Type to filter..."
            clearable
          >
            <template #prefix>
              <span class="text-xs text-slate-400">Search</span>
            </template>
          </ElInput>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <AdminUserNotification />
        <AdminUserMenu />
      </div>
    </div>
  </header>
</template>
