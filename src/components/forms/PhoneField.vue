<script setup>
import { computed, watch } from 'vue'
import { vMaska } from 'maska/vue'

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
    default: 'phone',
  },
  label: {
    type: String,
    default: 'Phone',
  },
  error: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '(00) 00000-0000',
  },
  size: {
    type: String,
    default: 'large',
  },
  maxlength: {
    type: [String, Number],
    default: 15,
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
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'update:unmasked'])

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

const validatePhone = (_, value, callback) => {
  if (!value) {
    callback(new Error('Phone is required.'))
    return
  }

  const phoneDigits = props.unmasked || digitsOnly(value)
  if (phoneDigits.length !== 11) {
    callback(new Error('Phone must have 11 digits.'))
    return
  }

  callback()
}

const rules = computed(() => (
  props.validate
    ? [{ required: true, validator: validatePhone, trigger: ['blur', 'change'] }]
    : []
))

const vMaskaPhoneOptions = {
  onMaska: (detail) => {
    emit('update:unmasked', detail?.unmasked || '')
  },
  mask: '(##) #####-####',
}
</script>

<template>
  <ElFormItem :label="label" :prop="prop" :error="error" :rules="rules">
    <ElInput
      v-maska="vMaskaPhoneOptions"
      :model-value="modelValue"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :size="size"
      :maxlength="maxlength"
      @update:model-value="updateModelValue"
    />
  </ElFormItem>
</template>
