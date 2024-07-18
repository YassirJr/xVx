<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <div v-loading="loading">
      <vx-table
        ref="vxtable"
        :columns="columns"
        :ajax="ajax"
        edit-permission="pointing-in-out-edit"
        delete-permission="pointing-in-out-delete"
        :custom-pagination-size="[{ label: $t('all'), value: -1 }]"
        @edit="editHandler"
        @delete="deleteHandler"
      >
        <template #toolbar>
          <div class="flex justify-start items-center">
            <div v-if="payClosure.status" class="mr-3">
              <el-button v-can="'pointing-in-out-create'" plain type="primary" @click="addHandler()">
                <i-el-plus class="mr-2" />
                {{ $t('new-pointing') }}
              </el-button>
            </div>
            <period-type @pay-closure-change="payClosureChange" />
          </div>
        </template>
      </vx-table>
    </div>
  </div>
  <create-edit :pointing="pointing" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import PeriodType from '@/components/PeriodType'
import { ref, computed, onMounted } from 'vue'
import { t, dayjs } from '@/plugins'
import { useQuery, useDialog, SelectFilter, InputFilter } from '@/helpers'
import { DATE_FORMAT, TIME_FORMAT } from '@/constants'
import { usePointingInOutStore } from '@/stores/pointingInOut'
import { useEmployeeStore } from '@/stores/employee'
import { useVehicleStore } from '@/stores/vehicle'
import { usePointingReasonStore } from '@/stores/pointingReason'
import { useSiteStore } from '@/stores/site'

const payClosure = ref({
  id: null,
  status: false,
  start_date: null,
  end_date: null,
})
const loading = ref(false)
const pointing = ref({})
const vxtable = ref(null)

const pointingInOutStore = usePointingInOutStore()
const employeeStore = useEmployeeStore()
const vehicleStore = useVehicleStore()
const pointingReasonStore = usePointingReasonStore()
const siteStore = useSiteStore()

onMounted(() => {
  siteStore.fetchAllSites({ list: true })
  vehicleStore.fetchAllVehicles()
  employeeStore.fetchAllEmployees({ get: ['id,uid,firstname,lastname,type_id'] })
  pointingReasonStore.fetchAllReasons({ list: true })
})

const ajax = computed(() => {
  return {
    query: (params) => {
      if (!payClosure.value?.id) {
        return { page: { total: 0 }, result: [] }
      }
      const query = useQuery(params)

      query.filter['pay_closure_id'] = payClosure.value.id

      return new Promise((resolve) => {
        pointingInOutStore.fetchPointingInOut(query).then(({ data, total }) => {
          resolve({
            page: {
              total: total,
            },
            result: data?.map((el) => ({
              ...el,
              employee_fullname: `${el.employee.firstname} ${el.employee.lastname}`,
            })),
          })
        })
      })
    },
  }
})

const columns = computed(() => {
  return [
    {
      field: 'added_at',
      title: t('date-time'),
      sortable: true,
      type: 'html',
      width: 210,
      formatter: ({ cellValue }) =>
        `<div class="py-[13px]">
              <div class="absolute left-0 top-0 w-full h-full items-center grid grid-cols-2">
                <div class="col-span-1 border-r p-2">${dayjs(cellValue).format(DATE_FORMAT)}</div>
                <div class="col-span-1 p-2">${dayjs(cellValue).format(TIME_FORMAT)}</div>
              </div>
            </div>`,
      ...InputFilter({ type: 'date', payClosure: payClosure.value, data: payClosure.value.start_date }),
    },
    {
      field: 'employee.uid',
      title: t('employee-code'),
      ...InputFilter({ type: 'number' }),
    },
    {
      field: 'employee_fullname',
      title: t('employee'),
    },
    {
      field: 'site.name',
      title: t('site'),
      ...SelectFilter({ filters: siteStore.sites?.map((el) => ({ label: el.name, value: el.name })) ?? [] }),
    },
    {
      field: 'user.username',
      title: t('added-by-device'),
      visible: false,
      formatter: ({ row }) => (row.device_id ? row.device.name : row.user.username),
    },
    {
      field: 'reason.reason',
      title: t('reason'),
      visible: false,
    },
    {
      field: 'is_nature',
      title: t('is-nature'),
      formatter: ({ cellValue }) => t(cellValue ? 'auto' : 'manual'),
    },
    {
      title: t('actions'),
      width: 140,
      slots: { default: 'actions' },
      visible: payClosure.value.status,
    },
  ]
})

const payClosureChange = (val) => {
  payClosure.value = val
  vxtable.value.refresh()
}

const addHandler = () => {
  pointing.value = { payClosure: payClosure.value }
  openDialog()
}

const editHandler = (val) => {
  pointing.value = Object.assign({}, { ...val, payClosure: payClosure.value })
  openDialog()
}

const deleteHandler = (value) => {
  loading.value = true
  pointingInOutStore.removePointingInOut(value.id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_pointing_in_out')
}
</script>
