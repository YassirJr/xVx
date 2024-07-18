<template>
  <el-dialog
    draggable
    :model-value="useDialog.visible('import_employee')"
    :title="activeStep == 0 ? $t('select') : `${$t('import')} ${$t(activeType?.title)}`"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('import_employee')"
  >
    <div v-loading="loading">
      <div v-if="activeStep == 0" class="grid grid-cols-2 gap-5 m-auto">
        <div
          v-for="(type, i) in importTypes"
          :key="i"
          class="col-span-1 h-44 border-2 rounded-xl flex justify-center items-center cursor-pointer hover:text-primary hover:bg-gray-50"
          :class="{ 'border-primary text-primary bg-primary/5': activeType?.field == type.field }"
          @click="onImportTypeClicked(type.field)"
        >
          <div>
            <span class="iconify w-10 h-10 m-auto" :data-icon="`tabler:${type.icon}`"></span>
            <div class="pt-2 text-center">{{ $t(type.title) }}</div>
          </div>
        </div>
      </div>
      <div v-if="activeStep == 1" class="">
        <import-excel
          class="mb-2"
          :disabled="false"
          :model-data="modelData"
          :validation-row="validationRow"
          :cols-nbr="activeType.columns.length"
          @import-change="updateTableData"
          @loading="importLoading"
          @error-change="errorChange"
        ></import-excel>
        <vxe-grid
          :columns="activeType.columns"
          :data="tableData"
          class="w-full"
          border
          round
          stripe
          max-height="350"
          show-overflow
        ></vxe-grid>
        <div
          v-if="isErrorsExist"
          class="col-span-1 text-start text-sm text-red-500 max-h-28 overflow-y-auto mt-2 pr-4"
        >
          <p>{{ $t('please-fix-the-following-errors') }} :</p>
          <div v-if="importErrors.invalidLength" class="ml-2">
            {{ $t('the-number-of-columns-is-invalid') }}
          </div>
          <div v-else>
            <ul>
              <li v-for="(row, index) in importErrors.rows" :key="index" class="ml-2">
                <span class="pr-2">{{ $t('in-position') }} :</span>
                <span>{{ row.join(', ') }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex items-center justify-between mt-2">
        <template v-if="activeStep == 0">
          <div>
            <el-button plain type="info" @click="useDialog.close('import_employee')">
              {{ $t('cancel') }}
            </el-button>
          </div>
          <div>
            <el-button :disabled="!activeType" @click="next()">
              {{ $t('next') }}
            </el-button>
          </div>
        </template>
        <template v-else>
          <div>
            <el-button plain type="info" @click="prev()">
              {{ $t('previous') }}
            </el-button>
          </div>
          <div>
            <el-button :disabled="isSaveDisabled" @click="save()">
              {{ $t('save') }}
            </el-button>
          </div>
        </template>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import importExcel from '@/components/ImportExcel'
import { getExcelModelData, useDialog } from '@/helpers'
import { t } from '@/plugins'
import { useEmployeeStore } from '@/stores/employee'
import { ref, computed } from 'vue'

const loading = ref(false)
const activeStep = ref(0)
const activeType = ref(null)
const tableData = ref([])
const importErrors = ref([])
const employeeStore = useEmployeeStore()

const importTypes = [
  {
    field: 'cnss_nbr',
    title: 'cnss-nbr',
    icon: 'briefcase',
    columns: [
      {
        field: 'uid',
        title: t('employee-code'),
        validator: 'employee',
        modelVal: {
          type: 'number',
        },
      },
      {
        field: 'cnss_nbr',
        title: t('cnss-nbr'),
        validator: 'cnss_nbr',
        modelVal: {
          type: 'number',
          length: 9,
        },
      },
    ],
  },
  {
    field: 'bank-statement',
    title: 'bank-statement',
    icon: 'building-bank',
    columns: [
      {
        field: 'uid',
        title: t('employee-code'),
        validator: 'employee',
        modelVal: {
          type: 'number',
        },
      },
      {
        field: 'bank_id',
        title: t('bank'),
        validator: 'bank_id',
        modelVal: {
          type: 'number',
        },
      },
      {
        field: 'bank_statement',
        title: t('bank-statement'),
        validator: 'bank_statement',
        modelVal: '481592367023485109536428',
      },
    ],
  },
  {
    field: 'card_nbr',
    title: 'template-card-number',
    icon: 'credit-card',
    columns: [
      {
        field: 'uid',
        title: t('employee-code'),
        validator: 'employee',
        modelVal: {
          type: 'number',
        },
      },
      {
        field: 'card_nbr',
        title: t('template-card-number'),
        validator: 'card_nbr',
        modelVal: {
          type: 'number',
        },
      },
    ],
  },
  {
    field: 'status',
    title: 'status',
    icon: 'shield-check',
    columns: [
      {
        field: 'uid',
        title: t('employee-code'),
        validator: 'employee',
        modelVal: {
          type: 'number',
        },
      },
      {
        field: 'status',
        title: t('status'),
        validator: 'status',
        formatter: ({ cellValue }) => (Number(cellValue) ? t('active') : t('inactive')),
        modelVal: {
          type: 'boolean',
        },
        comment: t('this-mean-1-is-active-and-0-inactive'),
      },
    ],
  },
]

const isErrorsExist = computed(() => Object.keys(importErrors.value).length != 0)

const isSaveDisabled = computed(() => !tableData.value.length || isErrorsExist.value)

const modelData = computed(() =>
  getExcelModelData(
    activeType.value.columns.map(({ title, modelVal, comment }) => ({ title, modelVal, comment })),
  ),
)

const next = () => {
  if (activeStep.value++ > 1) activeStep.value = 0
}

const prev = () => {
  tableData.value = []
  importErrors.value = []
  if (activeStep.value-- < 1) activeStep.value = 0
}

const onImportTypeClicked = (type) => {
  activeType.value = importTypes.find(({ field }) => field == type)
}

const updateTableData = (newData) => {
  const existingDataJson = tableData.value.map((el) => convertToActiveTypeFormat(el))

  const newDataToAdd = newData.filter((el) => !existingDataJson.includes(convertToActiveTypeFormat(el)))

  tableData.value = [...tableData.value, ...newDataToAdd]
}

const convertToActiveTypeFormat = (el) => {
  const obj = {}
  for (const { field } of activeType.value.columns) {
    obj[field] = el[field]
  }
  return JSON.stringify(obj)
}

const validationRow = (row, chooseValidator) => {
  let isRowInvalid = false
  let processedRow

  const validatedData = activeType.value.columns.map((column, i) =>
    chooseValidator(column.validator)(row[i]?.value),
  )

  if (validatedData.some((el) => !el)) {
    processedRow = validatedData.map((el, i) => (!el ? row[i]?.ref : null)).filter((el) => el)
    isRowInvalid = true
  } else {
    const { uid } = validatedData[0]

    processedRow = {
      uid,
      ...validatedData.slice(1).reduce((acc, val, i) => {
        return { ...acc, [activeType.value.columns.slice(1)[i].field]: val }
      }, {}),
    }
  }

  return { isRowInvalid, processedRow }
}

const importLoading = (status) => {
  loading.value = status
}

const errorChange = (errors) => {
  importErrors.value = errors
}

const save = () => {
  loading.value = true
  const transformedData =
    activeType.value.field === 'card_nbr'
      ? tableData.value.map((el) => ({ uid: el.uid, template: { card: `${el.card_nbr}` } }))
      : tableData.value

  employeeStore.employeeUpdater(transformedData).finally(() => {
    loading.value = false
    tableData.value = []
    useDialog.close('import_employee')
  })
}
</script>
