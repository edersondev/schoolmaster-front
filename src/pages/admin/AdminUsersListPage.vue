<script setup>
import { computed, onMounted, shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

import AdminUsersTable from '@/components/admin/users/AdminUsersTable.vue'
import { useRoleStore } from '@/stores/roleStore'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const roleStore = useRoleStore()
const userStore = useUserStore()
const searchQuery = shallowRef('')

const loading = computed(() => userStore.loading)
const roleLabelById = computed(() =>
  new Map(
    roleStore.roles.map((role) => [
      String(role.id),
      String(role.name || '')
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
    ])
  )
)

const usersWithRoleLabel = computed(() =>
  userStore.users.map((user) => ({
    ...user,
    role_label: roleLabelById.value.get(String(user.role_id)) || '-',
  }))
)

const filteredUsers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return usersWithRoleLabel.value
  }

  return usersWithRoleLabel.value.filter((user) => {
    const roleLabel = String(user.role_label || '').toLowerCase()
    return [
      user.name,
      user.email,
      user.cpf,
      roleLabel,
    ]
      .map((value) => String(value || '').toLowerCase())
      .some((value) => value.includes(query))
  })
})

const fetchUsers = async () => {
  try {
    await userStore.fetchUsers()
  } catch (error) {
    ElMessage.error(error?.message || userStore.error || 'Unable to load users.')
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
  await Promise.all([fetchUsers(), fetchRoles()])
})

const goToCreate = () => {
  router.push('/admin/users/create')
}

const goToEdit = (user) => {
  router.push(`/admin/users/${user.id}/edit`)
}

const handleDelete = async (user) => {
  try {
    await ElMessageBox.confirm(
      `Delete user ${user.name}? This action cannot be undone.`,
      'Delete User',
      {
        type: 'warning',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      }
    )

    await userStore.deleteUser(user.id)
    ElMessage.success('User deleted successfully!')
  } catch (error) {
    if (error === 'cancel' || error === 'close') {
      return
    }

    ElMessage.error(error?.message || userStore.error || 'Unable to delete user.')
  }
}
</script>

<template>
  <section class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">Admin</p>
        <h1 class="text-2xl font-semibold text-[color:var(--color-foreground)]">Users</h1>
        <p class="text-sm text-[color:var(--color-muted)]">Manage platform users from one place.</p>
      </div>

      <ElButton type="primary" class="!h-11 !rounded-xl" @click="goToCreate">Create user</ElButton>
    </header>

    <div class="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
      <ElInput
        v-model="searchQuery"
        placeholder="Search by name, email, cpf, or role"
        clearable
        size="large"
      />
    </div>

    <div class="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-2 sm:p-4">
      <AdminUsersTable
        :users="filteredUsers"
        :loading="loading"
        @edit="goToEdit"
        @delete="handleDelete"
      />
    </div>
  </section>
</template>
