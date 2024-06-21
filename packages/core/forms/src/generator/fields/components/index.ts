import FieldCheckbox from './fieldCheckbox.vue'
import FieldChecklist from './fieldChecklist.vue'
import FieldInput from './FieldInput.vue'
import FieldLabel from './FieldLabel.vue'
import FieldSelect from './FieldSelect.vue'
import FieldSubmit from './fieldSubmit.vue'
import FieldTextArea from './FieldTextArea.vue'
import FieldUpload from './fieldUpload.vue'
import FieldObject from './FieldObject.vue'
import FieldObjectAdvanced from './FieldObjectAdvanced.vue'
import FieldArray from './FieldArray.vue'
import FieldMetric from './FieldMetric.vue'
import FieldArrayItem from './FieldArrayItem.vue'
import FieldAdvanced from './FieldAdvanced.vue'
import FieldAutoSuggest from './FieldAutoSuggest.vue'
import FieldSelectionGroup from './FieldSelectionGroup.vue'
import FieldRadio from './FieldRadio.vue'
import FieldArrayCardContainer from './FieldArrayCardContainer.vue'
import FieldMultiselect from './FieldMultiselect.vue'
import FieldKeyValuePairs from './FieldKeyValuePairs.vue'
import FieldPair from './FieldPair.vue'
import FieldCardContainer from './FieldCardContainer.vue'

export {
  FieldCheckbox, FieldChecklist, FieldInput, FieldLabel, FieldSelect, FieldSubmit, FieldTextArea,
  FieldUpload, FieldObject, FieldObjectAdvanced, FieldArray, FieldMetric, FieldArrayItem, FieldAdvanced,
  FieldAutoSuggest, FieldSelectionGroup, FieldRadio, FieldArrayCardContainer, FieldMultiselect, FieldKeyValuePairs,
  FieldPair, FieldCardContainer,
}

export const getFieldComponent = (fieldType: string) => {
  switch (fieldType) {
    case 'array-card-container':
      return FieldArrayCardContainer
    case 'array-item':
      return FieldArrayItem
    case 'auto-suggest':
      return FieldAutoSuggest
    case 'card-container':
      return FieldCardContainer
    case 'input':
      return FieldInput
    case 'metric':
      return FieldMetric
    case 'object':
      return FieldObject
    case 'object-advanced':
      return FieldObjectAdvanced
    case 'pair':
      return FieldPair
    case 'radio':
      return FieldRadio
    case 'select':
      return FieldSelect
    case 'text-area':
      return FieldTextArea
    default:
      console.warn('No matching field component found for field type:', fieldType)
  }
}
