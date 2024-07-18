<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <div class="flex justify-end mb-1">
      <el-radio-group v-model="filterError">
        <el-radio-button v-for="(option, index) in errorOptions" :key="index" :label="option.value">
          <template #default>
            <div class="px-8">{{ $t(option.label) }}</div>
          </template>
        </el-radio-button>
      </el-radio-group>
    </div>
    <vx-table
      ref="vxtable"
      :hide-actions="true"
      :columns="columns"
      :ajax="ajax"
      :tooltip-config="tableTooltipConfig"
      edit-permission="pointing-in-out-edit"
      @checkbox-change="checkboxChangeEvent"
    >
      <template #toolbar>
        <div class="flex justify-start items-center">
          <period-type
            :add-processing="true"
            :add-date-picker="!isQFS"
            :add-date-select="isQFS"
            process-permission="processed-in-out-process"
            @pay-closure-change="payClosureChange"
            @launch-processing="launchProcessing"
          />
          <div v-if="payClosure.status" class="ml-3">
            <el-button
              v-if="selectedRows?.length"
              plain
              type="primary"
              @click="useDialog.open('create_process_pointing')"
            >
              <i-el-plus class="mr-2" />
              {{ $t('new-pointing') }}
            </el-button>
          </div>
        </div>
      </template>
      <template #more_actions="row">
        <el-button type="primary" plain @click="details(row)"><i-el-warning /></el-button>
      </template>
    </vx-table>

    <processed-data-details
      :key="payClosure.id"
      :data="pointingData"
      :pay-closure="payClosure"
      @reload="vxtable.refresh()"
      @new-process-pointing="newProcessPointing"
    ></processed-data-details>
    <create-process-pointing
      :key="payClosure.id"
      :multiple-pointing="selectedRows"
      :process-pointing="processPointing"
      :pay-closure="payClosure"
      @reload="reset()"
    ></create-process-pointing>
  </div>
</template>

<script setup>
import PeriodType from '@/components/PeriodType'
import CreateProcessPointing from './components/CreateProcessPointing'
import ProcessedDataDetails from './components/ProcessedDataDetails'
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue'
import { isQFS, useQuery, InputFilter, useDialog } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { DATE_FORMAT } from '@/constants'
import { usePointingInOutStore } from '@/stores/pointingInOut'
import { useEmployeeStore } from '@/stores/employee'
import { useSiteStore } from '@/stores/site'
import { usePointingReasonStore } from '@/stores/pointingReason'

const filterError = ref(false)
const errorOptions = ref([
  { value: false, label: 'all-data' },
  { value: true, label: 'non-valid-data' },
])
const payClosure = ref({ id: null, status: false, added_at: null, start_date: null, end_date: null })
const loading = ref(false)
const pointingData = ref(null)
const selectedRows = ref([])
const processPointing = ref(null)
const vxtable = ref(null)

const pointingInOutStore = usePointingInOutStore()
const employeeStore = useEmployeeStore()
const siteStore = useSiteStore()
const pointingReasonStore = usePointingReasonStore()

onMounted(() => {
  resetSelectedRows()
  employeeStore.fetchAllEmployees({ leaders_only: true })
  siteStore.fetchAllSites({ list: true })
  pointingReasonStore.fetchAllReasons()
})

const ajax = computed(() => {
  return {
    query: (params) => {
      if (!payClosure.value?.id) {
        return { page: { total: 0 }, result: [] }
      }

      const query = useQuery(params)

      query.filter['pay_closure_id'] = payClosure.value.id

      if (!isQFS) {
        query.filter['added_at'] = query.filter['added_at'] ?? payClosure.value.added_at
      }

      if (filterError.value) {
        query.filter['processed_hours->has_error'] = true
      }

      return new Promise((resolve) => {
        pointingInOutStore.fetchProcessed(query).then(({ data, total }) => {
          resolve({
            page: {
              total: total,
            },
            result: data?.map((el) => ({
              ...el,
              employee_fullname: `${el.employee.firstname} ${el.employee.lastname}`,
              leader_fullname: el?.leader?.firstname ? `${el.leader.firstname} ${el.leader.lastname}` : null,
            })),
          })
        })
      })
    },
  }
})

const columns = computed(() => {
  const columns = [
    {
      type: 'checkbox',
      width: 45,
      align: 'center',
      className: getColumnClassName,
      visible: payClosure.value.status,
    },
    {
      field: 'added_at',
      title: t('date'),
      sortable: true,
      width: 120,
      className: getColumnClassName,
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
      ...InputFilter({
        type: 'date',
        className: 'h-10 p-0.5',
        clearable: true,
        payClosure: payClosure.value,
        data: payClosure.value.start_date,
      }),
    },
    {
      field: 'employee.uid',
      title: t('employee-code'),
      className: getColumnClassName,
      ...InputFilter({ type: 'number' }),
    },
    {
      field: 'employee_fullname',
      title: t('employee'),
      className: getColumnClassName,
    },
    {
      field: 'vehicle.registration_nbr',
      title: t('vehicle'),
      className: getColumnClassName,
    },
    {
      field: 'leader.uid',
      title: t('leader-code'),
      className: getColumnClassName,
      ...InputFilter({ type: 'number' }),
    },
    {
      field: 'leader_fullname',
      title: t('leader'),
      className: getColumnClassName,
    },
    {
      field: 'processed_hours.nbr_total_hours',
      title: t('number-of-hours'),
      className: getColumnClassName,
      formatter: ({ cellValue }) => (cellValue != undefined ? cellValue.toFixed(2) : null),
    },
    {
      field: 'processed_hours.nbr_hours_normal',
      title: t('normal-hours'),
      width: 80,
      className: getColumnClassName,
      formatter: ({ cellValue }) => (cellValue != undefined ? cellValue.toFixed(2) : null),
    },
    {
      field: 'processed_hours.nbr_hours_25',
      title: t('hours-25'),
      width: 80,
      className: getColumnClassName,
      formatter: ({ cellValue }) => (cellValue != undefined ? cellValue.toFixed(2) : null),
    },
    {
      field: 'processed_hours.nbr_hours_40',
      title: t('hours-40'),
      width: 80,
      className: getColumnClassName,
      formatter: ({ cellValue }) => (cellValue != undefined ? cellValue.toFixed(2) : null),
      qfs: true,
    },
    {
      field: 'processed_hours.nbr_hours_50',
      title: t('hours-50'),
      width: 80,
      className: getColumnClassName,
      formatter: ({ cellValue }) => (cellValue != undefined ? cellValue.toFixed(2) : null),
      qfs: false,
    },
    {
      field: 'processed_hours.nbr_hours_60',
      title: t('hours-60'),
      width: 80,
      className: getColumnClassName,
      formatter: ({ cellValue }) => (cellValue != undefined ? cellValue.toFixed(2) : null),
      qfs: true,
    },
    {
      field: 'processed_hours.nbr_hours_100',
      title: t('hours-100'),
      width: 80,
      className: getColumnClassName,
      formatter: ({ cellValue }) => (cellValue != undefined ? cellValue.toFixed(2) : null),
    },
    {
      title: t('actions'),
      width: 80,
      slots: { default: 'actions' },
      className: getColumnClassName,
    },
  ]

  return columns.filter((column) => column?.qfs == undefined || column?.qfs == isQFS)
})

const tableTooltipConfig = computed(() => {
  return {
    showAll: true,
    contentMethod: ({ column, row, type }) => {
      const cols = [
        'nbr_total_hours',
        'nbr_hours_normal',
        'nbr_hours_25',
        'nbr_hours_40',
        'nbr_hours_50',
        'nbr_hours_60',
        'nbr_hours_100',
      ]
      const colKeys = column?.field ? column.field.split('.') : []

      if (colKeys.length == 2 && cols.includes(colKeys[1]) && row && row[colKeys[0]] && type == 'body') {
        const rowValue = row[colKeys[0]][colKeys[1]] ?? 0
        const minutes = dayjs.duration(rowValue, 'hours').format('mm')

        return `${parseInt(rowValue)}h ${minutes}min`
      }

      return ''
    },
  }
})

watch(
  () => filterError.value,
  () => {
    vxtable.value.refresh()
  },
)

onBeforeUnmount(() => {
  resetSelectedRows()
})

const details = (row) => {
  resetSelectedRows()
  pointingData.value = row
  useDialog.open('processed_in_out_data_details')
}

const payClosureChange = ({ status, id, start_date, end_date }) => {
  payClosure.value = { id, status, added_at: null, start_date, end_date }
  vxtable.value.refresh()
}

const getColumnClassName = ({ row }) => {
  const hasError = row?.processed_hours?.has_error ?? true

  return hasError ? 'bg-red-50 text-red-500' : null
}

const launchProcessing = ({ added_at, status, id, week_index }) => {
  loading.value = true
  payClosure.value = {
    ...payClosure.value,
    id,
    status,
    added_at,
    week_index,
  }
  const processingArg = {
    pay_closure_id: id,
    added_at,
  }
  if (isQFS) {
    delete processingArg.added_at
    processingArg.week_index = week_index
  }
  pointingInOutStore.process(processingArg).finally(() => {
    loading.value = false
    vxtable.value.refresh()
  })
}

const checkboxChangeEvent = (e) => {
  selectedRows.value = e.records.map(({ id, employee_id }) => ({ id, employee_id }))
}

const resetSelectedRows = () => {
  selectedRows.value = []
}

const newProcessPointing = (value) => {
  processPointing.value = value
}

const reset = () => {
  vxtable.value.refresh()
  resetSelectedRows()
  useDialog.close('processed_in_out_data_details')
}
</script>
