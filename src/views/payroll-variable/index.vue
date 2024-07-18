<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="payroll-variable-edit"
      delete-permission="payroll-variable-delete"
      @edit="editHandler"
      @delete="deleteHandler"
      @checkbox-change="checkboxChangeEvent"
    >
      <template #toolbar>
        <div class="flex justify-start items-center">
          <div v-if="employee_type_id" class="mr-3">
            <el-button v-can="'payroll-variable-create'" plain type="primary" @click="addHandler()">
              <i-el-plus class="mr-2" />
              {{ $t('new-payroll-variable') }}
            </el-button>
          </div>
          <period-type hide-period @employee-type-change="employeeTypeChange" />
          <div v-if="employee_type_id" class="ml-3">
            <el-popconfirm
              v-if="selectedRows.length"
              :title="$t('are-you-sure-to-delete-this')"
              @confirm="deleteMultiPayrollVariables()"
            >
              <template #reference>
                <el-button v-can="'payroll-variable-delete'" plain type="danger">
                  <i-el-delete class="mr-2" />
                  {{ $t('delete') }}
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </vx-table>
  </div>
  <create-edit :payroll-variable="payrollVariable" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { DATE_FORMAT } from '@/constants'
import { useQuery, useDialog, InputFilter, SelectFilter } from '@/helpers'
import { t, dayjs } from '@/plugins'
import CreateEdit from './components/CreateEdit'
import PeriodType from '@/components/PeriodType'

import { useEmployeeStore } from '@/stores/employee'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { usePayrollSectionStore } from '@/stores/payrollSection'
import { usePayrollVariableStore } from '@/stores/payrollVariable'

const employeeStore = useEmployeeStore()
const payrollVariableStore = usePayrollVariableStore()
const employeeTypesStore = useEmployeeTypeStore()
const payrollSectionStore = usePayrollSectionStore()

const vxtable = ref()
const loading = ref(false)
const employee_type_id = ref(null)
const selectedRows = ref([])
const payClosures = ref([])
const payrollVariable = ref({})

const ajax = computed(() => ({
  query: (params) => {
    if (!employee_type_id.value) return { page: { total: 0 }, result: [] }

    params.filters.push({ property: 'employee.type_id', values: [employee_type_id.value] })

    const query = useQuery(params)

    return new Promise((resolve) => {
      payrollVariableStore.fetchPayrollVariables(query).then(({ data, total }) => {
        resolve({
          page: {
            total: total,
          },
          result: data,
        })
      })
    })
  },
}))

const columns = computed(() => [
  { type: 'checkbox', width: 42, align: 'center', visible: employee_type_id.value !== null },
  {
    field: 'pay_closure_id',
    title: t('payroll-period'),
    formatter: ({ row }) =>
      `${dayjs(row.pay_closure.start_date).format(DATE_FORMAT)} - ${dayjs(row.pay_closure.end_date).format(
        DATE_FORMAT,
      )}`,
    className: ({ row }) =>
      row?.pay_closure?.status ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50',
    width: 200,
    ...SelectFilter({
      multiple: true,
      clearable: true,
      options:
        payClosures.value.map((el) => ({
          label: `${dayjs(el.start_date).format(DATE_FORMAT)} - ${dayjs(el.end_date).format(DATE_FORMAT)}`,
          value: el.id,
        })) ?? [],
    }),
  },
  { field: 'employee.type.name', title: t('employee-type') },
  {
    field: 'employee.type.frequency_pay',
    title: t('payroll-period'),
    formatter: ({ cellValue }) => t(employeeTypesStore.getFrequencyPay(cellValue)),
  },
  { field: 'employee.uid', title: t('employee-code'), ...InputFilter({ type: 'number' }) },
  {
    field: 'employee',
    title: t('employee'),
    formatter: ({ cellValue: { firstname, lastname } }) => `${firstname} ${lastname}`,
  },
  { field: 'payroll_section.code', title: t('code'), ...InputFilter({ type: 'number' }) },
  { field: 'payroll_section.label', title: t('label') },
  { field: 'value', title: t('value'), ...InputFilter({ type: 'number' }) },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

onMounted(() => {
  employeeTypesStore.fetchEmployeeTypes({ list: true })
  payrollSectionStore.fetch({ list: true })
  employeeStore.fetchAllEmployees({ get: ['id,uid,firstname,lastname,type_id'] })
})

const addHandler = () => {
  payrollVariable.value = {
    employee_type_id: employee_type_id.value,
    payClosures: payClosures.value.filter(({ status }) => status),
  }
  openDialog()
}

const editHandler = (value) => {
  payrollVariable.value = Object.assign({}, { ...value, employee_type_id: employee_type_id.value })
  openDialog()
}

const deleteHandler = (value) => {
  loading.value = true
  payrollVariableStore.removePayrollVariable(value?.id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const checkboxChangeEvent = (e) => (selectedRows.value = e.records.map(({ id }) => id))

const openDialog = () => useDialog.open('create_edit_payroll_variable')

const employeeTypeChange = (el) => {
  payClosures.value = el.payClosures
  employee_type_id.value = el.employee_type_id
  vxtable.value.refresh()
}

const refreshTable = () => {
  vxtable.value.refresh()
  selectedRows.value = []
}

const deleteMultiPayrollVariables = () => {
  loading.value = true
  payrollVariableStore.removePayrollVariable(selectedRows.value).finally(() => {
    refreshTable()
    loading.value = false
  })
}
</script>
