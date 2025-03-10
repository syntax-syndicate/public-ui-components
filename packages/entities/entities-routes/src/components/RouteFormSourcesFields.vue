<template>
  <div class="routing-rule-container">
    <hr>
    <KLabel :info="t('form.fields.sources.tooltip')">
      {{ t('form.fields.sources.label') }}
    </KLabel>
    <TransitionGroup name="appear">
      <div
        v-for="_, index in fieldsValue"
        :key="index"
        class="routing-rule-input"
      >
        <KInput
          v-model.trim="fieldsValue[index].ip"
          :data-testid="`route-form-sources-ip-input-${index + 1}`"
          :placeholder="t('form.fields.sources.ip.placeholder')"
        />
        <KInput
          v-model.number="fieldsValue[index].port"
          :data-testid="`route-form-sources-port-input-${index + 1}`"
          max="65535"
          min="0"
          :placeholder="t('form.fields.sources.port.placeholder')"
          type="number"
        />
        <RoutingRulesEntitiesControls
          :is-add-disabled="index !== fieldsValue.length - 1"
          :routing-rules-entity="RoutingRulesEntities.SOURCES"
          @add="$emit('add')"
          @remove="$emit('remove', index)"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, watch } from 'vue'
import type { Sources } from '../types'
import { RoutingRulesEntities } from '../types'
import composables from '../composables'
import RoutingRulesEntitiesControls from './RoutingRulesEntitiesControls.vue'

/** Local types, not exported
 * Same pattern used other fields components
 */
type FieldsValue = Sources[]

const props = defineProps({
  modelValue: {
    type: Array as PropType<FieldsValue>,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'add'): void,
  (e: 'remove', index: number): void,
  (e: 'update:modelValue', value: FieldsValue): void,
}>()

const { i18n: { t } } = composables.useI18n()

const fieldsValue = ref<FieldsValue>([])

watch(props.modelValue, (value) => {
  fieldsValue.value = [...value]
}, { immediate: true, deep: true })

watch(fieldsValue, (value) => {
  emit('update:modelValue', value)
}, { deep: true })
</script>

<style lang="scss" scoped>
@use "../styles/mixins" as *;

.routing-rule {
  @include routing-rule;
}
</style>
