<template>
  <div class="min-h-screen bg-[color:var(--color-background)]">
    <header class="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">Schoolmaster</p>
          <h1 class="text-xl font-semibold text-[color:var(--color-foreground)]">Welcome</h1>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-5xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div class="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <slot />
      </div>
    </main>
  </div>
</template>
