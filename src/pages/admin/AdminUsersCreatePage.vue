<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

import AdminUserForm from '@/components/admin/users/AdminUserForm.vue'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const loading = computed(() => userStore.loading)

const handleSubmit = async (payload) => {
  try {
    await userStore.createUser(payload)
    ElMessage.success('User created successfully!')
    router.push('/admin/users')
  } catch (error) {
    ElMessage.error(error?.message || userStore.error || 'Unable to create user.')
  }
}

const handleCancel = () => {
  router.push('/admin/users')
}
</script>

<template>
  <section class="mx-auto w-full max-w-3xl space-y-6">
    <header class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">Admin</p>
      <h1 class="text-2xl font-semibold text-[color:var(--color-foreground)]">Create User</h1>
      <p class="text-sm text-[color:var(--color-muted)]">Add a new user and assign role access.</p>
    </header>

    <div class="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-sm">
      <AdminUserForm
        :loading="loading"
        submit-label="Create user"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </section>
</template>
