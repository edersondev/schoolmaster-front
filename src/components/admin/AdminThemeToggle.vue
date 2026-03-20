<script setup>
import { computed } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const buttonLabel = computed(() =>
  themeStore.isDark.value ? 'Switch to light mode' : 'Switch to dark mode'
)
</script>

<template>
  <ElButton
    class="h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"
    circle
    plain
    @click="themeStore.toggleDark()"
  >
    <span class="sr-only">{{ buttonLabel }}</span>
    <ElIcon class="text-lg">
      <Sunny v-if="themeStore.isDark" />
      <Moon v-else />
    </ElIcon>
  </ElButton>
</template>
