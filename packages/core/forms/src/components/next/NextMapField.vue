<template>
  <div class="map-field">
    <h3>{{ name }}</h3>

    <component
      :is="getFieldComponent(schema.values)"
      v-for="(val, key) in value"
      :key="`item-${key}`"
      :name="key"
      :schema="schema.values"
      :value="val"
      @update-value="updateItem(key, $event)"
    />

    <hr>

    <div class="map-add-key-wrapper">
      <component
        :is="getFieldComponent(schema.keys)"
        :schema="schema.keys"
        :value="keyToAdd"
        @update-value="keyToAdd = $event.trim()"
      />

      <KButton
        appearance="tertiary"
        class="array-add-item"
        :disabled="!canAddKey"
        type="button"
        @click="addKey"
      >
        Add key
      </KButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { FieldSchemaType, type FieldEmits, type FieldProps, type MapFieldSchema } from '../../types/next-fields'
import { emptyValue, getFieldComponent, reportWarning } from '../../utils/next-utils'

const props = defineProps<FieldProps<Record<any, any>, MapFieldSchema>>()
const emit = defineEmits<FieldEmits>()

const keyToAdd = ref<string | number | undefined>()

const addKey = () => {
  if (keyToAdd.value === undefined) {
    return
  }

  emit('update-value', { ...props.value, [keyToAdd.value]: emptyValue(props.schema.values.type) })
  keyToAdd.value = emptyValue(props.schema.keys.type)
}

const updateItem = (key: string, val: string) => {
  // Add a `preserveEmpty` to keep empty fields in the record
  emit('update-value', { ...props.value, [key]: val })
}

const canAddKey = computed(() =>
  keyToAdd.value !== undefined && keyToAdd.value !== '' &&
  (props.value === undefined || !Object.prototype.hasOwnProperty.call(props.value, keyToAdd.value)),
)

onMounted(() => {
  switch (props.schema.keys.type) {
    case FieldSchemaType.String:
    case FieldSchemaType.Number:
    case FieldSchemaType.Integer:
      break
    default:
      reportWarning('MapField', 'Possible invalid key type:', props.schema.keys.type)
      return
  }
})

watch(() => props.schema.keys.type, () => {
  keyToAdd.value = emptyValue(props.schema.keys.type)
})
</script>

<style lang="scss" scoped>
.map-field {
  border: 1px dotted black;
  padding: 16px;
  margin: 16px 16px 0;

  .map-add-key-wrapper {
    display: flex;
    gap: 16px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
