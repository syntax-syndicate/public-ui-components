import type { RouteLocationRaw } from 'vue-router'
import type { KonnectBaseFormConfig, KongManagerBaseFormConfig } from '@kong-ui-public/entities-shared'

/** Konnect GatewayService form config */
export interface KonnectGatewayServiceFormConfig extends KonnectBaseFormConfig {
  /** Route to return to if canceling create/edit a GatewayService */
  cancelRoute: RouteLocationRaw
}

/** Kong Manager GatewayService form config */
export interface KongManagerGatewayServiceFormConfig extends KongManagerBaseFormConfig {
  /** Route to return to if canceling create/edit a GatewayService */
  cancelRoute: RouteLocationRaw
}

export interface GatewayServiceFormFields {
  name: string
  protocol: string
  host: string
  path: string
  port: number
  url: string
  retries: number
  connect_timeout: number
  write_timeout: number
  read_timeout: number
  client_certificate: string
  ca_certificates: string
  tls_verify_enabled: boolean
  tls_verify_value: boolean
  tags: string
}
export interface FormFieldErrors {
  host: string
  port: string
  path: string
  url: string
  tags: string
  retries: string
  connect_timeout: string
  write_timeout: string
  read_timeout: string
  client_certificate: string
  ca_certificates: string
  tls_verify_enabled: string
  tls_verify_value: string
  name:string
}

export interface LegacyGatewayServiceFormState {
  /** Form fields */
  fields: GatewayServiceFormFields
  /** Form readonly state (only used when saving entity details) */
  isReadonly: boolean
  /** The Array of error messages to show  */
  errorMessage: string
}

export interface GatewayServiceFormState {
  /** Form fields */
  fields: GatewayServiceFormFields
  /** Form readonly state (only used when saving entity details) */
  isReadonly: boolean
  /** The Array of error messages to show  */
  errorMessages: string[]
  /** The error Object is to show error on each form field */
  formFieldErrors: FormFieldErrors
}

// TODO: This should be exposed from Kongponents, but isn't
export interface SelectItem {
  label: string
  value: string | number
  selected?: boolean
}

export interface useUrlValidators {
  validateHost: (host: string) => string
  validatePort: (port: number) => string
  validateProtocol: (protocol: string) => string
  validatePath: (path: string) => string
}
