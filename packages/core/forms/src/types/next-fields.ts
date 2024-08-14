
export enum FieldSchemaType {
  String = 'string', // Input, Textarea, Select
  Number = 'number', // Input
  Integer = 'integer', // Input
  Boolean = 'boolean', // Checkbox
  Foreign = 'foreign',
  Array = 'array', // Array
  Set = 'set', // Array
  Map = 'map', // Map
  Record = 'record', // Record
  Function = 'function',
  JSON = 'json', // rarely used
}

export interface FieldProps<V = any, S extends FieldSchema = FieldSchema> {
  name?: string
  schema: S
  value?: V

  /**
   * FOR DEBUGGING: An stack that contains the information of the parent fields
   */
  parentStack?: string[]
}

export interface FieldEmits<V = any> {
  (e: 'update-value', value: V): void
}

export interface FieldSchema {
  type: FieldSchemaType
  required?: boolean
  default?: any
  description?: string
  referenceable?: boolean

  one_of?: any[]

  help?: string
  parent?: FieldSchema
}

export type NamedFieldSchema = { [name: string]: FieldSchema }

export interface NumberLikeFieldSchema extends FieldSchema {
  between?: [min: number, max: number]
}

export const isNumberLikeField = (schema: FieldSchema): schema is NumberLikeFieldSchema =>
  schema.type === FieldSchemaType.Number || schema.type === FieldSchemaType.Integer

export interface ArrayLikeFieldSchema extends FieldSchema {
  elements: FieldSchema
}

export const isArrayLikeField = (schema: FieldSchema): schema is ArrayLikeFieldSchema =>
  schema.type === FieldSchemaType.Array || schema.type === FieldSchemaType.Set

export interface MapFieldSchema extends FieldSchema {
  type: FieldSchemaType.Map
  keys: FieldSchema
  values: FieldSchema
}

export interface RecordFieldSchema extends FieldSchema {
  type: FieldSchemaType.Record
  fields: NamedFieldSchema[]
}

export const isRecordField = (schema: FieldSchema): schema is RecordFieldSchema =>
  schema.type === FieldSchemaType.Record

export interface FormSchema extends Record<string, any> {
  fields: NamedFieldSchema[]
}
