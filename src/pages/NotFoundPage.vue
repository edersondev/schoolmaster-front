<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>

<template>
  <section class="flex min-h-[50vh] items-center justify-center text-center">
    <div class="mx-auto w-full max-w-md space-y-4">
      <div class="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
        <svg
          viewBox="0 0 120 120"
          class="h-20 w-20 text-[color:var(--color-muted)]"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" stroke-width="4" />
          <circle cx="48" cy="54" r="4" fill="currentColor" />
          <circle cx="72" cy="54" r="4" fill="currentColor" />
          <path
            d="M46 74c5-6 23-6 28 0"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="4"
          />
          <path
            d="M85 88l14 14"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="4"
          />
        </svg>
      </div>

      <div class="space-y-2">
        <h1 class="text-2xl font-semibold text-[color:var(--color-foreground)]">Page Not Found</h1>
        <p class="text-sm text-[color:var(--color-muted)]">
          We looked everywhere, but that page is playing hide-and-seek.
        </p>
      </div>

      <ElButton class="!h-11 !rounded-xl" type="primary" @click="handleBack">
        Go Back
      </ElButton>
    </div>
  </section>
</template>
