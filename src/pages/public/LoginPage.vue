<script setup>
import { computed, reactive, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import PublicLayout from '@/components/layouts/PublicLayout.vue'
import { getRoleHome } from '@/router/roleHomeMap'
import { useAuthStore } from '@/stores/authStore'

const formRef = shallowRef(null)
const submitError = shallowRef(null)
const fieldErrors = reactive({
  email: '',
  password: '',
})
const router = useRouter()
const authStore = useAuthStore()

const isSubmitting = computed(() => authStore.loading)

const form = reactive({
  email: '',
  password: '',
})

const rules = {
  email: [
    { required: true, message: 'Email is required.', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address.', trigger: 'blur' },
  ],
  password: [{ required: true, message: 'Password is required.', trigger: 'blur' }],
}

const handleSubmit = async () => {
  if (!formRef.value) return

  submitError.value = null
  fieldErrors.email = ''
  fieldErrors.password = ''

  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  try {
    const session = await authStore.login({
      email: form.email,
      password: form.password,
    })

    formRef.value.resetFields()

    const nextPath = getRoleHome(session?.user?.role)
    ElMessage.success('Welcome back!')
    await router.push(nextPath)
  } catch (error) {
    if (error?.status === 422 && error?.data?.errors) {
      fieldErrors.email = error.data.errors.email?.[0] || ''
      fieldErrors.password = error.data.errors.password?.[0] || ''
      submitError.value = error?.message || 'Please check the highlighted fields.'
      ElMessage.error(submitError.value)
      return
    }

    submitError.value = error?.message || authStore.error || 'Unable to sign in.'
    ElMessage.error(submitError.value)
  }
}
</script>

<template>
  <PublicLayout>
    <section class="flex min-h-[60vh] items-center justify-center">
      <div class="w-full max-w-md space-y-6">
        <header class="space-y-2 text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">Welcome back</p>
          <h1 class="text-2xl font-semibold text-[color:var(--color-foreground)]">Sign in to Schoolmaster</h1>
          <p class="text-sm text-[color:var(--color-muted)]">Use your email and password to continue.</p>
        </header>

        <ElForm ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-4">
          <ElFormItem label="Email" prop="email" :error="fieldErrors.email">
            <ElInput v-model="form.email" placeholder="you@example.com" size="large" />
          </ElFormItem>

          <ElFormItem label="Password" prop="password" :error="fieldErrors.password">
            <ElInput v-model="form.password" type="password" placeholder="Enter your password" size="large" show-password />
          </ElFormItem>

          <ElButton type="primary" class="w-full !h-11 !rounded-xl" :loading="isSubmitting" @click="handleSubmit">
            Sign in
          </ElButton>
        </ElForm>

        <div v-if="submitError" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {{ submitError }}
        </div>

        <div class="flex flex-col items-center gap-2 text-sm text-[color:var(--color-muted)]">
          <RouterLink class="font-medium text-[color:var(--color-foreground)]" to="/forgot-password">
            Forgot your password?
          </RouterLink>
          <span>
            New here?
            <RouterLink class="font-medium text-[color:var(--color-foreground)]" to="/register">
              Create an account
            </RouterLink>
          </span>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
