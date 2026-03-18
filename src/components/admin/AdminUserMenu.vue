<script setup>
import { computed, shallowRef } from 'vue'
import { ArrowDown, ArrowUp, Avatar, Help, Setting, SwitchButton, User } from '@element-plus/icons-vue'

const isMenuOpen = shallowRef(false)

const user = {
  name: 'Jordan Lee',
  email: 'jordan.lee@schoolmaster.test',
}

const firstName = computed(() => user.name.split(' ')[0] || user.name)

const handleVisibleChange = (visible) => {
  isMenuOpen.value = visible
}
</script>

<template>
  <ElDropdown trigger="click" placement="bottom-end" @visible-change="handleVisibleChange">
    <ElButton
      class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 shadow-sm"
      plain
    >
      <span class="flex items-center gap-2">
        <ElIcon class="text-base text-slate-500">
          <User />
        </ElIcon>
        <span class="text-sm font-semibold text-slate-700">{{ firstName }}</span>
        <ElIcon class="text-base text-slate-400">
          <ArrowUp v-if="isMenuOpen" />
          <ArrowDown v-else />
        </ElIcon>
      </span>
    </ElButton>

    <template #dropdown>
      <ElDropdownMenu class="min-w-[220px]">
        <ElDropdownItem disabled class="!cursor-default !opacity-100 !py-3">
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-slate-800">{{ user.name }}</span>
            <span class="text-xs text-slate-500">{{ user.email }}</span>
          </div>
        </ElDropdownItem>

        <ElDropdownItem>
          <span class="flex items-center gap-2 text-sm text-slate-700">
            <ElIcon class="text-base text-slate-500">
              <Avatar />
            </ElIcon>
            Edit profile
          </span>
        </ElDropdownItem>

        <ElDropdownItem>
          <span class="flex items-center gap-2 text-sm text-slate-700">
            <ElIcon class="text-base text-slate-500">
              <Setting />
            </ElIcon>
            Account settings
          </span>
        </ElDropdownItem>

        <ElDropdownItem>
          <span class="flex items-center gap-2 text-sm text-slate-700">
            <ElIcon class="text-base text-slate-500">
              <Help />
            </ElIcon>
            Support
          </span>
        </ElDropdownItem>

        <ElDropdownItem divided>
          <span class="flex items-center gap-2 text-sm text-slate-700">
            <ElIcon class="text-base text-slate-500">
              <SwitchButton />
            </ElIcon>
            Sign out
          </span>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
