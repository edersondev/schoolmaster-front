<script setup>
import { computed, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown, ArrowUp, Avatar, Help, Setting, SwitchButton, User } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const isMenuOpen = shallowRef(false)

const user = computed(() => ({
  name: authStore.user?.name || 'User',
  email: authStore.user?.email || '',
}))

const firstName = computed(() => {
  const name = user.value.name.trim()
  return name.split(/\s+/)[0] || name
})

const handleVisibleChange = (visible) => {
  isMenuOpen.value = visible
}

const handleCommand = (command) => {
  if (!command) return
  router.push({ name: command })
}
</script>

<template>
  <ElDropdown
    trigger="click"
    placement="bottom-end"
    @visible-change="handleVisibleChange"
    @command="handleCommand"
  >
    <ElButton
      class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm"
      plain
    >
      <span class="flex items-center gap-2">
        <ElIcon class="text-base">
          <User />
        </ElIcon>
        <span class="text-sm font-semibold">{{ firstName }}</span>
        <ElIcon class="text-base">
          <ArrowUp v-if="isMenuOpen" />
          <ArrowDown v-else />
        </ElIcon>
      </span>
    </ElButton>

    <template #dropdown>
      <ElDropdownMenu class="min-w-[220px]">
        <ElDropdownItem disabled class="!cursor-default !opacity-100 !py-3">
          <div class="flex flex-col">
            <span class="text-sm font-semibold">{{ user.name }}</span>
            <span class="text-xs">{{ user.email }}</span>
          </div>
        </ElDropdownItem>

        <ElDropdownItem command="account-edit-profile">
          <span class="flex items-center gap-2 text-sm">
            <ElIcon class="text-base">
              <Avatar />
            </ElIcon>
            Edit profile
          </span>
        </ElDropdownItem>

        <ElDropdownItem command="account-settings">
          <span class="flex items-center gap-2 text-sm">
            <ElIcon class="text-base">
              <Setting />
            </ElIcon>
            Account settings
          </span>
        </ElDropdownItem>

        <ElDropdownItem>
          <span class="flex items-center gap-2 text-sm">
            <ElIcon class="text-base">
              <Help />
            </ElIcon>
            Support
          </span>
        </ElDropdownItem>

        <ElDropdownItem divided>
          <span class="flex items-center gap-2 text-sm">
            <ElIcon class="text-base">
              <SwitchButton />
            </ElIcon>
            Sign out
          </span>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
