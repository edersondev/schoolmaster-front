<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  administrativeTypes: {
    type: Array,
    default: () => [],
  },
  legalNatures: {
    type: Array,
    default: () => [],
  },
  managementTypes: {
    type: Array,
    default: () => [],
  },
  pedagogicalApproaches: {
    type: Array,
    default: () => [],
  },
  educationLevels: {
    type: Array,
    default: () => [],
  },
  modalities: {
    type: Array,
    default: () => [],
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
      <h3 class="mb-4 text-lg font-semibold">Institutional Data</h3>
    </div>

    <ElFormItem label="Administrative Type" prop="administrative_type_id">
      <ElSelect
        :model-value="model.administrative_type_id"
        placeholder="Select administrative type"
        @update:model-value="updateModel('administrative_type_id', $event)"
      >
        <ElOption
          v-for="option in administrativeTypes"
          :key="option.id"
          :label="option.label"
          :value="option.id"
        />
      </ElSelect>
    </ElFormItem>

    <ElFormItem label="Legal Nature" prop="legal_nature_id">
      <ElSelect
        :model-value="model.legal_nature_id"
        placeholder="Select legal nature"
        @update:model-value="updateModel('legal_nature_id', $event)"
      >
        <ElOption
          v-for="option in legalNatures"
          :key="option.id"
          :label="option.label"
          :value="option.id"
        />
      </ElSelect>
    </ElFormItem>

    <ElFormItem label="Management Type" prop="management_type_id">
      <ElSelect
        :model-value="model.management_type_id"
        placeholder="Select management type"
        @update:model-value="updateModel('management_type_id', $event)"
      >
        <ElOption
          v-for="option in managementTypes"
          :key="option.id"
          :label="option.label"
          :value="option.id"
        />
      </ElSelect>
    </ElFormItem>

    <ElFormItem label="Pedagogical Approach" prop="pedagogical_approach_id">
      <ElSelect
        :model-value="model.pedagogical_approach_id"
        placeholder="Select pedagogical approach"
        @update:model-value="updateModel('pedagogical_approach_id', $event)"
      >
        <ElOption
          v-for="option in pedagogicalApproaches"
          :key="option.id"
          :label="option.name"
          :value="option.id"
        />
      </ElSelect>
    </ElFormItem>

    <ElFormItem label="Education Levels" prop="education_level_ids">
      <ElSelect
        :model-value="model.education_level_ids"
        placeholder="Select education levels"
        multiple
        collapse-tags
        collapse-tags-tooltip
        @update:model-value="updateModel('education_level_ids', $event)"
      >
        <ElOption
          v-for="option in educationLevels"
          :key="option.id"
          :label="option.name"
          :value="option.id"
        />
      </ElSelect>
    </ElFormItem>

    <ElFormItem label="Modalities" prop="modality_ids">
      <ElSelect
        :model-value="model.modality_ids"
        placeholder="Select modalities"
        multiple
        collapse-tags
        collapse-tags-tooltip
        @update:model-value="updateModel('modality_ids', $event)"
      >
        <ElOption
          v-for="option in modalities"
          :key="option.id"
          :label="option.name"
          :value="option.id"
        />
      </ElSelect>
    </ElFormItem>

    <ElFormItem label="Timezone" prop="timezone">
      <ElInput
        :model-value="model.timezone"
        placeholder="America/Sao_Paulo"
        @update:model-value="updateModel('timezone', $event)"
      />
    </ElFormItem>

    <ElFormItem label="Language" prop="language">
      <ElInput
        :model-value="model.language"
        placeholder="pt-BR"
        @update:model-value="updateModel('language', $event)"
      />
    </ElFormItem>
  </div>
</template>
