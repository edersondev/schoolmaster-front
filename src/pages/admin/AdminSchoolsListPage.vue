<script setup>
import { computed, onMounted, shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

import AdminSchoolsTable from '@/components/admin/schools/AdminSchoolsTable.vue'
import { useSchoolStore } from '@/stores/schoolStore'

const router = useRouter()
const schoolStore = useSchoolStore()
const searchQuery = shallowRef('')

const loading = computed(() => schoolStore.loading)

const administrativeTypeLabelMap = computed(() => {
  const map = {}
  schoolStore.referenceData.administrativeTypes.forEach((item) => {
    map[String(item.id)] = item.label
  })

  return map
})

const filteredSchools = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return schoolStore.schools
  }

  return schoolStore.schools.filter((school) => {
    const address = schoolStore.schoolAddressesBySchoolId[String(school.id)]
    const administrativeTypeLabel = administrativeTypeLabelMap.value[String(school.administrative_type_id)] || ''

    return [
      school.name,
      school.email,
      school.document,
      administrativeTypeLabel,
      address?.city,
      address?.state,
    ]
      .map((value) => String(value || '').toLowerCase())
      .some((value) => value.includes(query))
  })
})

const fetchSchools = async () => {
  try {
    await Promise.all([
      schoolStore.fetchSchools(),
      schoolStore.fetchReferenceData(),
      schoolStore.fetchSchoolAddresses(),
    ])
  } catch (error) {
    ElMessage.error(error?.message || schoolStore.error || 'Unable to load schools.')
  }
}

onMounted(async () => {
  await fetchSchools()
})

const goToCreate = () => {
  router.push('/admin/schools/create')
}

const goToEdit = (school) => {
  router.push(`/admin/schools/${school.id}/edit`)
}

const handleDelete = async (school) => {
  try {
    await ElMessageBox.confirm(
      `Delete school ${school.name}? This action cannot be undone.`,
      'Delete School',
      {
        type: 'warning',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      }
    )

    await schoolStore.deleteSchool(school.id)
    ElMessage.success('School deleted successfully!')
  } catch (error) {
    if (error === 'cancel' || error === 'close') {
      return
    }

    ElMessage.error(error?.message || schoolStore.error || 'Unable to delete school.')
  }
}
</script>

<template>
  <section class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">Admin</p>
        <h1 class="text-2xl font-semibold text-[color:var(--color-foreground)]">Schools</h1>
        <p class="text-sm text-[color:var(--color-muted)]">Manage schools from one place.</p>
      </div>

      <ElButton type="primary" class="!h-11 !rounded-xl" @click="goToCreate">Create school</ElButton>
    </header>

    <div class="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
      <ElInput
        v-model="searchQuery"
        placeholder="Search by name, email, cnpj, type, city or state"
        clearable
        size="large"
      />
    </div>

    <div class="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-2 sm:p-4">
      <AdminSchoolsTable
        :schools="filteredSchools"
        :loading="loading"
        :administrative-type-label-map="administrativeTypeLabelMap"
        @edit="goToEdit"
        @delete="handleDelete"
      />
    </div>
  </section>
</template>
