<script setup>
import { computed, shallowRef, watch } from 'vue'
import { vMaska } from 'maska/vue'

import schoolService from '@/services/schoolService'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  unmasked: {
    type: String,
    default: '',
  },
  prop: {
    type: String,
    default: 'cnpj',
  },
  label: {
    type: String,
    default: 'CNPJ',
  },
  error: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '00.000.000/0000-00',
  },
  size: {
    type: String,
    default: 'large',
  },
  maxlength: {
    type: [String, Number],
    default: 18,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  validate: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'update:unmasked'])

const isCheckingAvailability = shallowRef(false)

const digitsOnly = (value) => String(value || '').replace(/\D/g, '')

watch(
  () => props.modelValue,
  (value) => {
    emit('update:unmasked', digitsOnly(value))
  },
  { immediate: true }
)

const updateModelValue = (value) => {
  emit('update:modelValue', value)
}

const checkCnpjAvailabilityAPI = async (cnpj) => {
  try {
    isCheckingAvailability.value = true
    await schoolService.checkCnpjAvailability(cnpj)
    return true
  } catch (error) {
    const errorMessage = error?.data?.errors?.cnpj?.[0] || error?.message || 'CNPJ already in use.'
    return new Error(errorMessage)
  } finally {
    isCheckingAvailability.value = false
  }
}

const validateCnpj = async (_, value, callback) => {
  if (!value) {
    callback(new Error('CNPJ is required.'))
    return
  }

  const cnpjDigits = props.unmasked || digitsOnly(value)
  if (cnpjDigits.length !== 14) {
    callback(new Error('CNPJ must have 14 digits.'))
    return
  }

  const response = await checkCnpjAvailabilityAPI(cnpjDigits)
  callback(response instanceof Error ? response : undefined)
}

const rules = computed(() => (
  props.validate
    ? [{ required: true, validator: validateCnpj, trigger: ['blur', 'change'] }]
    : []
))

const vMaskaCnpjOptions = {
  onMaska: (detail) => {
    emit('update:unmasked', detail?.unmasked || '')
  },
  mask: '##.###.###/####-##',
}
</script>

<template>
  <ElFormItem :label="label" :prop="prop" :error="error" :rules="rules">
    <ElInput
      v-maska="vMaskaCnpjOptions"
      :model-value="modelValue"
      :disabled="disabled || isCheckingAvailability"
      :readonly="readonly"
      :placeholder="placeholder"
      :size="size"
      :maxlength="maxlength"
      @update:model-value="updateModelValue"
    />
  </ElFormItem>
</template>
