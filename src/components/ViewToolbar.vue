<template>
  <el-radio-group v-model="selectedView">
    <el-tooltip v-for="(v, index) in views" :key="index" :content="t(v.label)">
      <el-radio-button :label="v.value" @change="onViewChange(v.value)">
        <i class="iconify w-4 h-4" :data-icon="`tabler:${v.icon}`"></i>
      </el-radio-button>
    </el-tooltip>
  </el-radio-group>
</template>

<script setup>
import { reactive, ref, onMounted, toRef } from 'vue'
import { t } from '@/plugins'

const props = defineProps({
  view: {
    type: String,
    default: () => 'group',
    validator(value) {
      return ['list', 'group'].includes(value)
    },
  },
})

const emit = defineEmits(['viewChanged'])

const propsRef = toRef(props)
const selectedView = ref(propsRef.value.view !== 'list')

const views = reactive([
  { label: 'group-view', value: true, icon: 'list-details' },
  { label: 'list-view', value: false, icon: 'list' },
])

onMounted(() => {
  emit('viewChanged', { value: selectedView.value, isMounted: true })
})

const onViewChange = (value) => {
  emit('viewChanged', { value })
}
</script>
