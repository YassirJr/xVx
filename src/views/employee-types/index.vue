<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="employee-type-edit"
      delete-permission="employee-type-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'employee-type-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-type') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :type="type" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { isQFS, useQuery, useDialog } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { ref, computed, onMounted } from 'vue'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { useMissionStore } from '@/stores/mission'
import { useDepartmentStore } from '@/stores/department'
import { TIME_FORMAT } from '@/constants'

const loading = ref(false)
const type = ref({})
const vxtable = ref(null)

const employeeTypeStore = useEmployeeTypeStore()

const missionStore = useMissionStore()
const departmentStore = useDepartmentStore()

onMounted(() => {
  departmentStore.fetchDepartments({ list: true })
  missionStore.fetchAllMissions({ list: true })
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)
    return new Promise((resolve) => {
      employeeTypeStore.fetchEmployeeTypes(query).then(({ data, total }) => {
        resolve({
          page: { total: total },
          result: data,
        })
      })
    })
  },
}))

const columns = computed(() => [
  { field: 'name', title: t('label') },
  {
    field: 'cnss_scheme',
    title: t(isQFS ? 'css-scheme' : 'cnss-scheme'),
    visible: false,
    formatter: ({ cellValue }) => t(employeeTypeStore.getCnssScheme(cellValue)),
  },
  {
    field: 'cnss_affiliation',
    title: t(isQFS ? 'css-affiliation' : 'cnss-affiliation'),
  },
  {
    field: 'frequency_pay',
    title: t('frequency-pay'),
    formatter: ({ cellValue }) => t(employeeTypeStore.getFrequencyPay(cellValue)),
  },
  {
    field: 'nbr_hours',
    title: t('number-of-normal-hours'),
    formatter: ({ cellValue }) => employeeTypeStore.getNbrHours(cellValue),
  },
  {
    field: 'auto_pause',
    title: t('auto-pause'),
    visible: false,
  },
  {
    field: 'fixed_time',
    title: t('fixed-time'),
    visible: false,
  },
  {
    field: 'day_off',
    title: t('day-off'),
    formatter: ({ cellValue }) => t(employeeTypeStore.getDayOff(cellValue)),
  },
  {
    field: 'type_day_off',
    title: t('type-day-off'),
    visible: false,
    formatter: ({ cellValue }) => t(employeeTypeStore.getTypeDayOff(cellValue)),
  },
  {
    field: 'calc_day_off',
    title: t('calculate-extra-hours-day-off'),
    visible: false,
    formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
  },
  {
    field: 'nbr_days_per_period',
    title: t('days-per-period'),
    visible: false,
  },
  {
    field: 'start_hour_extra_25',
    title: t(isQFS ? 'start-hour-extra-25-40' : 'start-hour-extra-25'),
    visible: false,
    formatter: ({ cellValue }) => dayjs(cellValue).format(TIME_FORMAT),
  },
  {
    field: 'end_hour_extra_25',
    title: t(isQFS ? 'end-hour-extra-25-40' : 'end-hour-extra-25'),
    visible: false,
    formatter: ({ cellValue }) => dayjs(cellValue).format(TIME_FORMAT),
  },
  {
    field: 'start_hour_extra_50',
    title: t(isQFS ? 'start-hour-extra-60' : 'start-hour-extra-50'),
    visible: false,
    formatter: ({ cellValue }) => dayjs(cellValue).format(TIME_FORMAT),
  },
  {
    field: 'end_hour_extra_50',
    title: t(isQFS ? 'end-hour-extra-60' : 'end-hour-extra-50'),
    visible: false,
    formatter: ({ cellValue }) => dayjs(cellValue).format(TIME_FORMAT),
  },
  {
    field: 'calc_seniority',
    title: t('calc-seniority'),
    visible: false,
    formatter: ({ cellValue }) => t(employeeTypeStore.getCalcSeniority(cellValue)),
  },
  {
    field: 'pay_basis',
    title: t('pay-basis'),
    formatter: ({ cellValue }) => t(employeeTypeStore.getPayBasis(cellValue)),
  },
  { field: 'base_salary', title: t('base-salary'), showHeaderOverflow: 'tooltip' },
  {
    field: 'source_pointing_hours',
    title: t('source-pointing-hours'),
    formatter: ({ cellValue }) => t(employeeTypeStore.getPointingHourSource(cellValue)),
  },
  {
    field: 'calc_extra_hours',
    title: t('calc-extra-hours'),
    formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
  },
  {
    field: 'source_pointing_unities',
    title: t('source-pointing-unities'),
    formatter: ({ cellValue }) => (cellValue ? t(employeeTypeStore.getPointingUnitySource(cellValue)) : null),
  },
  {
    field: 'department.label',
    title: t('department'),
    visible: false,
  },
  { field: 'mission.label', title: t('mission'), visible: false },
  {
    field: 'created_at',
    title: t('created-at'),
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
    sortable: true,
    visible: false,
  },
  { title: t('actions'), width: 140, slots: { default: 'actions' } },
])

const addHandler = () => {
  type.value = {}
  openDialog()
}

const editHandler = (value) => {
  type.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  employeeTypeStore.removeEmployeeType(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_employee_type')
}
</script>
