
<template>
  <div class="form-field-wrapper">
    <KInput
      v-bind="$attrs"
      :help="schema.help"
      :label="name"
      :label-attributes="inputLabelAttributes"
      :max="maxValue"
      :min="minValue"
      :model-value="value"
      :placeholder="schema.default"
      :required="schema.required"
      :type="inputType"
      @update:model-value="handleValueUpdate"
    />

    <!-- autofill -->
    <component
      :is="autofillSlot"
      :schema="schema"
      :update="handleValueUpdate"
      :value="value"
    />
  </div>
</template>

<script lang="ts" setup>
/**
 * `pattern` does not work automatically because it comes from Lua
 */
import isNumber from 'lodash-es/isNumber'
import { computed, inject, onBeforeMount } from 'vue'
import { AUTOFILL_SLOT } from '../../const'
import type { AutofillSlot } from '../../types'
import type { FieldEmits } from '../../types/next-fields'
import { FieldSchemaType, isNumberLikeField, type FieldProps } from '../../types/next-fields'

const props = defineProps<FieldProps<string | number>>()
const emit = defineEmits<FieldEmits>()

const autofillSlot = inject<AutofillSlot | undefined>(AUTOFILL_SLOT, undefined)

const inputType = computed((): string => {
  if (isNumberLikeField(props.schema)) {
    return 'number'
  }
  return 'text'
})

const inputLabelAttributes = computed(() => ({
  info: props.schema.description,
}))

const minValue = computed((): number | undefined => {
  if (isNumberLikeField(props.schema)) {
    return props.schema.between?.[0]
  }
  return undefined
})

const maxValue = computed((): number | undefined => {
  if (isNumberLikeField(props.schema)) {
    return props.schema.between?.[1]
  }
  return undefined
})

// parse numeric values, track new input value, and emit model updated event
const handleValueUpdate = (val: string): void => {
  let formattedVal: string | number = val
  if (isNumberLikeField(props.schema)) {
    if (isNumber(parseFloat(val))) {
      formattedVal = parseFloat(val)
    }
  }
  emit('update-value', formattedVal)
}

onBeforeMount((): void => {
  switch (props.schema.type) {
    case FieldSchemaType.String:
    case FieldSchemaType.Number:
    case FieldSchemaType.Integer:
      break
    default:{
      console.warn(`FieldInput: Invalid schema type '${props.schema.type}'`)
    }
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
