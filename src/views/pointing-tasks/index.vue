<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <div class="flex justify-end mb-1">
      <el-radio-group v-model="isFilteredByTotalCost">
        <el-radio-button
          v-for="(option, index) in totalCostFilter"
          :key="index"
          :label="option.value"
          @change="onFilterErrorChange()"
        >
          <template #default>
            <div class="px-8">{{ $t(option.label) }}</div>
          </template>
        </el-radio-button>
      </el-radio-group>
    </div>
    <vx-table
      ref="table"
      :columns="columns"
      :ajax="ajax"
      edit-permission="pointing-task-edit"
      delete-permission="pointing-task-delete"
      :custom-pagination-size="[{ label: $t('all'), value: -1 }]"
      @checkbox-change="checkboxChangeEvent"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <div class="flex justify-start items-center">
          <div v-if="payClosure.status" class="mr-3">
            <el-button v-can="'pointing-task-create'" plain type="primary" @click="addHandler()">
              <i-el-plus class="mr-2" />
              {{ $t('new-pointing') }}
            </el-button>
          </div>
          <period-type
            :add-processing="true"
            :add-date-picker="true"
            process-permission="pointing-task-process"
            @pay-closure-change="payClosureChange"
            @launch-processing="launchProcessing"
          />
          <div v-if="payClosure.status" class="ml-3">
            <el-button
              v-if="selectedRows?.length"
              v-can="'pointing-task-delete'"
              plain
              type="danger"
              @click="deleteMultiPointingTasks()"
            >
              <i-el-delete class="mr-2" />
              {{ $t('delete') }}
            </el-button>
          </div>
        </div>
      </template>
    </vx-table>
  </div>
  <create-edit :pointing="pointing" @reload="table.refresh()"></create-edit>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { dayjs, t } from '@/plugins'
import CreateEdit from './components/CreateEdit'
import PeriodType from '@/components/PeriodType'
import { ElMessageBox, ElNotification } from 'element-plus'
import { useDialog, InputFilter, SelectFilter, useQuery } from '@/helpers'

import { usePointingTasksStore } from '@/stores/pointingTasks'
import { useSiteStore } from '@/stores/site'
import { useTaskStore } from '@/stores/task'
import { useCultivationStore } from '@/stores/cultivation'
import { usePointingReasonStore } from '@/stores/pointingReason'
import { useUnityStore } from '@/stores/unity'
import { useVarietyStore } from '@/stores/variety'
import { useStadeStore } from '@/stores/stade'
import { useParcelStore } from '@/stores/parcel'
import { useEmployeeStore } from '@/stores/employee'
import { TIME_FORMAT } from '@/constants'

const pointingTaskStore = usePointingTasksStore()
const siteStore = useSiteStore()
const taskStore = useTaskStore()
const cultivationStore = useCultivationStore()
const pointingReasonStore = usePointingReasonStore()
const unityStore = useUnityStore()
const varietyStore = useVarietyStore()
const stadeStore = useStadeStore()
const employeesStore = useEmployeeStore()
const parcelStore = useParcelStore()

const loading = ref(false)
const payClosure = ref({
  id: null,
  status: false,
  start_date: null,
  end_date: null,
  added_at: null,
})
const pointing = ref(null)
const selectedRows = ref([])
const table = ref(null)
const isFilteredByTotalCost = ref(false)
const totalCostFilter = ref([
  { value: false, label: 'all-data' },
  { value: true, label: 'non-valid-data' },
])

const ajax = computed(() => ({
  query: (params) => {
    if (!payClosure.value?.id) {
      return { page: { total: 0 }, result: [] }
    }

    const query = useQuery(params)

    query.filter['pay_closure_id'] = payClosure.value.id
    query.filter['added_at'] = query.filter['added_at'] ?? payClosure.value.added_at

    if (isFilteredByTotalCost.value) {
      query.filter['total_cost'] = 'null'
    }

    return new Promise((resolve) => {
      pointingTaskStore.fetchPointingTasks(query).then(({ data, total }) => {
        resolve({
          page: {
            total: total,
          },
          result: data?.map((el) => ({
            ...el,
            'employee.uid': el.employee.uid,
            employee_fullname: `${el.employee.firstname} ${el.employee.lastname}`,
            'leader.uid': el.leader?.uid ? el.leader.uid : null,
            leader_fullname: el.leader ? `${el.leader.firstname} ${el.leader.lastname}` : null,
          })),
        })
      })
    })
  },
}))

const columns = computed(() => [
  { type: 'checkbox', width: 42, align: 'center', visible: payClosure.value.status },
  {
    field: 'added_at',
    title: t('date'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).format('DD-MM-YYYY'),
    className: getColumnClassName,
    ...InputFilter({
      type: 'date',
      payClosure: payClosure.value,
      data: payClosure.value.start_date,
    }),
  },
  {
    field: 'added_time',
    title: t('time'),
    className: getColumnClassName,
    formatter: ({ row }) => dayjs(row.added_at).format(TIME_FORMAT),
  },
  {
    field: 'leader.uid',
    title: t('leader-code'),
    visible: false,
    className: getColumnClassName,
    ...InputFilter({ type: 'number' }),
  },
  {
    field: 'leader_fullname',
    visible: false,
    title: t('leader'),
    className: getColumnClassName,
    ...InputFilter(),
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
    field: 'site.name',
    title: t('site'),
    className: getColumnClassName,
    ...SelectFilter({
      filters: siteStore.sites?.map((el) => ({ label: el.name, value: el.name })) ?? [],
    }),
  },
  {
    field: 'variety.name',
    title: t('variety'),
    className: getColumnClassName,
    ...SelectFilter({
      filters: varietyStore.varieties?.map((el) => ({ label: el.name, value: el.name })) ?? [],
    }),
  },
  {
    field: 'task.stade.name',
    title: t('stade'),
    visible: false,
    className: getColumnClassName,
    ...SelectFilter({
      filters: stadeStore.stades?.map((el) => ({ label: el.name, value: el.name })) ?? [],
    }),
  },
  {
    field: 'task.name',
    title: t('task'),
    className: getColumnClassName,
    ...SelectFilter({
      filters: taskStore.tasks?.map((el) => ({ label: el.name, value: el.name })) ?? [],
    }),
  },
  {
    field: 'cultivation.parcel.name',
    title: t('parcel'),
    className: getColumnClassName,
    ...InputFilter(),
  },
  {
    field: 'cultivation.code',
    title: t('drilling-code'),
    className: getColumnClassName,
    ...InputFilter(),
  },
  {
    field: 'cultivation.available_surface',
    title: t('available-surface'),
    className: getColumnClassName,
    ...InputFilter(),
  },
  {
    field: 'cultivation.arrached_surface',
    title: t('arrached-surface'),
    className: getColumnClassName,
    ...InputFilter(),
  },
  {
    field: 'user.username',
    title: t('added-by'),
    className: getColumnClassName,
    ...InputFilter(),
  },
  {
    field: 'reason.reason',
    title: t('reason'),
    visible: false,
    className: getColumnClassName,
    ...SelectFilter({
      filters: pointingReasonStore.reasons.map(({ reason }) => ({ label: reason, value: reason })) ?? [],
    }),
  },
  {
    field: 'unity.label',
    title: t('unity'),
    formatter: ({ row: { unity } }) => (unity ? `${unity.label} (${unity.code})` : t('hour')),
    className: getColumnClassName,
    ...SelectFilter({ filters: unityStore.getUnities }),
  },
  {
    field: 'box_code',
    title: t('box-code'),
    visible: false,
    className: getColumnClassName,
    filters: [{ data: '' }],
    ...InputFilter(),
  },
  {
    field: '_number',
    title: t('number'),
    formatter: ({ row: { nbr_hours, nbr_unities } }) => {
      return !nbr_unities ? nbr_hours : nbr_unities
    },
    className: getColumnClassName,
  },
  {
    field: 'hours_bonus',
    title: t('hours-bonus'),
    className: getColumnClassName,
  },
  {
    field: 'task_bonus',
    title: t('task-bonus'),
    className: getColumnClassName,
  },
  {
    field: 'calc_base',
    title: t('calc-base'),
    className: getColumnClassName,
    visible: false,
  },
  {
    field: 'analytic_salary',
    title: t('analytic-salary'),
    className: getColumnClassName,
    visible: false,
  },
  {
    field: 'employer_share',
    title: t('employer-share'),
    className: getColumnClassName,
    visible: false,
  },
  {
    field: 'total_cost',
    title: t('total-cost'),
    className: getColumnClassName,
    ...(isFilteredByTotalCost.value ? {} : InputFilter({ type: 'number' })),
  },
  {
    field: 'is_nature',
    title: t('is-nature'),
    formatter: ({ cellValue }) => t(cellValue ? 'auto' : 'manual'),
    className: getColumnClassName,
  },
  {
    title: t('actions'),
    width: 140,
    slots: { default: 'actions' },
    visible: payClosure.value.status,
    className: getColumnClassName,
  },
])

onMounted(() => {
  siteStore.fetchAllSites()
  taskStore.fetchAllTasks()
  employeesStore.fetchAllEmployees({ get: ['id,uid,firstname,lastname,type_id'] })
  pointingReasonStore.fetchAllReasons()
  unityStore.fetchUnities({ list: true })
  cultivationStore.fetchCultivations({ list: true })
  varietyStore.fetchAllVarieties()
  stadeStore.fetchAllStades()
  parcelStore.fetchAllParcels()
})

const checkboxChangeEvent = (e) => {
  selectedRows.value = e.records.map(({ id, employee_id }) => ({ id, employee_id }))
}

const payClosureChange = (value) => {
  payClosure.value = Object.assign({}, { ...value, added_at: null })
  table.value.refresh()
}

const addHandler = () => {
  pointing.value = { payClosure: payClosure.value }
  openDialog()
}

const editHandler = (row) => {
  pointing.value = Object.assign({}, { ...row, payClosure: payClosure.value })
  openDialog()
}

const deleteHandler = (row) => {
  const { id, cultivation_id, task_id } = row
  const cultivation = cultivationStore.cultivations.find(({ id }) => id === cultivation_id)
  const is_task_direct = taskStore.tasks.find(({ id }) => id == task_id)?.is_direct

  if (!dayjs(cultivation?.uprooting_date).isSameOrBefore(dayjs(), 'day') || !is_task_direct) {
    loading.value = true
    pointingTaskStore.removePointingTasks(id).finally(() => {
      table.value.refresh()
      loading.value = false
    })
  } else {
    ElNotification.error({
      title: t('error'),
      message: t('the-uprooting-date-has-already-passed'),
      position: 'bottom-right',
      showClose: true,
      duration: 3000,
    })
  }
}

const deleteMultiPointingTasks = () => {
  ElMessageBox.confirm(t('are-you-sure-to-delete-this'), {
    confirmButtonText: t('yes'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  })
    .then(() => {
      loading.value = true
      pointingTaskStore
        .removePointingTasks(selectedRows.value.map(({ id }) => id))
        .catch(() => {
          ElNotification.error({
            title: t('error'),
            message: t('one-of-items-is-already-used-somewhere-else'),
            position: 'bottom-right',
            showClose: true,
            duration: 3000,
          })
        })
        .finally(() => {
          refreshTable()
          loading.value = false
        })
    })
    .catch(() => {})
}

const openDialog = () => {
  useDialog.open('create_edit_pointing_tasks')
}

const refreshTable = () => {
  table.value.refresh()
  selectedRows.value = []
}

const launchProcessing = ({ added_at, status, id }) => {
  loading.value = true
  payClosure.value = Object.assign({}, { ...payClosure.value, id, status, added_at })

  pointingTaskStore
    .processPointingTasks({
      pay_closure_id: id,
      added_at,
    })
    .finally(() => {
      loading.value = false
      table.value.refresh()
    })
}

const onFilterErrorChange = () => {
  if (payClosure.value?.id) {
    table.value.refresh()
  }
}

const getColumnClassName = ({ row }) => {
  return row?.total_cost == null ? 'bg-red-50 text-red-500' : null
}
</script>
