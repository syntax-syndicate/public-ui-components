<template>
  <div class="form-field-wrapper">
    <KSelect
      v-bind="$attrs"
      :help="schema.help"
      :items="selectItems"
      :label="name"
      :label-attributes="inputLabelAttributes"
      :model-value="value"
      :placeholder="schema.default"
      :required="schema.required"
      @selected="handleSelected"
    />
  </div>
</template>

<script lang="ts" setup>
import type { SelectItem } from '@kong/kongponents'
import { computed, onBeforeMount } from 'vue'
import type { FieldEmits } from '../../types/next-fields'
import { FieldSchemaType, type FieldProps } from '../../types/next-fields'

const props = defineProps<FieldProps<string | number>>()
const emit = defineEmits<FieldEmits>()

const inputLabelAttributes = computed(() => ({
  info: props.schema.description,
}))

const selectItems = computed(() =>
  props.schema.one_of?.map((value) => ({ label: value.toString(), value } as SelectItem)) ?? [],
)

const handleSelected = (item: SelectItem): void => {
  emit('update-value', item.value)
}

onBeforeMount((): void => {
  switch (props.schema.type) {
    case FieldSchemaType.String:
    case FieldSchemaType.Number:
    case FieldSchemaType.Integer:
      break
    default: {
      console.warn(`[field:select(${props.name})]: invalid schema type '${props.schema.type}'`)
      return
    }
  }

  if (!Array.isArray(props.schema.one_of)) {
    console.warn(`[field:select(${props.name})]: missing 'one_of' in schema`)
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
