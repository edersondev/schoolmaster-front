<script setup>
import { Mask } from 'maska'

defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit', 'delete'])
const cpfMask = new Mask({ mask: '###.###.###-##' })

const formatStatusLabel = (status) => {
  return Number(status) === 1 ? 'Active' : 'Inactive'
}

const formatCpf = (cpf) => {
  const value = String(cpf || '').trim()
  if (!value) {
    return '-'
  }

  return cpfMask.masked(value)
}

const handleEdit = (user) => {
  emit('edit', user)
}

const handleDelete = (user) => {
  emit('delete', user)
}
</script>

<template>
  <ElTable :data="users" :loading="loading" class="w-full" empty-text="No users found.">
    <ElTableColumn prop="name" label="Name" min-width="220" />
    <ElTableColumn prop="email" label="Email" min-width="240" />
    <ElTableColumn label="CPF" min-width="140">
      <template #default="{ row }">
        {{ formatCpf(row.cpf) }}
      </template>
    </ElTableColumn>
    <ElTableColumn prop="role" label="Role" min-width="140" />
    <ElTableColumn label="Status" min-width="120">
      <template #default="{ row }">
        {{ formatStatusLabel(row.status) }}
      </template>
    </ElTableColumn>
    <ElTableColumn label="Actions" min-width="180" fixed="right">
      <template #default="{ row }">
        <div class="flex gap-2">
          <ElButton size="small" @click="handleEdit(row)">Edit</ElButton>
          <ElButton size="small" type="danger" plain @click="handleDelete(row)">Delete</ElButton>
        </div>
      </template>
    </ElTableColumn>
  </ElTable>
</template>
