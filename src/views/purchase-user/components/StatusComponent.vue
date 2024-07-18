<template>
  <el-radio-group class="!w-full">
    <el-radio-button v-for="(s, i) in status" :key="i" :label="s.value" :class="buttonWidth">
      <template #default>
        {{ $t(s.label) }}
      </template>
    </el-radio-button>
  </el-radio-group>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  status: {
    type: Object,
    default: () => ({}),
  },
})

const buttonWidth = computed(() => (props.status.length === 2 ? 'w-1/2' : 'w-1/3'))
</script>
