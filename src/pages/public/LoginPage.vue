<script setup>
import { reactive, shallowRef } from 'vue'

import PublicLayout from '@/components/layouts/PublicLayout.vue'

const formRef = shallowRef(null)
const isSubmitting = shallowRef(false)
const isSuccess = shallowRef(false)

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

  isSuccess.value = false

  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  isSubmitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 400))
  isSubmitting.value = false
  isSuccess.value = true
  formRef.value.resetFields()
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
          <ElFormItem label="Email" prop="email">
            <ElInput v-model="form.email" placeholder="you@example.com" size="large" />
          </ElFormItem>

          <ElFormItem label="Password" prop="password">
            <ElInput v-model="form.password" type="password" placeholder="Enter your password" size="large" show-password />
          </ElFormItem>

          <ElButton type="primary" class="w-full !h-11 !rounded-xl" :loading="isSubmitting" @click="handleSubmit">
            Sign in
          </ElButton>
        </ElForm>

        <div v-if="isSuccess" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          You are signed in. Welcome back!
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
