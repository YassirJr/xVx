<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="table"
      :columns="columns"
      :ajax="ajax"
      edit-permission="client-edit"
      delete-permission="client-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'client-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-client') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :client="client" @reload="table.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, InputFilter, SelectFilter, useQuery } from '@/helpers'
import { ref, computed } from 'vue'
import { countries } from '@/constants'
import { dayjs, t } from '@/plugins'
import CreateEdit from './components/CreateEdit'
import { useClientStore } from '@/stores/client'

const loading = ref(false)
const client = ref({})
const clientStore = useClientStore()

const table = ref(null)

const columns = computed(() => [
  { field: 'code', title: t('code'), ...InputFilter() },
  { field: 'name', title: t('name'), ...InputFilter() },
  { field: 'address', title: t('address') },
  { field: 'city', title: t('city') },
  {
    field: 'country',
    title: t('country'),
    formatter: ({ cellValue }) => countries.find(({ code }) => code === cellValue)?.name,
  },
  {
    field: 'is_international',
    title: t('market'),
    formatter: ({ cellValue }) => (cellValue ? t('international') : t('local-market')),
  },
  { field: 'currency', title: t('currency'), formatter: ({ cellValue }) => t(cellValue) },
  { field: 'phone_number', title: t('phone-number') },
  {
    field: 'is_active',
    title: t('status'),
    formatter: ({ cellValue }) => (cellValue ? t('active') : t('inactive')),
    className: ({ row }) => (row.is_active ? 'text-green-500' : 'text-red-500'),
    ...SelectFilter({
      filters: clientStore.statusList.map(({ label, value }) => ({ label: t(label), value: value })),
    }),
  },
  {
    field: 'created_at',
    title: t('created-at'),
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      clientStore.fetchClients(query).then(({ data, total }) => {
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

const addHandler = () => {
  client.value = {}
  openDialog()
}

const editHandler = (value) => {
  client.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = (client) => {
  loading.value = true
  clientStore.removeClient(client.id).finally(() => {
    table.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_client')
}
</script>
