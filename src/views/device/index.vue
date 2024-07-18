<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="device-edit"
      delete-permission="device-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'device-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-new-device') }}
        </el-button>
      </template>
      <template #more_actions="row">
        <el-button v-can="'device-sync-employees'" plain type="success" @click="openSyncDialog(row)">
          <i-el-user />
        </el-button>
      </template>
    </vx-table>
  </div>

  <create-edit :device="device" @reload="vxtable.refresh()"></create-edit>
  <sync-employees :device="device"></sync-employees>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import SyncEmployees from './components/SyncEmployees'
import { ref, computed, onMounted } from 'vue'
import { t, dayjs } from '@/plugins'
import { useDialog, useQuery } from '@/helpers'
import { useDeviceStore } from '@/stores/device'
import { useSiteStore } from '@/stores/site'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'

const loading = ref(false)
const device = ref({})
const vxtable = ref(null)

const deviceStore = useDeviceStore()

const siteStore = useSiteStore()
onMounted(() => siteStore.fetchAllSites({ list: true }))

const employeeTypeStore = useEmployeeTypeStore()
onMounted(() => employeeTypeStore.fetchEmployeeTypes({ list: true }))

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)
    return new Promise((resolve) => {
      deviceStore.fetchDevices(query).then(({ data, total }) => {
        resolve({ page: { total }, result: data })
      })
    })
  },
}))

const columns = computed(() => [
  { title: t('name'), field: 'name' },
  { title: t('tag-id'), field: 'tag_id' },
  { title: t('token'), field: 'token' },
  { title: t('site'), field: 'site.name' },
  {
    field: 'status',
    title: t('status'),
    className: ({ row }) => (row?.status ? 'text-green-500' : 'text-red-500'),
    formatter: ({ cellValue }) => (cellValue ? t('available') : t('not-available')),
  },
  {
    title: t('created-at'),
    field: 'created_at',
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), field: 'actions', width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  device.value = {}
  openDialog()
}

const editHandler = (value) => {
  device.value = value
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  deviceStore.removeDevice(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_device')
}

const openSyncDialog = (value) => {
  device.value = value
  useDialog.open('sync_employees_device')
}
</script>
