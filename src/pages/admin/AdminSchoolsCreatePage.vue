<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

import AdminSchoolForm from '@/components/admin/schools/AdminSchoolForm.vue'
import { useSchoolStore } from '@/stores/schoolStore'

const router = useRouter()
const schoolStore = useSchoolStore()

const loading = computed(() => schoolStore.loading)

const handleSubmit = async (payload) => {
  try {
    await schoolStore.createSchool(payload)
    ElMessage.success('School created successfully!')
    router.push('/admin/schools')
  } catch (error) {
    ElMessage.error(error?.message || schoolStore.error || 'Unable to create school.')
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
      <h1 class="text-2xl font-semibold text-[color:var(--color-foreground)]">Create School</h1>
      <p class="text-sm text-[color:var(--color-muted)]">Add a new school and configure its details.</p>
    </header>

    <div class="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-sm">
      <AdminSchoolForm
        :loading="loading"
        submit-label="Create school"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </section>
</template>
