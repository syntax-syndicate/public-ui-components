import NextArrayField from '../components/next/NextArrayField.vue'
import NextCheckboxField from '../components/next/NextCheckboxField.vue'
import NextInputField from '../components/next/NextInputField.vue'
import NextMapField from '../components/next/NextMapField.vue'
import NextRecordField from '../components/next/NextRecordField.vue'
import NextSelectField from '../components/next/NextSelectField.vue'
import { FieldSchemaType, type FieldSchema } from '../types/next-fields'

export const getFieldComponent = (schema: FieldSchema) => {
  switch (schema.type) {
    case FieldSchemaType.String:
    case FieldSchemaType.Number:
    case FieldSchemaType.Integer:
      if (Array.isArray(schema.one_of)) {
        return NextSelectField
      }
      return NextInputField
    case FieldSchemaType.Boolean:
      return NextCheckboxField
    case FieldSchemaType.Array:
    case FieldSchemaType.Set:
      return NextArrayField
    case FieldSchemaType.Map:
      return NextMapField
    case FieldSchemaType.Record:
      return NextRecordField
    default:
      return undefined
  }
}

export const isEmpty = (value: any) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && value.trim() === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && Object.keys(value).length === 0) return true
  if (typeof value === 'number' && isNaN(value)) return true

  return false
}

export const emptyValue = (schemaType: FieldSchemaType): any => {
  switch (schemaType) {
    case FieldSchemaType.String:
      return ''
    case FieldSchemaType.Number:
    case FieldSchemaType.Integer:
      return 0
    case FieldSchemaType.Boolean:
      return false
    case FieldSchemaType.Array:
    case FieldSchemaType.Set:
      return []
    case FieldSchemaType.Map:
    case FieldSchemaType.Record:
      return {}
    default:
      return undefined
  }
}

export const reportWarning = (fieldComponent: string, ...args: Parameters<typeof console['warn']>) => {
  console.warn(`${fieldComponent}:`, ...args)
}

export const reportPossibleSchemaType = (fieldComponent: string, schemaType: string) => {
  reportWarning(fieldComponent, `Possible invalid schema type '${schemaType}'`)
}
