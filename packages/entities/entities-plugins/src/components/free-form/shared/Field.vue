<template>
  <component :is="$slots[FIELD_RENDERERS]" />

  <!-- missing schema alert -->
  <KAlert
    v-if="field.error"
    appearance="danger"
    :message="field.error.message"
  />

  <!-- custom rendering -->
  <component
    :is="field.renderer.value"
    v-else-if="field.renderer.value"
    :name="utils.resolveRoot(field.path.value)"
  />

  <template v-else>
    <!-- matched renderer -->
    <component
      :is="fieldRenderer"
      v-if="fieldRenderer"
      :name="utils.resolveRoot(field.path.value)"
    />

    <!-- renderer missing alert -->
    <KAlert
      v-else
      appearance="warning"
      :message="`${field.path.value } ${ field.schema.value!.type } (no renderer yet)`"
    />

    <!-- child elements -->
    <slot />
  </template>
</template>

<script setup lang="ts">
import { computed, toRef, type Slot } from 'vue'
import { useField, FIELD_RENDERERS } from './composables'
import * as utils from './utils'

import StringField from './StringField.vue'
import BooleanField from './BooleanField.vue'
import ArrayField from './ArrayField.vue'
import ObjectField from './ObjectField.vue'
import NumberField from './NumberField.vue'
import EnumField from './EnumField.vue'
import KeyValueField from './KeyValueField.vue'

defineOptions({ name: 'AutoField' })

const props = defineProps<{
  name: string
}>()

defineSlots<
  {
    default?: Slot
    [FIELD_RENDERERS]?: Slot<{ name: string }>
  } & Record<string, Slot<{ name: string }>>
>()

const field = useField(toRef(props, 'name'))

const fieldRenderer = computed(() => {

  switch (field.schema?.value?.type) {
    case 'string':
      return ('one_of' in field.schema.value) ? EnumField : StringField
    case 'boolean':
      return ('one_of' in field.schema.value) ? EnumField : BooleanField
    case 'number':
    case 'integer':
      return ('one_of' in field.schema.value) ? EnumField : NumberField
    case 'array':
      return ArrayField
    case 'set':
      return EnumField
    case 'record':
      return ObjectField
    case 'map':
      return KeyValueField
    default:
      return undefined
  }
})
</script>
