<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="company-edit"
      delete-permission="company-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'company-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-company') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :company="company" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { computed, onMounted, ref } from 'vue'
import CreateEdit from './components/CreateEdit'
import { useCompanyStore } from '@/stores/company'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { dayjs, t } from '@/plugins'

const loading = ref(false)
const company = ref({})
const vxtable = ref(null)

const companyStore = useCompanyStore()

const empTypeStore = useEmployeeTypeStore()
onMounted(() => empTypeStore.fetchEmployeeTypes({ list: true }))

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      companyStore.fetchCompanies(query).then(({ data, total }) => {
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
  { field: 'code', title: t('code') },
  { field: 'name', title: t('name') },
  { field: 'address', title: t('address') },
  { field: 'tax_identification', title: t('tax-identification') },
  { field: 'trade_registry', title: t('trade-registry') },
  { field: 'work_accident_insurance', title: t('work-accident-insurance') },
  { field: 'license_number', title: t('license-number') },
  {
    field: 'employee_types',
    title: t('employee-types'),
    className: '[&>*]:text-[0.8rem]',
    formatter: ({ cellValue }) =>
      cellValue?.length ? cellValue.map(({ name }, index) => `${index ? ' ' : ''}${name}`) : null,
  },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  company.value = {}
  openDialog()
}

const editHandler = (value) => {
  company.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  companyStore.removeCompany(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_company')
}
</script>
