<script setup>
import { computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

import AdminSchoolForm from '@/components/admin/schools/AdminSchoolForm.vue'
import { useSchoolStore } from '@/stores/schoolStore'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const route = useRoute()
const schoolStore = useSchoolStore()
const authStore = useAuthStore()
const userStore = useUserStore()

const schoolId = computed(() => route.params.id)
const loading = computed(() => schoolStore.loading)
const isAdmin = computed(() => {
  const role = authStore.user?.role
  const roleName = typeof role === 'object' ? role?.name : role
  return String(roleName || '').toLowerCase() === 'admin'
})

const referenceData = computed(() => ({
  ...schoolStore.referenceData,
  users: userStore.users,
  canEditResponsible: isAdmin.value,
}))

const schoolWithAddress = computed(() => {
  const school = schoolStore.selectedSchool
  if (!school) {
    return null
  }

  return {
    ...school,
    address: schoolStore.getAddressBySchoolId(school.id),
  }
})

const fetchSchool = async () => {
  try {
    await Promise.all([
      schoolStore.fetchReferenceData(),
      userStore.fetchUsers(),
      schoolStore.fetchSchoolAddresses({ school_id: schoolId.value }),
      schoolStore.fetchSchoolById(schoolId.value),
    ])
  } catch (error) {
    ElMessage.error(error?.message || schoolStore.error || 'Unable to load school.')
    router.push('/admin/schools')
  }
}

onMounted(async () => {
  await fetchSchool()
})

const handleSubmit = async (payload) => {
  try {
    await schoolStore.updateSchool(schoolId.value, payload)
    ElMessage.success('School updated successfully!')
    router.push('/admin/schools')
  } catch (error) {
    ElMessage.error(error?.message || schoolStore.error || 'Unable to update school.')
  }
}

const handleCancel = () => {
  router.push('/admin/schools')
}
</script>

<template>
  <section class="mx-auto w-full max-w-4xl space-y-6">
    <header class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">Admin</p>
      <h1 class="text-2xl font-semibold text-[color:var(--color-foreground)]">Edit School</h1>
      <p class="text-sm text-[color:var(--color-muted)]">Update school information and settings.</p>
    </header>

    <div class="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-sm">
      <AdminSchoolForm
        :initial-values="schoolWithAddress"
        :reference-data="referenceData"
        :is-edit="true"
        :loading="loading"
        submit-label="Update school"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </section>
</template>
