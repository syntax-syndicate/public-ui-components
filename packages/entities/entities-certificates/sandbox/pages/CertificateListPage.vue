<template>
  <SandboxPermissionsControl
    @update="handlePermissionsUpdate"
  />

  <h2>Konnect Actions Outside</h2>
  <div id="kong-ui-app-page-header-action-button" />

  <h2>Konnect API</h2>
  <CertificateList
    v-if="permissions"
    :key="key"
    cache-identifier="konnect"
    :can-create="permissions.canCreate"
    :can-delete="permissions.canDelete"
    :can-edit="permissions.canEdit"
    :can-retrieve="permissions.canRetrieve"
    :config="konnectConfig"
    use-action-outside
    @copy:error="onCopyIdError"
    @copy:success="onCopyIdSuccess"
    @delete-route:success="onDeleteCertificateSuccess"
    @error="onError"
  />

  <h2>Kong Manager API</h2>
  <CertificateList
    v-if="permissions"
    :key="key"
    cache-identifier="kong-manager"
    :can-create="permissions.canCreate"
    :can-delete="permissions.canDelete"
    :can-edit="permissions.canEdit"
    :can-retrieve="permissions.canRetrieve"
    :config="kongManagerConfig"
    @copy:error="onCopyIdError"
    @copy:success="onCopyIdSuccess"
    @delete-route:success="onDeleteCertificateSuccess"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AxiosError } from 'axios'
import { CertificateList } from '../../src'
import type { KonnectCertificateListConfig, KongManagerCertificateListConfig, EntityRow, CopyEventPayload } from '../../src'
import type { PermissionsActions } from '@entities-shared-sandbox/components/SandboxPermissionsControl.vue'
import SandboxPermissionsControl from '@entities-shared-sandbox/components/SandboxPermissionsControl.vue'

const controlPlaneId = import.meta.env.VITE_KONNECT_CONTROL_PLANE_ID || ''
const konnectConfig = ref<KonnectCertificateListConfig>({
  app: 'konnect',
  apiBaseUrl: '/us/kong-api', // `/{geo}/kong-api`, with leading slash and no trailing slash
  // Set the root `.env.development.local` variable to a control plane your PAT can access
  controlPlaneId,
  createRoute: { name: 'create-certificate' },
  isExactMatch: true,
  getViewRoute: (id: string) => ({ name: 'view-certificate', params: { id } }),
  getEditRoute: (id: string) => ({ name: 'edit-certificate', params: { id } }),
  getCreateSniRoute: (id: string) => ({ name: 'add-sni', params: { id } }),
})

const kongManagerConfig = ref<KongManagerCertificateListConfig>({
  app: 'kongManager',
  workspace: 'default',
  apiBaseUrl: '/kong-manager', // For local dev server proxy
  isExactMatch: true,
  createRoute: { name: 'create-certificate' },
  getViewRoute: (id: string) => ({ name: 'view-certificate', params: { id } }),
  getEditRoute: (id: string) => ({ name: 'edit-certificate', params: { id } }),
  getCreateSniRoute: (id: string) => ({ name: 'add-sni', params: { id } }),
})

// Remount the tables in the sandbox when the permission props change; not needed outside of a sandbox
const key = ref(1)
const permissions = ref<PermissionsActions | null>(null)
const handlePermissionsUpdate = (newPermissions: PermissionsActions) => {
  permissions.value = newPermissions
  key.value++
}

const onCopyIdSuccess = (payload: CopyEventPayload) => {
  console.log(payload.message)
}

const onCopyIdError = (payload: CopyEventPayload) => {
  console.error(payload.message)
}

const onDeleteCertificateSuccess = (row: EntityRow) => {
  console.log(`${row.id} successfully deleted`)
}

const onError = (error: AxiosError) => {
  console.error(`Error: ${error}`)
}
</script>
