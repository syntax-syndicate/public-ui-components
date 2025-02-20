import type { JSONSchema } from '@kong/vscode-json-languageservice'
import { isArrayLikeField, isBooleanField, isMapField, isNumberLikeField, isRecordField, isStringField, type ArrayLikeFieldSchema, type BooleanFieldSchema, type EditorLanguage, type ExtendedJSONSchema, type FieldSchema, type MapFieldSchema, type NumberLikeFieldSchema, type RecordFieldSchema, type StringFieldSchema } from '../types'
import { toRegular } from './lua'

export const buildStringSchema = (fieldSchema: StringFieldSchema): ExtendedJSONSchema => {
  const schema: ExtendedJSONSchema = {
    type: 'string',
  }

  if (fieldSchema.len_eq !== undefined) {
    schema.minLength = fieldSchema.len_eq
    schema.maxLength = fieldSchema.len_eq
  } else {
    schema.minLength = fieldSchema.len_min
    schema.maxLength = fieldSchema.len_max
  }

  if (fieldSchema.one_of !== undefined) {
    schema.enum = fieldSchema.one_of
  }

  const allOf: ExtendedJSONSchema['allOf'] = []

  if (fieldSchema.match !== undefined) {
    allOf.push({
      pattern: toRegular(fieldSchema.match),
      $comment: 'source: match',
    })
  }

  if (fieldSchema.match_none) {
    allOf.push(
      ...fieldSchema.match_none.map((rule) => {
        const pattern = toRegular(rule.pattern)
        return {
          errorMessage: rule.err,
          not: {
            pattern,
          },
          $comment: 'source: match_none',
        }
      }),
    )
  }

  if (fieldSchema.match_any) {
    allOf.push({
      errorMessage: fieldSchema.match_any.err,
      anyOf: fieldSchema.match_any.patterns.map((pattern) => ({
        pattern: toRegular(pattern),
      })),
      $comment: 'source: match_any',
    })
  }

  if (fieldSchema.match_all) {
    allOf.push(
      ...fieldSchema.match_all.map((rule) => {
        const pattern = toRegular(rule.pattern)
        return {
          errorMessage: rule.err,
          pattern,
          $comment: 'source: match_all',
        }
      }),
    )
  }

  if (allOf.length > 0) {
    schema.allOf = allOf
  }

  return schema
}

export const buildNumberLikeSchema = (fieldSchema: NumberLikeFieldSchema): ExtendedJSONSchema => {
  const schema: ExtendedJSONSchema = {
    type: 'number',
  }

  schema.minimum = fieldSchema.between?.[0]
  schema.maximum = fieldSchema.between?.[1]

  if (typeof fieldSchema.gt === 'number' && !Number.isNaN(fieldSchema.gt)) {
    if (typeof schema.minimum !== 'number' || fieldSchema.gt > schema.minimum) {
      schema.minimum = fieldSchema.gt
    }
  }

  if (fieldSchema.one_of !== undefined) {
    schema.enum = fieldSchema.one_of
  }

  return schema
}

export const buildBooleanSchema = (fieldSchema: BooleanFieldSchema): ExtendedJSONSchema => {
  return {
    type: 'boolean',
  }
}

export const buildArrayLikeSchema = (
  name: string,
  fieldSchema: ArrayLikeFieldSchema,
  languageHint: EditorLanguage,
): ExtendedJSONSchema => {
  const schema: ExtendedJSONSchema = {
    type: 'array', // JSON schema does not have a specific type for "set"
    items: buildAnySchema(name, fieldSchema.elements, languageHint),
  }

  if (typeof fieldSchema.len_min === 'number' && !Number.isNaN(fieldSchema.len_min)) {
    schema.minItems = fieldSchema.len_min
  }
  if (typeof fieldSchema.len_max === 'number' && !Number.isNaN(fieldSchema.len_max)) {
    schema.maxItems = fieldSchema.len_max
  }

  return schema
}

export const buildMapSchema = (fieldSchema: MapFieldSchema, languageHint: EditorLanguage): ExtendedJSONSchema => {
  const schema: ExtendedJSONSchema = {
    type: 'object',
    additionalProperties: true,
  }

  const patternProperties: JSONSchema['patternProperties'] = {}
  if (isStringField(fieldSchema.keys) && fieldSchema.keys.match_none) {
    for (const rule of fieldSchema.keys.match_none) {
      patternProperties[toRegular(rule.pattern)] = { not: {} }
    }
  }
  patternProperties['.*'] = buildAnySchema('value', fieldSchema.values, languageHint)
  schema.patternProperties = patternProperties

  if (typeof fieldSchema.len_min === 'number' && !Number.isNaN(fieldSchema.len_min)) {
    schema.minProperties = fieldSchema.len_min
  }
  if (typeof fieldSchema.len_max === 'number' && !Number.isNaN(fieldSchema.len_max)) {
    schema.maxProperties = fieldSchema.len_max
  }

  return schema
}

export const buildUnknownSchema = (fieldSchema: FieldSchema): ExtendedJSONSchema => {
  return {
    detail: 'unknown',
    markdownDescription: 'Unknown field type',
  }
}

export const buildRecordSchema = (fieldSchema: RecordFieldSchema, languageHint: EditorLanguage): ExtendedJSONSchema => {
  const properties: Record<string, JSONSchema> = {}
  const required: string[] = []

  const schema: JSONSchema = {
    type: 'object',
    properties,
    // anyOf,
  }

  for (const namedChildField of fieldSchema.fields) {
    const [name, childField] = Object.entries(namedChildField)[0]
    properties[name] = buildAnySchema(name, childField, languageHint)

    if (languageHint === 'json') {
      if (childField.required) {
        required.push(name)
      }
    }
  }

  if (required.length > 0) {
    schema.required = required
  }

  // TODO: Try replace with allOf
  // let anyOf: JSONSchema[] | undefined
  // if (Array.isArray(fieldSchema.entity_checks)) {
  //   for (const check of fieldSchema.entity_checks) {
  //     if (isAtLeastOneOfEntityCheck(check)) {
  //       if (!anyOf) {
  //         anyOf = []
  //       }
  //       anyOf.push(...check.at_least_one_of.map((name) => ({ required: [name] })))
  //     }
  //   }
  // }

  return schema
}

export const buildAnySchema = (
  name: string,
  fieldSchema: FieldSchema,
  languageHint: EditorLanguage,
): ExtendedJSONSchema => {
  const sortText = `${fieldSchema.required ? ' ' : ''}${name}`

  const commons: ExtendedJSONSchema = {
    // detail: `${fieldSchema.required ? '* ' : ''}${fieldSchema.type}`,
    _fieldSchema: fieldSchema,
    default: fieldSchema.default,
    markdownDescription: [
      ...(fieldSchema.required ? ['_Required_'] : []),
      `Type: \`${fieldSchema.type}\``,
      fieldSchema.description,
      ...(fieldSchema.default ? [`Default: \`${JSON.stringify(fieldSchema.default)}\``] : []),
    ].join('\n\n'),
  }

  switch (languageHint) {
    case 'json': {
      commons.suggestSortText = sortText
      break
    }
    case 'yaml': {
      commons.sortText = sortText
      break
    }
  }

  if (isStringField(fieldSchema)) {
    return { ...commons, ...buildStringSchema(fieldSchema) }
  }

  if (isNumberLikeField(fieldSchema)) {
    return { ...commons, ...buildNumberLikeSchema(fieldSchema) }
  }

  if (isBooleanField(fieldSchema)) {
    return { ...commons, ...buildBooleanSchema(fieldSchema) }
  }

  if (isArrayLikeField(fieldSchema)) {
    return { ...commons, ...buildArrayLikeSchema(name, fieldSchema, languageHint) }
  }

  if (isMapField(fieldSchema)) {
    return { ...commons, ...buildMapSchema(fieldSchema, languageHint) }
  }

  if (isRecordField(fieldSchema)) {
    return { ...commons, ...buildRecordSchema(fieldSchema, languageHint) }
  }

  console.warn(`Unknown field schema with type "${fieldSchema.type}": ${JSON.stringify(fieldSchema)}`)
  return { ...commons, ...buildUnknownSchema(fieldSchema) }
}
