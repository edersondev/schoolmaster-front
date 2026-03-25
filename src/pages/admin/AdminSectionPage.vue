<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = computed(() => route.meta.title ?? 'Admin Section')
</script>

<template>
  <section>
    <h1 class="text-2xl font-semibold text-[color:var(--color-foreground)]">{{ title }}</h1>
    <p class="mt-2 text-sm text-[color:var(--color-muted)]">Admin section placeholder.</p>
  </section>
</template>
