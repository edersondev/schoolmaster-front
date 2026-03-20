<script setup>
import { computed } from 'vue'
import { HomeFilled, Notebook, User, UserFilled } from '@element-plus/icons-vue'

const { collapsed } = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
})

const menuItems = [
  { index: 'dashboard', label: 'Dashboard', icon: HomeFilled },
  { index: 'students', label: 'Students', icon: User },
  { index: 'classes', label: 'Classes', icon: Notebook },
  { index: 'staff', label: 'Staff', icon: UserFilled },
]

const menuItemClass = computed(() =>
  collapsed
    ? '!h-12 !w-12 !justify-center !rounded-xl !px-0 hover:!bg-slate-50'
    : '!h-12 !rounded-xl !px-4 !text-sm hover:!bg-slate-50'
)

const dashboardClass = computed(() =>
  collapsed
    ? '!h-12 !w-12 !justify-center !rounded-xl !px-0 !bg-white !shadow-sm'
    : '!h-12 !rounded-xl !px-4 !text-sm !font-medium !bg-white !shadow-sm'
)
</script>

<template>
  <div class="flex h-full flex-col gap-8 px-6 pb-10 pt-8" :class="collapsed ? 'items-center px-4' : ''">
    <div class="flex items-center gap-3" :class="collapsed ? 'flex-col' : ''">
      <div class="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--color-accent)] text-white shadow-lg">
        SM
      </div>
      <div v-if="!collapsed">
        <p class="text-xs uppercase tracking-[0.2em]">Admin</p>
        <p class="text-lg font-semibold text-[color:var(--color-foreground)]">Schoolmaster</p>
      </div>
    </div>

    <div class="space-y-4" :class="collapsed ? 'w-full' : ''">
      <p v-if="!collapsed" class="text-xs font-semibold uppercase tracking-[0.2em]">Workspace</p>
      <ElMenu
        class="border-0 !border-r-0 bg-transparent"
        background-color="transparent"
        text-color="#64748b"
        active-text-color="#0f172a"
        :default-active="'dashboard'"
      >
        <ElMenuItem
          v-for="item in menuItems"
          :key="item.index"
          :index="item.index"
          :class="item.index === 'dashboard' ? dashboardClass : menuItemClass"
        >
          <ElTooltip
            :disabled="!collapsed"
            :content="item.label"
            placement="right"
          >
            <div class="flex items-center gap-3" :class="collapsed ? 'justify-center' : ''">
              <ElIcon class="text-base">
                <component :is="item.icon" />
              </ElIcon>
              <span v-if="!collapsed">{{ item.label }}</span>
            </div>
          </ElTooltip>
        </ElMenuItem>
      </ElMenu>
    </div>

    <div
      v-if="!collapsed"
      class="mt-auto space-y-4 rounded-2xl border border-dashed border-slate-200 bg-[color:var(--color-surface-muted)] p-4"
    >
      <p class="text-xs font-semibold uppercase tracking-[0.2em]">Quick Notes</p>
      <div class="space-y-2 text-sm">
        <p>Placeholder blocks for upcoming widgets.</p>
        <p>Keep this area empty for now.</p>
      </div>
    </div>
  </div>
</template>
