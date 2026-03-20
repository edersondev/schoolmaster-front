<script setup>
import AdminLayout from './components/admin/AdminLayout.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
themeStore.initTheme()
</script>

<template>
  <AdminLayout />
</template>
