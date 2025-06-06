<template>
  <div class="sc-form-pinned-fields">
    <VueFormGenerator
      :model="formModel"
      :options="formOptions"
      :schema="pinnedSchema"
      @model-updated="onModelUpdated"
    />
  </div>

  <KCollapse
    v-model="configCollapse"
    class="sc-form-config-fields"
  >
    <template #title>
      {{ t('plugins.form.grouping.plugin_configuration.title') }}
    </template>
    <template #visible-content>
      {{ t('plugins.form.grouping.plugin_configuration.description') }}
    </template>

    <ConfigForm
      class="sc-form-config-form"
      :data="model"
      :schema="freeFormSchema"
      @change="onFormChange"
    />

    <KCollapse
      v-model="advancedCollapsed"
      :trigger-label="advancedCollapsed ? t('plugins.form.grouping.advanced_parameters.view') : t('plugins.form.grouping.advanced_parameters.hide')"
    >
      <VueFormGenerator
        :model="formModel"
        :options="formOptions"
        :schema="advancedSchema"
        @model-updated="onModelUpdated"
      />
    </KCollapse>
  </KCollapse>
</template>

<script setup lang="ts">
import { computed, ref, toValue, provide, type MaybeRefOrGetter } from 'vue'
import { createI18n } from '@kong-ui-public/i18n'
import { AUTOFILL_SLOT, AUTOFILL_SLOT_NAME } from '@kong-ui-public/forms'
import { VueFormGenerator } from '@kong-ui-public/forms'
import { KCollapse } from '@kong/kongponents'
import english from '../../../locales/en.json'
import ConfigForm from './ConfigForm.vue'
import type { RequestCalloutPlugin } from './types'
import type { FormSchema } from '../../../types/plugins/form-schema'

const { t } = createI18n<typeof english>('en-us', english)

const props = defineProps<{
  schema: FormSchema
  formSchema: any
  model: Record<string, any>
  formModel: Record<string, any>
  formOptions: any
  isEditing: boolean
  onModelUpdated: (value: any, model: string) => void
  onFormChange: (value: RequestCalloutPlugin) => void
}>()

const slots = defineSlots<{
  [K in typeof AUTOFILL_SLOT_NAME]: () => any
}>()

provide(AUTOFILL_SLOT, slots?.[AUTOFILL_SLOT_NAME])

function usePickedSchema(keys: MaybeRefOrGetter<string[]>) {
  return computed(() => ({
    fields: toValue(keys)
      .map(key => props.formSchema?.fields.find((field: { model: string }) => field.model === key))
      .filter(Boolean),
  }))
}

const PINNED_FIELD_KEYS = ['enabled', 'selectionGroup']
const topLevelFieldKeys = computed(() => ((props.formSchema?.fields || []) as any[]).map((field: { model: string }) => field.model))
const configFieldKeys = computed(() => topLevelFieldKeys.value.filter(key => key.startsWith('config-')))
const advancedFieldKeys = computed(() => topLevelFieldKeys.value.filter(key => !PINNED_FIELD_KEYS.includes(key) && !configFieldKeys.value.includes(key)))

const pinnedSchema = usePickedSchema(PINNED_FIELD_KEYS)
const advancedSchema = usePickedSchema(advancedFieldKeys)

const FREE_FORM_SCHEMA_KEYS = ['config']
const freeFormSchema = computed(() => {
  const result = props.schema
  result.fields = result.fields.filter(item => FREE_FORM_SCHEMA_KEYS.includes(Object.keys(item)[0]))
  return result
})

const configCollapse = ref(false)
const advancedCollapsed = ref(true)
</script>

<style lang="scss" scoped>
.sc-form-config-fields {
  border-top: $kui-border-width-10 solid $kui-color-border;
  margin-top: $kui-space-80;
  padding-top: $kui-space-80;
}

.sc-form-config-form {
  margin: $kui-space-100 0;
}
</style>
