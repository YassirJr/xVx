<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="supplier-edit"
      delete-permission="supplier-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'supplier-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-supplier') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :supplier="supplier" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { ref, computed, onMounted } from 'vue'
import { countries } from '@/constants'
import { useQuery, useDialog } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { useSupplierStore } from '@/stores/supplier'
import { useBankStore } from '@/stores/bank'

const loading = ref(false)
const supplier = ref({})
const vxtable = ref(null)

const supplierStore = useSupplierStore()

const bankStore = useBankStore()
onMounted(() => bankStore.fetchBanks({ list: true }))

const ajax = computed(() => ({
  query: (param) => {
    const query = useQuery(param)
    return new Promise((resolve) => {
      supplierStore.fetchSuppliers(query).then(({ data, total }) => {
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
  { field: 'city', title: t('city') },
  {
    field: 'country',
    title: t('country'),
    formatter: ({ cellValue }) => countries.find(({ code }) => code === cellValue)?.name,
  },
  { field: 'currency', title: t('currency'), formatter: ({ cellValue }) => t(cellValue) },
  { field: 'phone_number', title: t('phone-number') },
  { field: 'bank.label', title: t('bank') },
  { field: 'bank_statement', title: t('bank-statement') },
  {
    field: 'is_active',
    title: t('status'),
    formatter: ({ cellValue }) => (cellValue ? t('active') : t('inactive')),
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
  supplier.value = {}
  openDialog()
}

const editHandler = (value) => {
  supplier.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  supplierStore.removeSupplier(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_supplier')
}
</script>
