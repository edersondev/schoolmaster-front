<script setup>
import { computed, onMounted, reactive, shallowRef, watch } from 'vue'

import CpfField from '@/components/forms/CpfField.vue'
import PhoneField from '@/components/forms/PhoneField.vue'
import { useRoleStore } from '@/stores/roleStore'

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  submitLabel: {
    type: String,
    default: 'Save',
  },
})

const emit = defineEmits(['submit', 'cancel'])

const roleStore = useRoleStore()
const formRef = shallowRef(null)
const cpfUnmasked = shallowRef('')
const phoneUnmasked = shallowRef('')

const form = reactive({
  name: '',
  email: '',
  cpf: '',
  phone: '',
  role_id: '',
  status: 1,
  password: '',
})

const formatRoleLabel = (roleName) =>
  String(roleName || '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const roleOptions = computed(() =>
  roleStore.roles.map((role) => ({
    label: formatRoleLabel(role.name),
    value: Number(role.id),
  }))
)

const statusOptions = [
  { label: 'Active', value: 1 },
  { label: 'Inactive', value: 0 },
]

const rules = computed(() => ({
  name: [{ required: true, message: 'Name is required.', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required.', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address.', trigger: 'blur' },
  ],
  role_id: [{ required: true, message: 'Role is required.', trigger: 'change' }],
  status: [{ required: true, message: 'Status is required.', trigger: 'change' }],
  ...(props.isEdit
    ? {}
    : {
        password: [
          { required: true, message: 'Password is required.', trigger: 'blur' },
          { min: 8, message: 'Password must be at least 8 characters.', trigger: 'blur' },
        ],
      }),
}))

const digitsOnly = (value) => String(value || '').replace(/\D/g, '')

const ensureDefaultRole = () => {
  const hasRole = form.role_id !== '' && form.role_id != null
  if (hasRole) {
    return
  }

  const firstRoleOption = roleOptions.value[0]
  if (firstRoleOption) {
    form.role_id = firstRoleOption.value
  }
}

const hydrateForm = (values) => {
  form.name = values?.name || ''
  form.email = values?.email || ''
  form.cpf = values?.cpf || ''
  form.phone = values?.phone || ''
  form.role_id = values?.role_id ?? ''
  form.status = Number(values?.status ?? 1)
  form.password = ''

  cpfUnmasked.value = digitsOnly(values?.cpf)
  phoneUnmasked.value = digitsOnly(values?.phone)
  ensureDefaultRole()
}

watch(
  () => props.initialValues,
  (values) => {
    hydrateForm(values)
  },
  { immediate: true }
)

watch(roleOptions, () => {
  ensureDefaultRole()
})

onMounted(async () => {
  try {
    await roleStore.fetchRoles()
  } catch {
    ensureDefaultRole()
  }
})

const handleSubmit = async () => {
  if (!formRef.value) {
    return
  }

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: phoneUnmasked.value || digitsOnly(form.phone),
    role_id: Number(form.role_id),
    status: Number(form.status),
  }

  if (!props.isEdit) {
    payload.cpf = cpfUnmasked.value || digitsOnly(form.cpf)
    payload.password = form.password
  }

  emit('submit', payload)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-4" @submit.prevent>
    <ElFormItem label="Full name" prop="name">
      <ElInput v-model="form.name" placeholder="User full name" size="large" />
    </ElFormItem>

    <ElFormItem label="Email" prop="email">
      <ElInput v-model="form.email" placeholder="user@schoolmaster.test" size="large" />
    </ElFormItem>

    <CpfField
      v-model="form.cpf"
      v-model:unmasked="cpfUnmasked"
      prop="cpf"
      :readonly="isEdit"
      :validate="!isEdit"
    />

    <PhoneField v-model="form.phone" v-model:unmasked="phoneUnmasked" prop="phone" :validate="true" />

    <ElFormItem label="Role" prop="role_id">
      <ElSelect
        v-model="form.role_id"
        placeholder="Select role"
        size="large"
        :loading="roleStore.loading"
      >
        <ElOption
          v-for="option in roleOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </ElSelect>
    </ElFormItem>

    <ElFormItem label="Status" prop="status">
      <ElSelect v-model="form.status" placeholder="Select status" size="large">
        <ElOption
          v-for="option in statusOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </ElSelect>
    </ElFormItem>

    <ElFormItem v-if="!isEdit" label="Password" prop="password">
      <ElInput v-model="form.password" type="password" placeholder="At least 8 characters" size="large" show-password />
    </ElFormItem>

    <div class="flex justify-end gap-3 pt-2">
      <ElButton class="!h-11 min-w-28 !rounded-xl" :disabled="loading" @click="handleCancel">
        Cancel
      </ElButton>
      <ElButton
        type="primary"
        class="!h-11 min-w-32 !rounded-xl"
        :loading="loading"
        :disabled="loading"
        @click="handleSubmit"
      >
        {{ submitLabel }}
      </ElButton>
    </div>
  </ElForm>
</template>
