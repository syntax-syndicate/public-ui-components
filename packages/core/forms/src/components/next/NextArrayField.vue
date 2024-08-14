<template>
  <div class="array-field">
    <h3>{{ name }}</h3>

    <div class="array-items">
      <div
        v-for="(item, i) in (props.value ?? [])"
        :key="`item-${i}`"
        class="array-item"
      >
        <component
          :is="getFieldComponent(schema.elements)"
          :schema="schema.elements"
          :value="item"
          @update-value="updateItem(i, $event)"
        />

        <KButton
          appearance="tertiary"
          type="button"
          @click="removeItem"
        >
          <RemoveIcon />
        </KButton>
      </div>
    </div>

    <KButton
      appearance="tertiary"
      class="array-add-item"
      type="button"
      @click="handleAddItem"
    >
      Add item
    </KButton>
  </div>
</template>

<script lang="ts" setup>
import { RemoveIcon } from '@kong/icons'
import { type ArrayLikeFieldSchema, type FieldEmits, type FieldProps } from '../../types/next-fields'
import { getFieldComponent, emptyValue } from '../../utils/next-utils'

const props = defineProps<FieldProps<any[], ArrayLikeFieldSchema>>()
const emit = defineEmits<FieldEmits>()

const handleAddItem = () => {
  emit('update-value', [...props.value ?? [], emptyValue(props.schema.elements.type)])
}

const updateItem = (itemIndex: number, itemValue: any) => {
  const array = [...props.value ?? []]
  array.splice(itemIndex, 1, itemValue)
  emit('update-value', array)
}

const removeItem = (itemIndex: number) => {
  const array = [...props.value ?? []]
  array.splice(itemIndex, 1)
  emit('update-value', array)
}
</script>

<style lang="scss" scoped>
.array-field {
  border: 1px dotted black;
  padding: 16px;
  margin: 16px 16px 0;

  .array-items {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .array-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
  }

  .array-add-item {
    margin-top: 16px;
  }
}
</style>
