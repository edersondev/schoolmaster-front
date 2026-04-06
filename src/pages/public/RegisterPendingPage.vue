<script setup>
import PublicLayout from '@/components/layouts/PublicLayout.vue'
</script>

<template>
  <PublicLayout>
    <section class="flex min-h-[60vh] items-center justify-center">
      <div class="w-full max-w-md space-y-6 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
        <header class="space-y-3">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Registration received</p>
          <h1 class="text-2xl font-semibold text-amber-900">Your account will be active soon</h1>
          <p class="text-sm text-amber-800">
            Thanks for registering. Our team will activate your account shortly and you can sign in after approval.
          </p>
        </header>

        <RouterLink
          to="/login"
          class="inline-flex h-11 items-center justify-center rounded-xl bg-amber-700 px-5 text-sm font-medium text-white transition hover:bg-amber-800"
        >
          Go to sign in
        </RouterLink>
      </div>
    </section>
  </PublicLayout>
</template>
