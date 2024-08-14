<template>
  <div class="sandbox-container">
    <main>
      <pre>{{ JSON.stringify(record, null, 2) }}</pre>
      <NextRecordField
        :schema="anySchema"
        :value="record"
        @update-value="handleUpdate"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NextRecordField from '../../src/components/next/NextRecordField.vue'
// import schema from './http-log.json'
// import schema from './request-transformer-advanced.json'
import schema from '../next-schema.json'

const anySchema = schema as any
const record = ref({})

const handleUpdate = (value: any) => {
  console.log('handleUpdate', value)
  record.value = value
}
</script>

<style lang="scss" scoped>
.sandbox-container {
  display: flex;
  flex-direction: column;
  padding: 40px;
}
</style>
