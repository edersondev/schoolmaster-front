<script setup>
import { Mask } from 'maska'

defineProps({
  schools: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit', 'delete'])
const cnpjMask = new Mask({ mask: '##.###.###/####-##' })

const formatActiveLabel = (active) => {
  return active ? 'Active' : 'Inactive'
}

const formatCnpj = (cnpj) => {
  const value = String(cnpj || '').trim()
  if (!value) {
    return '-'
  }

  return cnpjMask.masked(value)
}

const handleEdit = (school) => {
  emit('edit', school)
}

const handleDelete = (school) => {
  emit('delete', school)
}
</script>

<template>
  <ElTable :data="schools" :loading="loading" class="w-full" empty-text="No schools found.">
    <ElTableColumn prop="name" label="Name" min-width="220" />
    <ElTableColumn prop="email" label="Email" min-width="240" />
    <ElTableColumn label="CNPJ" min-width="160">
      <template #default="{ row }">
        {{ formatCnpj(row.cnpj) }}
      </template>
    </ElTableColumn>
    <ElTableColumn prop="type" label="Type" min-width="120" />
    <ElTableColumn label="Active" min-width="100">
      <template #default="{ row }">
        {{ formatActiveLabel(row.active) }}
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
