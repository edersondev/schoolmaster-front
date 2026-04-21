<script setup>
import { Mask } from 'maska'

const props = defineProps({
  schools: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  administrativeTypeLabelMap: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['edit', 'delete'])
const cnpjMask = new Mask({ mask: '##.###.###/####-##' })

const formatStatusLabel = (status) => {
  return Number(status) === 1 ? 'Active' : 'Inactive'
}

const formatCnpj = (document) => {
  const value = String(document || '').trim()
  if (!value) {
    return '-'
  }

  return cnpjMask.masked(value)
}

const formatAdministrativeType = (administrativeTypeId) => {
  if (!administrativeTypeId) {
    return '-'
  }

  return props.administrativeTypeLabelMap[String(administrativeTypeId)] || '-'
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
    <ElTableColumn label="CNPJ" min-width="170">
      <template #default="{ row }">
        {{ formatCnpj(row.document) }}
      </template>
    </ElTableColumn>
    <ElTableColumn label="Administrative Type" min-width="170">
      <template #default="{ row }">
        {{ formatAdministrativeType(row.administrative_type_id) }}
      </template>
    </ElTableColumn>
    <ElTableColumn label="Status" min-width="100">
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
