<template>
  <el-form :model="form" label-position="top">
    <div class="grid grid-cols-2 gap-x-5">
      <div class="col-span-1">
        <el-form-item :label="$t('format')" prop="format">
          <el-select v-model="form.format" class="!w-full" @change="handleFormatChange()">
            <el-option
              v-for="(format, index) in pointingTransporterStore.barcodePageFormats"
              :key="index"
              :label="$t(format.label)"
              :value="format.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item :label="$t('copies')" prop="copies">
          <el-input-number
            v-model="form.copies"
            class="!w-full"
            controls-position="right"
            :min="1"
            :max="pointingTransporterStore.getPageFormatByValue(form.format)?.maxCopies"
            :step="step"
            step-strictly
          ></el-input-number>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { usePointingTransporterStore } from '@/stores/pointingTransporter'

const emit = defineEmits(['onBarcodeChange'])

const step = ref(1)
const form = ref({
  copies: null,
  format: null,
})

const pointingTransporterStore = usePointingTransporterStore()

watch(
  () => form.value,
  (newVal) => {
    emit('onBarcodeChange', newVal)
  },
  { deep: true },
)

const handleFormatChange = () => {
  form.value.copies = null
  step.value = pointingTransporterStore.getPageFormatByValue(form.value.format).step
}

const getDataToPrint = (data, { copies, format }) => {
  const maxCopiesPerPage = pointingTransporterStore.getPageFormatByValue(format).maxCopies
  let result = []

  if (maxCopiesPerPage == undefined) {
    data.forEach((emp, i) => {
      result[i] = new Array(copies).fill(emp)
    })

    return result
  }

  let currentIndex = 0
  const users = data
  const nbrPages =
    copies / maxCopiesPerPage < 0.5 ? Math.ceil((users.length * copies) / maxCopiesPerPage) : users.length

  for (let i = 0; i < nbrPages; i++) {
    result[i] = []

    for (let j = 0; j < maxCopiesPerPage; j++) {
      if (users[currentIndex]) {
        result[i].push(users[currentIndex])
      }

      if (result[i].filter((el) => el == users[currentIndex]).length >= copies) {
        currentIndex++

        if (maxCopiesPerPage - (j + 1) < copies) {
          result[i] = new Array(maxCopiesPerPage).fill().map((_, index) => {
            return result[i][index] ?? null
          })

          break
        }
      }
    }
  }

  return result
}

defineExpose({
  getDataToPrint,
})
</script>
