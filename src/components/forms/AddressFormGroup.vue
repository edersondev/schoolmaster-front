<script setup>
import { computed } from 'vue'
import { vMaska } from 'maska/vue'

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

const digitsOnly = (value) => String(value || '').replace(/\D/g, '')

const formProp = (field) => `${props.propPrefix}${field}`

const updateModel = (field, value) => {
  emit('update:modelValue', {
    ...model.value,
    [field]: value,
  })
}

const updateAddressNumber = (value) => {
  updateModel('number', digitsOnly(value))
}

const updateAddressZipCode = (value) => {
  updateModel('zip_code', digitsOnly(value))
}
</script>

<template>
  <div class="contents">
    <div v-if="title" class="md:col-span-2">
      <h3 class="mb-4 text-lg font-semibold">{{ title }}</h3>
    </div>

    <ElFormItem label="Street" :prop="formProp('street')">
      <ElInput
        :model-value="model.street"
        placeholder="Street"
        :disabled="disabled"
        :readonly="readonly"
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
        :readonly="readonly"
        @update:model-value="updateModel('neighborhood', $event)"
      />
    </ElFormItem>

    <ElFormItem label="City" :prop="formProp('city')">
      <ElInput
        :model-value="model.city"
        placeholder="City"
        :disabled="disabled"
        :readonly="readonly"
        @update:model-value="updateModel('city', $event)"
      />
    </ElFormItem>

    <ElFormItem label="State" :prop="formProp('state')">
      <ElInput
        :model-value="model.state"
        placeholder="State"
        :disabled="disabled"
        :readonly="readonly"
        @update:model-value="updateModel('state', $event)"
      />
    </ElFormItem>

    <ElFormItem label="Zip Code" :prop="formProp('zip_code')">
      <ElInput
        v-maska="'#####-###'"
        :model-value="model.zip_code"
        placeholder="00000-000"
        inputmode="numeric"
        :maxlength="9"
        :disabled="disabled"
        :readonly="readonly"
        @update:model-value="updateAddressZipCode"
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
