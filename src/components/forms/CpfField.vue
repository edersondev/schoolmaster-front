<script setup>
import { computed, shallowRef, watch } from 'vue'
import { vMaska } from 'maska/vue'

import authService from '@/services/authService'

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
    default: 'cpf',
  },
  label: {
    type: String,
    default: 'CPF',
  },
  error: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '000.000.000-00',
  },
  size: {
    type: String,
    default: 'large',
  },
  maxlength: {
    type: [String, Number],
    default: 14,
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

const checkCpfAvailability = async (cpf) => {
  try {
    isCheckingAvailability.value = true
    await authService.checkCpfAvailability(cpf)
    return true
  } catch (error) {
    const errorMessage = error?.data?.errors?.cpf?.[0] || error?.message || 'Unable to validate CPF.'
    return new Error(errorMessage)
  } finally {
    isCheckingAvailability.value = false
  }
}

const validateCpf = async (_, value, callback) => {
  if (!value) {
    callback(new Error('CPF is required.'))
    return
  }

  const cpfDigits = props.unmasked || digitsOnly(value)
  if (cpfDigits.length !== 11) {
    callback(new Error('CPF must have 11 digits.'))
    return
  }

  const response = await checkCpfAvailability(cpfDigits)
  callback(response instanceof Error ? response : undefined)
}

const rules = computed(() => (
  props.validate
    ? [{ required: true, validator: validateCpf, trigger: ['blur', 'change'] }]
    : []
))

const vMaskaCpfOptions = {
  onMaska: (detail) => {
    emit('update:unmasked', detail?.unmasked || '')
  },
  mask: '###.###.###-##',
}
</script>

<template>
  <ElFormItem :label="label" :prop="prop" :error="error" :rules="rules">
    <ElInput
      v-maska="vMaskaCpfOptions"
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
