<template>
  <div class="form-field-wrapper">
    <KCheckbox
      v-bind="$attrs"
      :help="schema.help"
      :label="name"
      :label-attributes="inputLabelAttributes"
      :model-value="value ?? false"
      :required="schema.required"
      @update:model-value="emit('update-value', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { reportPossibleSchemaType, reportWarning } from '../../utils/next-utils'
import { computed, onBeforeMount } from 'vue'
import type { FieldEmits } from '../../types/next-fields'
import { FieldSchemaType, type FieldProps } from '../../types/next-fields'

const props = defineProps<FieldProps<boolean>>()
const emit = defineEmits<FieldEmits>()

const inputLabelAttributes = computed(() => ({
  info: props.schema.description,
}))

onBeforeMount((): void => {
  switch (props.schema.type) {
    case FieldSchemaType.Boolean:
      break
    default:{
      reportPossibleSchemaType('CheckboxField', props.schema.type)
    }
  }

  if (props.schema.required) {
    reportWarning('CheckboxField', 'It is redundant to set `required` on a checkbox field because the state is always provided.')
  }
})
</script>

<style lang="scss" scoped>
.form-field-wrapper {
  width: 100%;

  :deep(input[type="radio"]) {
    width: 100%;
  }

  :deep(input[type="color"]) {
    width: 60px;
  }

  :deep(input[type="range"]) {
    padding: $kui-space-0;
  }
}
</style>
