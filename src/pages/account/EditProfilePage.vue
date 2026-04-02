<script setup>
import { computed, onMounted, reactive, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'

import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'

const formRef = shallowRef(null)
const authStore = useAuthStore()
const userStore = useUserStore()

const form = reactive({
  name: '',
  email: '',
})

const rules = {
  name: [{ required: true, message: 'Name is required.', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required.', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address.', trigger: 'blur' },
  ],
}

const isSubmitting = computed(() => userStore.loading)
const currentUserId = computed(() => authStore.user?.id || userStore.profile?.id || null)

const hydrateForm = (profile) => {
  if (!profile) return

  form.name = profile.name || ''
  form.email = profile.email || ''
}

onMounted(async () => {
  if (authStore.user) {
    hydrateForm(authStore.user)
    return
  }

  if (authStore.token && !authStore.loading) {
    try {
      const loggedUser = await authStore.fetchMe()
      hydrateForm(loggedUser)
      return
    } catch (error) {
      // Continue with user profile fallback.
    }
  }

  if (userStore.profile) {
    hydrateForm(userStore.profile)
    return
  }

  try {
    const profile = await userStore.fetchProfile()
    hydrateForm(profile)
  } catch (error) {
    // Keep the page usable even if prefill fails.
  }
})

const handleSave = async (event) => {

  event?.preventDefault?.()
  event?.stopPropagation?.()

  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  try {
    if (!currentUserId.value) {
      ElMessage.error('Unable to determine user ID.')
      return
    }

    const payload = {
      id: currentUserId.value,
      name: form.name.trim(),
      email: form.email.trim(),
    }

    const updatedProfile = await userStore.updateProfile(payload)

    hydrateForm(updatedProfile)

    if (updatedProfile) {
      authStore.user = {
        ...(authStore.user || {}),
        ...updatedProfile,
      }
    }

    ElMessage.success('Profile updated successfully!')
  } catch (error) {
    ElMessage.error(error?.message || userStore.error || 'Unable to update profile.')
  }
}
</script>

<template>
  <section class="mx-auto w-full max-w-2xl space-y-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-sm">
    <header class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">Account</p>
      <h1 class="text-2xl font-semibold text-[color:var(--color-foreground)]">Edit Profile</h1>
      <p class="text-sm text-[color:var(--color-muted)]">Keep your profile details up to date.</p>
    </header>

    <ElForm ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-4" @submit.prevent>
      <ElFormItem label="Full name" prop="name">
        <ElInput v-model="form.name" placeholder="Your full name" size="large" />
      </ElFormItem>

      <ElFormItem label="Email" prop="email">
        <ElInput v-model="form.email" placeholder="you@example.com" size="large" />
      </ElFormItem>

      <div class="flex justify-end pt-2">
        <ElButton
          type="primary"
          class="!h-11 min-w-32 !rounded-xl"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          @click="handleSave"
        >
          Save changes
        </ElButton>
      </div>
    </ElForm>
  </section>
</template>
