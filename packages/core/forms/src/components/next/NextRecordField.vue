<template>
  <div class="record-field">
    <div>$record$ {{ name }}</div>

    <div class="record-items" />
    <component
      :is="getFieldComponent(nestedSchema)"
      v-for="[nestedField, nestedSchema] in nestedFields"
      :key="nestedField"
      :name="nestedField"
      :parent-stack="[...parentStack ?? [], nestedField]"
      :schema="nestedSchema"
      :value="value && value[nestedField]"
      @update-value="updateItem(nestedField, $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { type FieldEmits, type FieldProps, type FieldSchema, type RecordFieldSchema } from '../../types/next-fields'
import { getFieldComponent, isEmpty } from '../../utils/next-utils'

const props = defineProps<FieldProps<Record<string, any>, RecordFieldSchema>>()
const emit = defineEmits<FieldEmits>()

const nestedFields = computed(() => {
  const fields: [name: string, schema: FieldSchema][] = []
  for (const field of props.schema.fields) {
    fields.push(Object.entries(field)[0])
  }
  return fields
})

const updateItem = (fieldName: string, fieldValue: string) => {
  // Add a `preserveEmpty` to keep empty fields in the record
  if (isEmpty(fieldValue)) {
    if (props.value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [fieldName]: _, ...rest } = props.value
      emit('update-value', rest)
    }
    return
  }

  emit('update-value', { ...props.value, [fieldName]: fieldValue })
}
</script>

<style lang="scss" scoped>
.record-field {
  border: 1px dotted black;
  padding: 16px;
  margin: 16px 16px 0;

  .record-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
