<script setup>
import { shallowRef } from 'vue'
import { Avatar, Bell } from '@element-plus/icons-vue'

const notifications = [
  {
    id: 1,
    name: 'Alicia Stone',
    description: 'added a new task',
    feature: 'Project Nganter',
    time: '5 min ago',
  },
  {
    id: 2,
    name: 'Ramon Vela',
    description: 'commented on a report',
    feature: 'Project Nganter',
    time: '12 min ago',
  },
  {
    id: 3,
    name: 'Camila Torres',
    description: 'assigned you a milestone',
    feature: 'Project Nganter',
    time: '25 min ago',
  },
  {
    id: 4,
    name: 'Imani Brooks',
    description: 'uploaded a new file',
    feature: 'Project Nganter',
    time: '1 hr ago',
  },
  {
    id: 5,
    name: 'Dante Fields',
    description: 'requested review',
    feature: 'Project Nganter',
    time: '2 hr ago',
  },
  {
    id: 6,
    name: 'Mei Nakamura',
    description: 'updated the timeline',
    feature: 'Project Nganter',
    time: '3 hr ago',
  },
]
</script>

<template>
  <ElDropdown trigger="click" placement="bottom-end">
    <ElBadge is-dot class="inline-flex">
      <ElButton
        class="h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"
        circle
        plain
      >
        <span class="sr-only">Open notifications</span>
        <ElIcon class="text-lg">
          <Bell />
        </ElIcon>
      </ElButton>
    </ElBadge>

    <template #dropdown>
      <div
        class="w-[360px] border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold">Notification</span>
        </div>

        <div class="my-3 border-t border-slate-200" />

        <div class="max-h-80 overflow-y-auto">
          <el-dropdown-menu>
              <el-dropdown-item v-for="notice in notifications" :key="notice.id">
                <div class="flex gap-3 border-b border-slate-100 py-3 last:border-b-0">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)]">
                        <ElIcon class="text-base">
                            <Avatar />
                        </ElIcon>
                    </div>
  
                    <div class="flex-1">
                        <span class="text-sm whitespace-pre-line">
                            <span class="font-semibold">{{ notice.name }}</span>
                            {{ notice.description }}
                            <span class="font-semibold">{{ notice.feature }}</span>
                        </span>
                        <div class="mt-1 text-xs">
                            {{ notice.feature }} - {{ notice.time }}
                        </div>
                    </div>
                </div>
              </el-dropdown-item>
          </el-dropdown-menu>
        </div>

        <div class="pt-3">
          <a href="#" class="block">
            <ElButton class="w-full" plain>View all Notifications</ElButton>
          </a>
        </div>
      </div>
    </template>
  </ElDropdown>
</template>
