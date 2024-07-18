<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="transporter-edit"
      delete-permission="transporter-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'transporter-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-transporter') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :transporter="transporter" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { computed, ref, onMounted } from 'vue'
import CreateEdit from './components/CreateEdit'
import { t } from '@/plugins'
import { useTransporterStore } from '@/stores/transporter'
import { useBankStore } from '@/stores/bank'

const loading = ref(false)
const transporter = ref({})
const vxtable = ref(null)

const transporterStore = useTransporterStore()
const bankStore = useBankStore()

onMounted(() => bankStore.fetchBanks({ list: true }))

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      transporterStore.fetch(query).then(({ data, meta }) => {
        resolve({
          page: {
            total: meta.total,
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
  { field: 'phone_number', title: t('phone-number') },
  { field: 'address', title: t('address') },
  { field: 'city', title: t('city') },
  { field: 'bank.label', title: t('bank') },
  { field: 'bank_statement', title: t('bank-statement') },
  {
    field: 'status',
    title: t('status'),
    formatter: ({ cellValue }) => t(cellValue ? 'active' : 'inactive'),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  transporter.value = {}
  openDialog()
}

const editHandler = (value) => {
  transporter.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  transporterStore.remove(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_transporter')
}
</script>
