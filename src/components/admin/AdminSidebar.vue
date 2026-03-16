<script setup></script>

<template>
  <div class="flex h-full flex-col gap-8 px-6 pb-10 pt-8">
    <div class="flex items-center gap-3">
      <div class="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--color-accent)] text-white shadow-lg">
        SM
      </div>
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</p>
        <p class="text-lg font-semibold text-slate-900">Schoolmaster</p>
      </div>
    </div>

    <div class="space-y-4">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Workspace</p>
      <ElMenu
        class="border-0 !border-r-0 bg-transparent"
        background-color="transparent"
        text-color="#64748b"
        active-text-color="#0f172a"
        :default-active="'dashboard'"
      >
        <ElMenuItem index="dashboard" class="!h-12 !rounded-xl !px-4 !text-sm !font-medium !text-slate-900 !bg-white !shadow-sm">
          Dashboard
        </ElMenuItem>
        <ElMenuItem index="students" class="!h-12 !rounded-xl !px-4 !text-sm !text-slate-500 hover:!bg-slate-50">
          Students
        </ElMenuItem>
        <ElMenuItem index="classes" class="!h-12 !rounded-xl !px-4 !text-sm !text-slate-500 hover:!bg-slate-50">
          Classes
        </ElMenuItem>
        <ElMenuItem index="staff" class="!h-12 !rounded-xl !px-4 !text-sm !text-slate-500 hover:!bg-slate-50">
          Staff
        </ElMenuItem>
      </ElMenu>
    </div>

    <div class="mt-auto space-y-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Quick Notes</p>
      <div class="space-y-2 text-sm text-slate-500">
        <p>Placeholder blocks for upcoming widgets.</p>
        <p>Keep this area empty for now.</p>
      </div>
    </div>
  </div>
</template>
