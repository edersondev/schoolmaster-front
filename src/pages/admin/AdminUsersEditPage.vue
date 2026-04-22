<script setup>
import { computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

import AdminUserForm from '@/components/admin/users/AdminUserForm.vue'
import { useRoleStore } from '@/stores/roleStore'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const router = useRouter()
const roleStore = useRoleStore()
const userStore = useUserStore()

const userId = computed(() => route.params.id)
const loading = computed(() => userStore.loading)
const initialValues = computed(() => userStore.selectedUser || {})
const roles = computed(() => roleStore.roles)
const rolesLoading = computed(() => roleStore.loading)

const fetchUser = async () => {
  try {
    await userStore.fetchUserById(userId.value)
  } catch (error) {
    ElMessage.error(error?.message || userStore.error || 'Unable to load user.')
    router.push('/admin/users')
  }
}

const fetchRoles = async () => {
  try {
    await roleStore.fetchRoles()
  } catch (error) {
    ElMessage.error(error?.message || roleStore.error || 'Unable to load roles.')
  }
}

onMounted(async () => {
  await Promise.all([fetchUser(), fetchRoles()])
})

const handleSubmit = async (payload) => {
  try {
    await userStore.updateUser(userId.value, payload)
    ElMessage.success('User updated successfully!')
    router.push('/admin/users')
  } catch (error) {
    ElMessage.error(error?.message || userStore.error || 'Unable to update user.')
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
      <h1 class="text-2xl font-semibold text-[color:var(--color-foreground)]">Edit User</h1>
      <p class="text-sm text-[color:var(--color-muted)]">Update account data and permissions.</p>
    </header>

    <div class="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-sm">
      <AdminUserForm
        is-edit
        :loading="loading"
        :roles="roles"
        :roles-loading="rolesLoading"
        :initial-values="initialValues"
        submit-label="Save changes"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </section>
</template>
