<template>
  <el-select-v2 v-bind="getAttrs" clearable filterable></el-select-v2>
</template>

<script setup>
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const getAttrs = computed(() => {
  const attrsCopy = { ...attrs }
  const valueKey = attrsCopy['value-key'] ?? 'id'

  attrsCopy.options = attrs.options?.map((el) => ({ value: el[valueKey], label: el.label })) ?? []

  return attrsCopy
})
</script>
