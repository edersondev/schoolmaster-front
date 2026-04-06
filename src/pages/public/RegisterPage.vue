<script setup>
import { reactive, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { vMaska } from "maska/vue"

import PublicLayout from '@/components/layouts/PublicLayout.vue'
import authService from '@/services/authService'

const formRef = shallowRef(null)
const isSubmitting = shallowRef(false)
const submitError = shallowRef('')

const phoneUnmasked = shallowRef('')
const cpfUnmasked = shallowRef('')
const isCpfInputDisabled = shallowRef(false)

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  cpf: '',
  phone: '',
})

const fieldErrors = reactive({})

const validateCpf = async (_, value, callback) => {
  if (!value) {
    callback(new Error('CPF is required.'))
    return
  }

  if (cpfUnmasked.value.length !== 11) {
    callback(new Error('CPF must have 11 digits.'))
    return
  }

  const response = await checkCpfAvailability()
  callback(response instanceof Error ? response : undefined)
}

const validatePhoneFormat = (_, value, callback) => {
  if (!value) {
    callback(new Error('Phone is required.'))
    return
  }

  if (phoneUnmasked.value.length !== 11) {
    callback(new Error('Phone must have 11 digits.'))
    return
  }

  callback()
}

const rules = {
  name: [{ required: true, message: 'Name is required.', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required.', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address.', trigger: 'blur' },
  ],
  password: [{ required: true, message: 'Password is required.', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: 'Please confirm your password.', trigger: 'blur' },
    { validator: (_, value, callback) => {
        if (value !== form.password) {
          callback(new Error('Passwords do not match.'))
        } else {
          callback()
        }
      }, trigger: 'blur' },
  ],
  cpf: [{ required: true, validator: validateCpf, trigger: ['blur', 'change'] }],
  phone: [{ required: true, validator: validatePhoneFormat, trigger: ['blur'] }],
}

const checkCpfAvailability = async () => {
  try {
    isCpfInputDisabled.value = true
    await authService.checkCpfAvailability(cpfUnmasked.value)
    return true
  } catch (error) {
    const errorMessage = error?.data?.errors?.cpf?.[0] || error?.message || 'Unable to validate CPF.'
    return new Error(errorMessage)
  } finally {
    isCpfInputDisabled.value = false
  }
}

const vMaskaPhoneOptions = {
  onMaska: (detail) => phoneUnmasked.value = detail?.unmasked,
  mask: '(##) #####-####',
}

const vMaskaCpfOptions = {
  onMaska: (detail) => cpfUnmasked.value = detail?.unmasked,
  mask: '###.###.###-##',
}

const handleSubmit = async () => {
  if (!formRef.value) return

  submitError.value = ''

  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  isSubmitting.value = true

  try {
    await authService.register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      confirm_password: form.confirmPassword,
      cpf: cpfUnmasked.value,
      phone: phoneUnmasked.value,
    })

    formRef.value.resetFields()
    cpfUnmasked.value = ''
    phoneUnmasked.value = ''

    await router.push('/register/pending')
  } catch (error) {
    submitError.value = error?.message || 'Unable to create your account.'

    if (error?.status === 422 && error?.data?.errors) {
      Object.keys(error.data.errors).forEach(key => {
        fieldErrors[key] = error.data.errors[key]?.[0] || ''
      })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <PublicLayout>
    <section class="flex min-h-[60vh] items-center justify-center">
      <div class="w-full max-w-md space-y-6">
        <header class="space-y-2 text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted)]">Get started</p>
          <h1 class="text-2xl font-semibold text-[color:var(--color-foreground)]">Create your account</h1>
          <p class="text-sm text-[color:var(--color-muted)]">Set up your profile in a minute.</p>
        </header>

        <ElForm ref="formRef" :model="form" :rules="rules" status-icon label-position="top" class="space-y-4">
          <ElFormItem label="Full name" prop="name" :error="fieldErrors?.name">
            <ElInput v-model="form.name" placeholder="Your name" size="large" />
          </ElFormItem>

          <ElFormItem label="Email" prop="email" :error="fieldErrors?.email">
            <ElInput v-model="form.email" placeholder="you@example.com" size="large" />
          </ElFormItem>

          <ElFormItem label="CPF" prop="cpf" :error="fieldErrors?.cpf">
            <ElInput
              v-maska="vMaskaCpfOptions"
              v-model="form.cpf"
              :disabled="isCpfInputDisabled"
              placeholder="000.000.000-00"
              size="large"
              maxlength="14"
            />
          </ElFormItem>

          <ElFormItem label="Phone" prop="phone" :error="fieldErrors?.phone">
            <ElInput
              v-maska="vMaskaPhoneOptions"
              v-model="form.phone"
              placeholder="(00) 00000-0000"
              size="large"
              maxlength="15"
            />
          </ElFormItem>

          <ElFormItem label="Password" prop="password" :error="fieldErrors?.password">
            <ElInput v-model="form.password" type="password" placeholder="Create a password" size="large" show-password />
          </ElFormItem>

          <ElFormItem label="Confirm Password" prop="confirmPassword" :error="fieldErrors?.confirm_password">
            <ElInput v-model="form.confirmPassword" type="password" placeholder="Confirm your password" size="large" show-password />
          </ElFormItem>

          <ElButton type="primary" class="w-full !h-11 !rounded-xl" :loading="isSubmitting" @click="handleSubmit">
            Create account
          </ElButton>
        </ElForm>

        <div v-if="submitError" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {{ submitError }}
        </div>

        <div class="flex flex-col items-center gap-2 text-sm text-[color:var(--color-muted)]">
          <span>
            Already have an account?
            <RouterLink class="font-medium text-[color:var(--color-foreground)]" to="/login">
              Sign in
            </RouterLink>
          </span>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
