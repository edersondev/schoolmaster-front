<script setup>
import { computed, inject, nextTick, shallowRef, watch } from 'vue'
import { vMaska } from 'maska/vue'
import { formContextKey } from 'element-plus'

import schoolService from '@/services/schoolService'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
    }),
  },
  title: {
    type: String,
    default: '',
  },
  propPrefix: {
    type: String,
    default: '',
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const model = computed(() => props.modelValue || {})
const formContext = inject(formContextKey, undefined)

const zipCodeMasked = shallowRef(model.value.zip_code || '')
const isLookingUpZipCode = shallowRef(false)
const zipCodeLookupRequestId = shallowRef(0)
const hasUserEditedZipCode = shallowRef(false)

const digitsOnly = (value) => String(value || '').replace(/\D/g, '')

const formProp = (field) => `${props.propPrefix}${field}`
const autoFilledFieldNames = ['zip_code', 'street', 'neighborhood', 'city', 'state']

const updateModel = (field, value) => {
  emit('update:modelValue', {
    ...model.value,
    [field]: value,
  })
}

const updateAddressNumber = (value) => {
  updateModel('number', digitsOnly(value))
}

const setAutoFilledFields = (value = {}) => {
  emit('update:modelValue', {
    ...model.value,
    street: value.street ?? '',
    neighborhood: value.neighborhood ?? '',
    city: value.city ?? '',
    state: value.state ?? '',
  })
}

const clearAutoFilledFields = () => {
  setAutoFilledFields()
}

const clearAddressValidation = async () => {
  await nextTick()
  formContext?.clearValidate(autoFilledFieldNames.map(formProp))
}

const vMaskaZipCodeOptions = {
  mask: '#####-###',
}

watch(
  () => model.value.zip_code,
  (value) => {
    const zipCodeDigits = digitsOnly(value)

    if (digitsOnly(zipCodeMasked.value) !== zipCodeDigits) {
      zipCodeMasked.value = zipCodeDigits
    }
  },
  { immediate: true }
)

watch(
  zipCodeMasked,
  (value) => {
    const zipCodeDigits = digitsOnly(value)

    if (zipCodeDigits !== digitsOnly(model.value.zip_code)) {
      hasUserEditedZipCode.value = true
      updateModel('zip_code', zipCodeDigits)
    }
  }
)

watch(
  () => digitsOnly(model.value.zip_code),
  async (zipCodeDigits) => {
    zipCodeLookupRequestId.value += 1
    const requestId = zipCodeLookupRequestId.value

    if (props.isEdit && !hasUserEditedZipCode.value) {
      isLookingUpZipCode.value = false
      return
    }

    if (props.isEdit) {
      clearAutoFilledFields()
    }

    if (zipCodeDigits.length !== 8 || props.disabled || props.readonly) {
      isLookingUpZipCode.value = false
      clearAutoFilledFields()
      return
    }

    isLookingUpZipCode.value = true

    try {
      const response = await schoolService.getAddressByZipCode(zipCodeDigits)

      if (requestId !== zipCodeLookupRequestId.value) {
        return
      }

      setAutoFilledFields(response || {})
      await clearAddressValidation()
    } catch {
      if (requestId !== zipCodeLookupRequestId.value) {
        return
      }

      clearAutoFilledFields()
    } finally {
      if (requestId === zipCodeLookupRequestId.value) {
        isLookingUpZipCode.value = false
      }
    }
  }
)
</script>

<template>
  <div class="contents">
    <div v-if="title" class="md:col-span-2">
      <h3 class="mb-4 text-lg font-semibold">{{ title }}</h3>
    </div>

    <ElFormItem label="Zip Code" :prop="formProp('zip_code')">
      <ElInput
        v-maska="vMaskaZipCodeOptions"
        v-model="zipCodeMasked"
        placeholder="00000-000"
        inputmode="numeric"
        :maxlength="9"
        :disabled="disabled || isLookingUpZipCode"
        :readonly="readonly"
      />
    </ElFormItem>

    <ElFormItem label="Street" :prop="formProp('street')">
      <ElInput
        :model-value="model.street"
        placeholder="Street"
        :disabled="disabled"
        readonly
        @update:model-value="updateModel('street', $event)"
      />
    </ElFormItem>

    <ElFormItem label="Number" :prop="formProp('number')">
      <ElInput
        :model-value="model.number"
        placeholder="Number"
        inputmode="numeric"
        :disabled="disabled"
        :readonly="readonly"
        @update:model-value="updateAddressNumber"
      />
    </ElFormItem>

    <ElFormItem label="Complement" :prop="formProp('complement')">
      <ElInput
        :model-value="model.complement"
        placeholder="Complement"
        :disabled="disabled"
        :readonly="readonly"
        @update:model-value="updateModel('complement', $event)"
      />
    </ElFormItem>

    <ElFormItem label="Neighborhood" :prop="formProp('neighborhood')">
      <ElInput
        :model-value="model.neighborhood"
        placeholder="Neighborhood"
        :disabled="disabled"
        readonly
        @update:model-value="updateModel('neighborhood', $event)"
      />
    </ElFormItem>

    <ElFormItem label="City" :prop="formProp('city')">
      <ElInput
        :model-value="model.city"
        placeholder="City"
        :disabled="disabled"
        readonly
        @update:model-value="updateModel('city', $event)"
      />
    </ElFormItem>

    <ElFormItem label="State" :prop="formProp('state')">
      <ElInput
        :model-value="model.state"
        placeholder="State"
        :disabled="disabled"
        readonly
        @update:model-value="updateModel('state', $event)"
      />
    </ElFormItem>

    <ElFormItem label="Country" :prop="formProp('country')">
      <ElInput
        :model-value="model.country"
        placeholder="Country"
        :disabled="disabled"
        :readonly="readonly"
        @update:model-value="updateModel('country', $event)"
      />
    </ElFormItem>
  </div>
</template>
