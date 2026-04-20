<script setup>
import { computed, reactive, shallowRef, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

import CnpjField from '@/components/forms/CnpjField.vue'
import PhoneField from '@/components/forms/PhoneField.vue'
import { useUserStore } from '@/stores/userStore'

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

const userStore = useUserStore()
const formRef = shallowRef(null)
const cnpjUnmasked = shallowRef('')
const phoneUnmasked = shallowRef('')

const form = reactive({
  name: '',
  cnpj: '',
  email: '',
  phone: '',
  website: '',
  active: true,
  type: '',
  education_levels: '',
  inep_code: '',
  foundation_date: '',
  description: '',
  owner_id: '',
  logo_path: '',
  primary_color: '',
  secondary_color: '',
})

const typeOptions = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
  { label: 'University', value: 'university' },
]

const educationLevelsOptions = [
  { label: 'Elementary', value: 'elementary' },
  { label: 'High School', value: 'high school' },
  { label: 'College', value: 'college' },
]

const ownerOptions = computed(() => {
  return userStore.users.map(user => ({
    label: user.name,
    value: user.id,
  }))
})

const rules = computed(() => ({
  name: [{ required: true, message: 'Name is required.', trigger: 'blur' }],
  cnpj: [{ required: true, message: 'CNPJ is required.', trigger: 'blur' }],
  email: [
    { type: 'email', message: 'Please enter a valid email address.', trigger: 'blur' },
  ],
  owner_id: [{ required: true, message: 'Owner is required.', trigger: 'change' }],
}))

const digitsOnly = (value) => String(value || '').replace(/\D/g, '')

const hydrateForm = (values) => {
  form.name = values?.name || ''
  form.cnpj = values?.cnpj || ''
  form.email = values?.email || ''
  form.phone = values?.phone || ''
  form.website = values?.website || ''
  form.active = values?.active ?? true
  form.type = values?.type || ''
  form.education_levels = values?.education_levels || ''
  form.inep_code = values?.inep_code || ''
  form.foundation_date = values?.foundation_date || ''
  form.description = values?.description || ''
  form.owner_id = values?.owner_id || ''
  form.logo_path = values?.logo_path || ''
  form.primary_color = values?.primary_color || ''
  form.secondary_color = values?.secondary_color || ''

  cnpjUnmasked.value = digitsOnly(values?.cnpj)
  phoneUnmasked.value = digitsOnly(values?.phone)
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    const payload = { ...form }
    emit('submit', payload)
  } catch (error) {
    ElMessage.error('Please fix the form errors.')
  }
}

const handleCancel = () => {
  emit('cancel')
}

watch(
  () => props.initialValues,
  (values) => {
    if (values) {
      hydrateForm(values)
    }
  },
  { immediate: true }
)

onMounted(async () => {
  try {
    await userStore.fetchUsers()
  } catch (error) {
    ElMessage.error('Failed to load users for owner selection.')
  }
})
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- Basic Information -->
      <div class="md:col-span-2">
        <h3 class="text-lg font-semibold mb-4">Basic Information</h3>
      </div>
      
      <ElFormItem label="Name" prop="name">
        <ElInput v-model="form.name" placeholder="School name" />
      </ElFormItem>

      <CnpjField
        v-model="form.cnpj"
        :unmasked="cnpjUnmasked"
        prop="cnpj"
        label="CNPJ"
      />

      <ElFormItem label="Email" prop="email">
        <ElInput v-model="form.email" placeholder="school@example.com" />
      </ElFormItem>

      <PhoneField
        v-model="form.phone"
        v-model:unmasked="phoneUnmasked"
        prop="phone"
        label="Phone"
        placeholder="(00) 00000-0000"
      />

      <ElFormItem label="Website" prop="website">
        <ElInput v-model="form.website" placeholder="https://school.com" />
      </ElFormItem>

      <ElFormItem label="Active" prop="active">
        <ElSwitch v-model="form.active" />
      </ElFormItem>

      <!-- Institutional Data -->
      <div class="md:col-span-2">
        <h3 class="text-lg font-semibold mb-4">Institutional Data</h3>
      </div>

      <ElFormItem label="Type" prop="type">
        <ElSelect v-model="form.type" placeholder="Select type" clearable>
          <ElOption
            v-for="option in typeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="Education Levels" prop="education_levels">
        <ElSelect v-model="form.education_levels" placeholder="Select levels" clearable>
          <ElOption
            v-for="option in educationLevelsOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="INEP Code" prop="inep_code">
        <ElInput v-model="form.inep_code" placeholder="INEP code" />
      </ElFormItem>

      <ElFormItem label="Foundation Date" prop="foundation_date">
        <ElDatePicker
          v-model="form.foundation_date"
          type="date"
          placeholder="Select date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </ElFormItem>

      <ElFormItem label="Description" prop="description" class="md:col-span-2">
        <ElInput
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="School description"
        />
      </ElFormItem>

      <!-- Ownership -->
      <div class="md:col-span-2">
        <h3 class="text-lg font-semibold mb-4">Ownership</h3>
      </div>

      <ElFormItem label="Owner" prop="owner_id">
        <ElSelect v-model="form.owner_id" placeholder="Select owner" filterable>
          <ElOption
            v-for="option in ownerOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </ElFormItem>

      <!-- Branding -->
      <div class="md:col-span-2">
        <h3 class="text-lg font-semibold mb-4">Branding</h3>
      </div>

      <ElFormItem label="Logo Path" prop="logo_path">
        <ElInput v-model="form.logo_path" placeholder="Path to logo" />
      </ElFormItem>

      <ElFormItem label="Primary Color" prop="primary_color">
        <ElColorPicker v-model="form.primary_color" />
      </ElFormItem>

      <ElFormItem label="Secondary Color" prop="secondary_color">
        <ElColorPicker v-model="form.secondary_color" />
      </ElFormItem>
    </div>

    <div class="mt-8 flex justify-end gap-4">
      <ElButton @click="handleCancel">Cancel</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleSubmit">
        {{ submitLabel }}
      </ElButton>
    </div>
  </ElForm>
</template>
