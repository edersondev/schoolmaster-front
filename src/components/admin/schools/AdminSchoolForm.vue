<script setup>
import { computed, reactive, shallowRef, watch } from 'vue'
import { ElMessage } from 'element-plus'

import AdminSchoolBasicInfoGroup from '@/components/admin/schools/AdminSchoolBasicInfoGroup.vue'
import AdminSchoolInstitutionalDataGroup from '@/components/admin/schools/AdminSchoolInstitutionalDataGroup.vue'
import AdminSchoolBrandingGroup from '@/components/admin/schools/AdminSchoolBrandingGroup.vue'
import AddressFormGroup from '@/components/forms/AddressFormGroup.vue'

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  referenceData: {
    type: Object,
    default: () => ({
      administrativeTypes: [],
      legalNatures: [],
      managementTypes: [],
      educationLevels: [],
      modalities: [],
      pedagogicalApproaches: [],
    }),
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

const formRef = shallowRef(null)

const toNumberOrNull = (value) => {
  const parsed = Number(value || 0)
  return parsed || null
}

const toNumberArray = (value) => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => Number(item))
    .filter(Boolean)
}

const form = reactive({
  inep_code: '',
  name: '',
  trade_name: '',
  legal_name: '',
  document: '',
  email: '',
  phone: '',
  website: '',
  description: '',
  administrative_type_id: null,
  legal_nature_id: null,
  management_type_id: null,
  pedagogical_approach_id: null,
  status: 1,
  timezone: 'America/Sao_Paulo',
  language: 'pt-BR',
  education_level_ids: [],
  modality_ids: [],
  logo_path: '',
  primary_color: '#1D4ED8',
  secondary_color: '#F59E0B',
  address_street: '',
  address_number: '',
  address_complement: '',
  address_neighborhood: '',
  address_city: '',
  address_state: '',
  address_zip_code: '',
  address_country: 'Brazil',
})

const administrativeTypeOptions = computed(() => props.referenceData.administrativeTypes || [])
const legalNatureOptions = computed(() => props.referenceData.legalNatures || [])
const managementTypeOptions = computed(() => props.referenceData.managementTypes || [])
const pedagogicalApproachOptions = computed(() => props.referenceData.pedagogicalApproaches || [])
const educationLevelsOptions = computed(() => props.referenceData.educationLevels || [])
const modalityOptions = computed(() => props.referenceData.modalities || [])

const rules = computed(() => ({
  inep_code: [{ required: true, message: 'INEP code is required.', trigger: 'blur' }],
  name: [{ required: true, message: 'Name is required.', trigger: 'blur' }],
  document: props.isEdit ? [] : [{ required: true, message: 'CNPJ is required.', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required.', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address.', trigger: 'blur' },
  ],
  status: [{ required: true, message: 'Status is required.', trigger: 'change' }],
  administrative_type_id: [{ required: true, message: 'Administrative type is required.', trigger: 'change' }],
  legal_nature_id: [{ required: true, message: 'Legal nature is required.', trigger: 'change' }],
  management_type_id: [{ required: true, message: 'Management type is required.', trigger: 'change' }],
  pedagogical_approach_id: [{ required: true, message: 'Pedagogical approach is required.', trigger: 'change' }],
  education_level_ids: [{ required: true, message: 'Education level is required.', trigger: 'change' }],
  modality_ids: [{ required: true, message: 'At least one modality is required.', trigger: 'change' }],
  address_street: [{ required: true, message: 'Street is required.', trigger: 'blur' }],
  address_city: [{ required: true, message: 'City is required.', trigger: 'blur' }],
  address_state: [{ required: true, message: 'State is required.', trigger: 'blur' }],
  address_zip_code: [{ required: true, message: 'Zip code is required.', trigger: 'blur' }],
  address_country: [{ required: true, message: 'Country is required.', trigger: 'blur' }],
}))

const digitsOnly = (value) => String(value || '').replace(/\D/g, '')

const basicInfoModel = computed({
  get: () => ({
    inep_code: form.inep_code,
    status: form.status,
    name: form.name,
    trade_name: form.trade_name,
    legal_name: form.legal_name,
    document: form.document,
    email: form.email,
    phone: form.phone,
    website: form.website,
    description: form.description,
  }),
  set: (value = {}) => {
    form.inep_code = value.inep_code ?? ''
    form.status = Number(value.status ?? 1)
    form.name = value.name ?? ''
    form.trade_name = value.trade_name ?? ''
    form.legal_name = value.legal_name ?? ''
    form.document = value.document ?? ''
    form.email = value.email ?? ''
    form.phone = value.phone ?? ''
    form.website = value.website ?? ''
    form.description = value.description ?? ''
  },
})

const institutionalDataModel = computed({
  get: () => ({
    administrative_type_id: form.administrative_type_id,
    legal_nature_id: form.legal_nature_id,
    management_type_id: form.management_type_id,
    pedagogical_approach_id: form.pedagogical_approach_id,
    education_level_ids: form.education_level_ids,
    modality_ids: form.modality_ids,
    timezone: form.timezone,
    language: form.language,
  }),
  set: (value = {}) => {
    form.administrative_type_id = toNumberOrNull(value.administrative_type_id)
    form.legal_nature_id = toNumberOrNull(value.legal_nature_id)
    form.management_type_id = toNumberOrNull(value.management_type_id)
    form.pedagogical_approach_id = toNumberOrNull(value.pedagogical_approach_id)
    form.education_level_ids = toNumberArray(value.education_level_ids)
    form.modality_ids = toNumberArray(value.modality_ids)
    form.timezone = value.timezone ?? 'America/Sao_Paulo'
    form.language = value.language ?? 'pt-BR'
  },
})

const addressModel = computed({
  get: () => ({
    street: form.address_street,
    number: form.address_number,
    complement: form.address_complement,
    neighborhood: form.address_neighborhood,
    city: form.address_city,
    state: form.address_state,
    zip_code: form.address_zip_code,
    country: form.address_country,
  }),
  set: (value = {}) => {
    form.address_street = value.street ?? ''
    form.address_number = value.number ?? ''
    form.address_complement = value.complement ?? ''
    form.address_neighborhood = value.neighborhood ?? ''
    form.address_city = value.city ?? ''
    form.address_state = value.state ?? ''
    form.address_zip_code = value.zip_code ?? ''
    form.address_country = value.country ?? 'Brazil'
  },
})

const brandingModel = computed({
  get: () => ({
    logo_path: form.logo_path,
    primary_color: form.primary_color,
    secondary_color: form.secondary_color,
  }),
  set: (value = {}) => {
    form.logo_path = value.logo_path ?? ''
    form.primary_color = value.primary_color ?? '#1D4ED8'
    form.secondary_color = value.secondary_color ?? '#F59E0B'
  },
})

const hydrateForm = (values) => {
  const address = values?.address || {}

  form.inep_code = values?.inep_code || ''
  form.name = values?.name || ''
  form.trade_name = values?.trade_name || ''
  form.legal_name = values?.legal_name || ''
  form.document = values?.document || values?.cnpj || ''
  form.email = values?.email || ''
  form.phone = values?.phone || ''
  form.website = values?.website || ''
  form.description = values?.description || ''
  form.administrative_type_id = toNumberOrNull(values?.administrative_type_id)
  form.legal_nature_id = toNumberOrNull(values?.legal_nature_id)
  form.management_type_id = toNumberOrNull(values?.management_type_id)
  form.pedagogical_approach_id = toNumberOrNull(values?.pedagogical_approach_id)
  form.status = Number(values?.status ?? 1)
  form.timezone = values?.timezone || 'America/Sao_Paulo'
  form.language = values?.language || 'pt-BR'
  form.education_level_ids = toNumberArray(values?.education_level_ids)
  form.modality_ids = toNumberArray(values?.modality_ids)
  form.logo_path = values?.logo_path || ''
  form.primary_color = values?.primary_color || '#1D4ED8'
  form.secondary_color = values?.secondary_color || '#F59E0B'

  form.address_street = address?.street || ''
  form.address_number = address?.number || ''
  form.address_complement = address?.complement || ''
  form.address_neighborhood = address?.neighborhood || ''
  form.address_city = address?.city || ''
  form.address_state = address?.state || ''
  form.address_zip_code = address?.zip_code || ''
  form.address_country = address?.country || 'Brazil'
}

const serializePayload = () => {
  const payload = {
    inep_code: String(form.inep_code || '').trim(),
    name: String(form.name || '').trim(),
    trade_name: String(form.trade_name || '').trim(),
    legal_name: String(form.legal_name || '').trim(),
    email: String(form.email || '').trim(),
    phone: digitsOnly(form.phone),
    website: String(form.website || '').trim(),
    description: String(form.description || '').trim(),
    administrative_type_id: Number(form.administrative_type_id),
    legal_nature_id: Number(form.legal_nature_id),
    management_type_id: Number(form.management_type_id),
    pedagogical_approach_id: Number(form.pedagogical_approach_id),
    status: Number(form.status),
    timezone: String(form.timezone || '').trim(),
    language: String(form.language || '').trim(),
    education_level_ids: toNumberArray(form.education_level_ids),
    modality_ids: toNumberArray(form.modality_ids),
    logo_path: String(form.logo_path || '').trim() || null,
    primary_color: String(form.primary_color || '').trim(),
    secondary_color: String(form.secondary_color || '').trim(),
    address: {
      street: String(form.address_street || '').trim(),
      number: String(form.address_number || '').trim(),
      complement: String(form.address_complement || '').trim() || null,
      neighborhood: String(form.address_neighborhood || '').trim(),
      city: String(form.address_city || '').trim(),
      state: String(form.address_state || '').trim(),
      zip_code: String(form.address_zip_code || '').trim(),
      country: String(form.address_country || '').trim(),
    },
  }

  if (!props.isEdit) {
    payload.document = digitsOnly(form.document)
  }

  return payload
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    emit('submit', serializePayload())
  } catch {
    ElMessage.error('Please fix the form errors.')
  }
}

const handleCancel = () => {
  emit('cancel')
}

watch(
  () => props.initialValues,
  (values) => {
    hydrateForm(values || {})
  },
  { immediate: true }
)
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <AdminSchoolBasicInfoGroup
        v-model="basicInfoModel"
        :is-edit="isEdit"
      />

      <AdminSchoolInstitutionalDataGroup
        v-model="institutionalDataModel"
        :administrative-types="administrativeTypeOptions"
        :legal-natures="legalNatureOptions"
        :management-types="managementTypeOptions"
        :pedagogical-approaches="pedagogicalApproachOptions"
        :education-levels="educationLevelsOptions"
        :modalities="modalityOptions"
      />

      <AddressFormGroup
        v-model="addressModel"
        title="Address"
        prop-prefix="address_"
      />

      <AdminSchoolBrandingGroup v-model="brandingModel" />
    </div>

    <div class="mt-8 flex justify-end gap-4">
      <ElButton @click="handleCancel">Cancel</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleSubmit">
        {{ submitLabel }}
      </ElButton>
    </div>
  </ElForm>
</template>
