<script setup>
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
  {
    index: 'classes',
    label: 'Classes',
    icon: Notebook,
    children: [
      {
        index: 'classes/programs',
        label: 'Programs',
        children: [
          { index: 'classes/programs/schedule', label: 'Schedule' },
          { index: 'classes/programs/subjects', label: 'Subjects' },
        ],
      },
      { index: 'classes/assignments', label: 'Assignments' },
    ],
  },
  { index: 'staff', label: 'Staff', icon: UserFilled },
]

const menuItemClass = '!h-12 !rounded-xl !text-sm'
const dashboardClass = '!h-12 !rounded-xl !px-4 !text-sm !font-medium !bg-white !shadow-sm'
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
        active-text-color="#0f172a"
        :collapse="collapsed"
        :default-active="'dashboard'"
      >
        <template v-for="item in menuItems" :key="item.index">
          <ElSubMenu v-if="item.children" :index="item.index">
            <template #title>
              <ElIcon class="text-base">
                <component :is="item.icon" />
              </ElIcon>
              <span>{{ item.label }}</span>
            </template>

            <template v-for="child in item.children" :key="child.index">
              <ElSubMenu v-if="child.children" :index="child.index">
                <template #title>
                  <span>{{ child.label }}</span>
                </template>
                <ElMenuItem
                  v-for="leaf in child.children"
                  :key="leaf.index"
                  :index="leaf.index"
                  :class="menuItemClass"
                >
                  {{ leaf.label }}
                </ElMenuItem>
              </ElSubMenu>

              <ElMenuItem
                v-else
                :index="child.index"
                :class="menuItemClass"
              >
                {{ child.label }}
              </ElMenuItem>
            </template>
          </ElSubMenu>

          <ElMenuItem
            v-else
            :index="item.index"
            :class="item.index === 'dashboard' ? dashboardClass : menuItemClass"
          >
            <ElIcon class="text-base">
              <component :is="item.icon" />
            </ElIcon>
            <span>{{ item.label }}</span>
          </ElMenuItem>
        </template>
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
