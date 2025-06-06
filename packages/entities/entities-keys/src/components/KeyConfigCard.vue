<template>
  <div class="kong-ui-entities-keys-entity-config-card">
    <EntityBaseConfigCard
      :config="config"
      :config-card-doc="configCardDoc"
      :config-schema="configSchema"
      :entity-type="SupportedEntityType.Key"
      :fetch-url="fetchUrl"
      :hide-title="hideTitle"
      @fetch:error="(err: any) => $emit('fetch:error', err)"
      @fetch:success="handleSuccess"
      @loading="(val: boolean) => $emit('loading', val)"
    >
      <template #set="{ row }">
        <!-- Loading -->
        <KSkeleton
          v-if="isKeySetNameLoading"
          data-testid="key-set-name-loader"
          type="spinner"
        />
        <InternalLinkItem
          v-else-if="row.value && row.value.id === entityKeySetId && keySetName"
          :item="{
            key: row.value.id,
            value: keySetName,
            type: ConfigurationSchemaType.LinkInternal
          }"
          @click="$emit('navigation-click', row.value.id, 'key-sets')"
        />
        <div
          v-else
        >
          {{ '&ndash;' }}
        </div>
      </template>

      <template
        v-if="currentKey?.jwk"
        #jwk
      >
        <ConfigCardItem
          v-for="propKey in Object.keys(result)"
          :key="propKey"
          :data-testid="`${propKey}`"
          :item="{
            key: propKey,
            label: convertKeyToTitle(propKey),
            value: result[propKey],
          }"
        />
      </template>
      <template
        v-if="currentKey?.pem"
        #pem
      >
        <ConfigCardItem
          v-for="propKey in Object.keys(result)"
          :key="propKey"
          :data-testid="`${propKey}`"
          :item="{
            key: propKey,
            label: convertKeyToTitle(propKey),
            value: result[propKey],
          }"
        />
      </template>
    </EntityBaseConfigCard>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref, watch } from 'vue'
import type { AxiosError } from 'axios'
import type { KongManagerKeyEntityConfig, KonnectKeyEntityConfig, KeyConfigurationSchema } from '../types'
import {
  useAxios,
  useStringHelpers,
  ConfigCardItem,
  ConfigurationSchemaSection,
  ConfigurationSchemaType,
  EntityBaseConfigCard,
  InternalLinkItem,
  SupportedEntityType,
} from '@kong-ui-public/entities-shared'
import endpoints from '../keys-endpoints'
import composables from '../composables'
import '@kong-ui-public/entities-shared/dist/style.css'

const emit = defineEmits<{
  (e: 'loading', isLoading: boolean): void
  (e: 'fetch:error', error: AxiosError): void
  (e: 'fetch:success', data: Record<string, any>): void
  (e: 'navigation-click', id: string, entityType: string): void
}>()

// Component props - This structure must exist in ALL entity components, with the exclusion of unneeded action props (e.g. if you don't need `canDelete`, just exclude it)
const props = defineProps({
  /** The base konnect or kongManger config. Pass additional config props in the shared entity component as needed. */
  config: {
    type: Object as PropType<KonnectKeyEntityConfig | KongManagerKeyEntityConfig>,
    required: true,
    validator: (config: KonnectKeyEntityConfig | KongManagerKeyEntityConfig): boolean => {
      if (!config || !['konnect', 'kongManager'].includes(config?.app)) return false
      if (config.app === 'konnect' && !config.controlPlaneId) return false
      if (config.app === 'kongManager' && typeof config.workspace !== 'string') return false
      if (!config.entityId) return false
      return true
    },
  },
  /**
   * External link for documentation that determines visibility of Documentation button
   */
  configCardDoc: {
    type: String,
    default: '',
    required: false,
  },
  /**
   * Control visibility of card title content
   */
  hideTitle: {
    type: Boolean,
    default: false,
  },
  /**
   * Keyset id for scoped key entity
   */
  keySetId: {
    type: String as PropType<string | null>,
    default: null,
  },
})

interface KeySet {
  id: string
  created_at: number
  updated_at: number
  name: string
  tags: string[]
}

interface PemKey {
  private_key: string
  public_key: string
}

interface Key {
  id: string
  created_at: number
  updated_at: number
  tags: string[]
  set: KeySet
  name: string
  kid: string
  jwk?: string
  pem?: PemKey
}

const { axiosInstance } = useAxios(props.config?.axiosRequestConfig)
const { convertKeyToTitle } = useStringHelpers()
const { i18n: { t } } = composables.useI18n()

const fetchUrl = computed<string>(() => {
  if (props.keySetId) {
    return `${endpoints.form[props.config.app].edit.forKeySet}`
      .replace(/{keySetId}/gi, props.keySetId)
  }
  return endpoints.form[props.config.app].edit.all
})

const fetchKeySetNameUrl = computed<string>(() => endpoints.form[props.config.app]?.getKeySet)

const currentKey = ref<Key>()
const result = ref<Record<string, string | undefined>>({})
const entityKeySetId = ref<string>(props.keySetId || '')
const keySetName = ref('')
const isKeySetNameLoading = ref(false)

const handleSuccess = async (entity: any) => {
  currentKey.value = entity
  entityKeySetId.value = entity?.set?.id
  emit('fetch:success', entity)
  mapToAdvanced(entity)
}

watch(entityKeySetId, async () => {
  if (!entityKeySetId.value) {
    return
  }

  let url = `${props.config.apiBaseUrl}${fetchKeySetNameUrl.value}`
  if (props.config.app === 'konnect') {
    url = url
      .replace(/{controlPlaneId}/gi, props.config?.controlPlaneId || '')
      .replace(/{keySetId}/gi, entityKeySetId.value || '')
  } else if (props.config.app === 'kongManager') {
    url = url
      .replace(/\/{workspace}/gi, props.config?.workspace ? `/${props.config.workspace}` : '')
      .replace(/{keySetId}/gi, entityKeySetId.value || '')
  }

  try {
    isKeySetNameLoading.value = true
    // make the call to get keySetName
    const { data } = await axiosInstance.get(url, {
      validateStatus: (status: number) => status === 404 || (status >= 200 && status < 300), // in case KeySet is deleted
    })
    keySetName.value = data?.name || data?.id
  } catch (err: any) {
    // emit this error for the host app
    emit('fetch:error', err)
  } finally {
    isKeySetNameLoading.value = false
  }
}, { immediate: true })

const mapToAdvanced = (currentKey: Key) => {
  try {
    if (currentKey.jwk) {
      const parsedJwk = JSON.parse(currentKey.jwk)
      Object.keys(parsedJwk).forEach(key => {
        result.value = {
          ...result.value,
          [`jwk.${key}`]: parsedJwk[key],
        }
      })
    } else {
      result.value = {
        'pem.public_key': currentKey?.pem?.public_key,
        'pem.private_key': currentKey?.pem?.private_key,
      }
    }
  } catch (err: any) {
    emit('fetch:error', err)
  }
  return result
}

const configSchema = ref<KeyConfigurationSchema>({
  id: {},
  name: {
    tooltip: t('keys.form.fields.name.tooltip'),
  },
  last_updated: {},
  created: {},
  set: {
    label: t('keys.form.fields.set.label'),
    section: ConfigurationSchemaSection.Basic,
    tooltip: t('keys.form.fields.set.tooltip'),
    order: 5,
  },
  kid: {
    label: t('keys.form.fields.kid.label'),
    section: ConfigurationSchemaSection.Basic,
    tooltip: t('keys.form.fields.kid.tooltip'),
  },
  tags: {
    tooltip: t('keys.form.fields.tags.tooltip'),
  },
  // advanced fields
  jwk: {
    label: t('keys.form.fields.jwk.label'),
    type: ConfigurationSchemaType.Json,
  },
  pem: {
    section: ConfigurationSchemaSection.Advanced,
    label: t('keys.form.fields.key_format.options.pem'),
    type: ConfigurationSchemaType.Json,
  },
})
</script>
