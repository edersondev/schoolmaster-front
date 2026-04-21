<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const model = computed(() => props.modelValue || {})

const updateModel = (field, value) => {
  emit('update:modelValue', {
    ...model.value,
    [field]: value,
  })
}
</script>

<template>
  <div class="contents">
    <div class="md:col-span-2">
      <h3 class="mb-4 text-lg font-semibold">Branding</h3>
    </div>

    <ElFormItem label="Logo Path" prop="logo_path">
      <ElInput
        :model-value="model.logo_path"
        placeholder="Path to logo"
        @update:model-value="updateModel('logo_path', $event)"
      />
    </ElFormItem>

    <ElFormItem label="Primary Color" prop="primary_color">
      <ElColorPicker
        :model-value="model.primary_color"
        @update:model-value="updateModel('primary_color', $event)"
      />
    </ElFormItem>

    <ElFormItem label="Secondary Color" prop="secondary_color">
      <ElColorPicker
        :model-value="model.secondary_color"
        @update:model-value="updateModel('secondary_color', $event)"
      />
    </ElFormItem>
  </div>
</template>
