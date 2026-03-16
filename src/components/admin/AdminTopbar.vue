<script setup>
const emit = defineEmits(['toggleSidebar'])
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-[color:var(--color-border)] bg-white/80 backdrop-blur">
    <div class="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <button
        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
        type="button"
        @click="emit('toggleSidebar')"
      >
        <span class="sr-only">Toggle sidebar</span>
        <div class="space-y-1">
          <span class="block h-0.5 w-5 rounded-full bg-current"></span>
          <span class="block h-0.5 w-4 rounded-full bg-current"></span>
          <span class="block h-0.5 w-5 rounded-full bg-current"></span>
        </div>
      </button>

      <div class="flex flex-1 items-center gap-3">
        <div class="hidden text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">
          Overview
        </div>
        <div class="flex-1">
          <div class="relative">
            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              Search
            </span>
            <input
              class="h-11 w-full rounded-xl border border-slate-200 bg-white/70 pl-14 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none"
              placeholder="Type to filter..."
              type="search"
            />
          </div>
        </div>
      </div>

      <button class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
        <span class="hidden text-xs uppercase tracking-[0.2em] text-slate-400 sm:inline">Admin</span>
        <span class="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-xs font-semibold text-white">
          SA
        </span>
      </button>
    </div>
  </header>
</template>
