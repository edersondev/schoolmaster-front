<script setup>
import { computed, shallowRef, watch } from 'vue'

import CnpjField from '@/components/forms/CnpjField.vue'
import PhoneField from '@/components/forms/PhoneField.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const cnpjUnmasked = shallowRef('')
const phoneUnmasked = shallowRef('')

const statusOptions = [
  { label: 'Active', value: 1 },
  { label: 'Inactive', value: 0 },
]

const model = computed(() => props.modelValue || {})

const updateModel = (field, value) => {
  emit('update:modelValue', {
    ...model.value,
    [field]: value,
  })
}

const digitsOnly = (value) => String(value || '').replace(/\D/g, '')

watch(
  () => model.value.document,
  (value) => {
    cnpjUnmasked.value = digitsOnly(value)
  },
  { immediate: true }
)

watch(
  () => model.value.phone,
  (value) => {
    phoneUnmasked.value = digitsOnly(value)
  },
  { immediate: true }
)
</script>

<template>
  <div class="contents">
    <div class="md:col-span-2">
      <h3 class="mb-4 text-lg font-semibold">Basic Information</h3>
    </div>

    <ElFormItem label="INEP Code" prop="inep_code">
      <ElInput
        :model-value="model.inep_code"
        placeholder="INEP code"
        @update:model-value="updateModel('inep_code', $event)"
      />
    </ElFormItem>

    <ElFormItem label="Status" prop="status">
      <ElSelect
        :model-value="model.status"
        placeholder="Select status"
        @update:model-value="updateModel('status', $event)"
      >
        <ElOption
          v-for="option in statusOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </ElSelect>
    </ElFormItem>

    <ElFormItem label="Name" prop="name">
      <ElInput
        :model-value="model.name"
        placeholder="School name"
        @update:model-value="updateModel('name', $event)"
      />
    </ElFormItem>

    <ElFormItem label="Trade Name" prop="trade_name">
      <ElInput
        :model-value="model.trade_name"
        placeholder="Trade name"
        @update:model-value="updateModel('trade_name', $event)"
      />
    </ElFormItem>

    <ElFormItem label="Legal Name" prop="legal_name" class="md:col-span-2">
      <ElInput
        :model-value="model.legal_name"
        placeholder="Legal name"
        @update:model-value="updateModel('legal_name', $event)"
      />
    </ElFormItem>

    <CnpjField
      :model-value="model.document"
      :unmasked="cnpjUnmasked"
      :readonly="isEdit"
      :validate="!isEdit"
      prop="document"
      label="CNPJ"
      @update:model-value="updateModel('document', $event)"
      @update:unmasked="cnpjUnmasked = $event"
    />

    <ElFormItem label="Email" prop="email">
      <ElInput
        :model-value="model.email"
        placeholder="school@example.com"
        @update:model-value="updateModel('email', $event)"
      />
    </ElFormItem>

    <PhoneField
      :model-value="model.phone"
      :unmasked="phoneUnmasked"
      prop="phone"
      label="Phone"
      placeholder="(00) 00000-0000"
      @update:model-value="updateModel('phone', $event)"
      @update:unmasked="phoneUnmasked = $event"
    />

    <ElFormItem label="Website" prop="website">
      <ElInput
        :model-value="model.website"
        placeholder="https://school.com"
        @update:model-value="updateModel('website', $event)"
      />
    </ElFormItem>

    <ElFormItem label="Description" prop="description" class="md:col-span-2">
      <ElInput
        :model-value="model.description"
        type="textarea"
        :rows="3"
        placeholder="School description"
        @update:model-value="updateModel('description', $event)"
      />
    </ElFormItem>
  </div>
</template>
