<template>
  <SandboxPermissionsControl
    @update="handlePermissionsUpdate"
  />
  <h2>Konnect Actions Outside</h2>
  <div id="kong-ui-app-page-header-action-button" />

  <h2>Konnect API</h2>
  <KeyList
    v-if="permissions"
    :key="key"
    cache-identifier="konnect"
    :can-create="permissions.canCreate"
    :can-delete="permissions.canDelete"
    :can-edit="permissions.canEdit"
    :can-retrieve="permissions.canRetrieve"
    :config="konnectConfig"
    use-action-outside
    @copy:error="onCopyError"
    @copy:success="onCopySuccess"
    @delete:success="onDeleteKeySuccess"
    @error="onError"
  />

  <h2>Kong Manager API</h2>
  <KeyList
    v-if="permissions"
    :key="key"
    cache-identifier="kong-manager"
    :can-create="permissions.canCreate"
    :can-delete="permissions.canDelete"
    :can-edit="permissions.canEdit"
    :can-retrieve="permissions.canRetrieve"
    :config="kongManagerConfig"
    @copy:error="onCopyError"
    @copy:success="onCopySuccess"
    @delete:success="onDeleteKeySuccess"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AxiosError } from 'axios'
import { KeyList } from '../../src'
import type { KonnectKeyListConfig, KongManagerKeyListConfig, EntityRow, CopyEventPayload } from '../../src'
import type { PermissionsActions } from '@entities-shared-sandbox/components/SandboxPermissionsControl.vue'
import SandboxPermissionsControl from '@entities-shared-sandbox/components/SandboxPermissionsControl.vue'

const controlPlaneId = import.meta.env.VITE_KONNECT_CONTROL_PLANE_ID || ''

const konnectConfig = ref<KonnectKeyListConfig>({
  app: 'konnect',
  apiBaseUrl: '/us/kong-api', // `/{geo}/kong-api`, with leading slash and no trailing slash
  // Set the root `.env.development.local` variable to a control plane your PAT can access
  controlPlaneId,
  createRoute: { name: 'create-key' },
  getViewRoute: (id: string) => ({ name: 'view-key', params: { id } }),
  getEditRoute: (id: string) => ({ name: 'edit-key', params: { id } }),
})

const kongManagerConfig = ref<KongManagerKeyListConfig>({
  app: 'kongManager',
  workspace: 'default',
  apiBaseUrl: '/kong-manager', // For local dev server proxy
  isExactMatch: false,
  createRoute: { name: 'create-key' },
  getViewRoute: (id: string) => ({ name: 'view-key', params: { id } }),
  getEditRoute: (id: string) => ({ name: 'edit-key', params: { id } }),
  filterSchema: {
    name: {
      type: 'text',
    },
  },
})

// Remount the tables in the sandbox when the permission props change; not needed outside of a sandbox
const key = ref(1)
const permissions = ref<PermissionsActions | null>(null)
const handlePermissionsUpdate = (newPermissions: PermissionsActions) => {
  permissions.value = newPermissions
  key.value++
}

const onCopySuccess = (payload: CopyEventPayload) => {
  console.log(payload.message)
}

const onCopyError = (payload: CopyEventPayload) => {
  console.error(payload.message)
}

const onDeleteKeySuccess = (row: EntityRow) => {
  console.log(`${row.id} successfully deleted`)
}

const onError = (error: AxiosError) => {
  console.error(`Error: ${error}`)
}
</script>
