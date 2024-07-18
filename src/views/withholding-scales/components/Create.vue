<template>
  <el-dialog
    draggable
    :model-value="useDialog.visible('create_withholding_scales')"
    :title="$t('import')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_withholding_scales')"
  >
    <div v-loading="loading">
      <div class="flex justify-center items-center">
        <import-excel
          :disabled="loading"
          :validation-row="validationRow"
          :cols-nbr="11"
          @import-change="importChange"
          @loading="importLoading"
          @error-change="errorChange"
        ></import-excel>
      </div>
      <el-divider v-if="isErrorsExist || form?.length" />
      <div v-if="isErrorsExist" class="text-start text-sm text-red-500 max-h-64 overflow-y-auto mb-2 pr-4">
        <p>{{ $t('please-fix-the-following-errors') }} :</p>
        <div v-if="importErrors.invalidLength" class="ml-2">{{ $t('the-number-of-columns-is-invalid') }}</div>
        <div v-else>
          <ul>
            <li
              v-for="(row, index) in importErrors.rows[importErrors.rows.length - 1]"
              :key="index"
              class="ml-2"
            >
              <span>{{ row }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-else-if="form?.length">
        <el-alert :title="$t('data-is-valid')" type="success" :closable="false" center show-icon />
      </div>
    </div>
    <template #footer>
      <div>
        <el-button
          v-if="form?.length"
          plain
          type="primary"
          :loading="loading"
          :disabled="loading"
          @click="save()"
        >
          {{ $t('save') }}
        </el-button>
        <el-button plain type="info" :loading="loading" :disabled="loading" @click="reset()">
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import ImportExcel from '@/components/ImportExcel'
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDialog } from '@/helpers'
import { t } from '@/plugins'
import { useWithholdingScaleStore } from '@/stores/withholdingScale'

const emit = defineEmits(['reload'])

const loading = ref(false)
const form = ref([])
const importErrors = ref({})
const errorsMessages = ref([])

const withholdingScaleStore = useWithholdingScaleStore()

const validationRow = (row, chooseValidator) => {
  let isRowInvalid = false
  let processedRow = {}

  withholdingScaleStore.fields.forEach(({ name }, index) => {
    const cell = row[index]
    const value = chooseValidator('value')(cell?.value)

    if (cell.value < 0) {
      errorsMessages.value.push([cell.ref, ':', t('this-number-is-negative')].join(' '))
      isRowInvalid = true
    } else if (value === false) {
      errorsMessages.value.push([cell.ref, ':', t('value-not-a-number')].join(' '))
      isRowInvalid = true
    } else {
      processedRow[name] = Number.isInteger(value) ? value : parseInt(value)
    }
  })

  if (isRowInvalid) {
    processedRow = errorsMessages.value.filter((el) => el)
  }

  return { isRowInvalid, processedRow }
}

const importLoading = (val) => {
  loading.value = val
}

const errorChange = (errors) => {
  importErrors.value = errors
  errorsMessages.value = []
}

const isErrorsExist = computed(() => {
  return Object.keys(importErrors.value).length != 0
})

const importChange = (data) => {
  form.value = [...data]
}

const createData = (data) => {
  loading.value = true

  withholdingScaleStore
    .create(data)
    .then(() => {
      reset()
      emit('reload')
    })
    .finally(() => {
      loading.value = false
      ElMessage({
        type: 'success',
        message: t('successfully-added'),
      })
    })
}

const save = () => {
  if (withholdingScaleStore.withholdingScales?.length) {
    ElMessageBox.confirm(t('this-action-will-permanently-reset-current-data'), {
      confirmButtonText: t('yes'),
      cancelButtonText: t('cancel'),
      type: 'warning',
    })
      .then(() => {
        createData(form.value)
      })
      .catch(() => {
        reset()
      })
  } else {
    createData(form.value)
  }
}

const reset = () => {
  useDialog.close('create_withholding_scales')
  loading.value = false
  form.value = []
  errorsMessages.value = []
  importErrors.value = {}
}
</script>
