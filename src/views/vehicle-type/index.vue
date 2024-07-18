<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="vehicle-type-edit"
      delete-permission="vehicle-type-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'vehicle-type-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :vehicle-type="vehicleType" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { ref, computed } from 'vue'
import { dayjs, t } from '@/plugins'

import CreateEdit from './components/CreateEdit'

import { useVehicleTypeStore } from '@/stores/vehicleTypes'

const vehicleTypeStore = useVehicleTypeStore()

const loading = ref(false)
const vxtable = ref(null)
const vehicleType = ref(null)

const columns = computed(() => [
  { title: t('name'), field: 'name' },
  {
    title: t('group'),
    field: 'group',
    formatter: ({ cellValue }) =>
      t(vehicleTypeStore.vehicleTypeGroups.find(({ value }) => value == cellValue).label),
  },
  { title: t('nbr-place-min'), field: 'nbr_place_min' },
  { title: t('nbr-place-max'), field: 'nbr_place_max' },
  {
    title: t('created-at'),
    field: 'created_at',
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), field: 'actions', width: 200, slots: { default: 'actions' } },
])
const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    query.sort = params.sorts.length ? 'created_at' : '-created_at'

    return new Promise((resolve) => {
      vehicleTypeStore.fetchVehicleTypes(query).then(({ data, total }) => {
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
  vehicleType.value = {}
  openDialog()
}

const editHandler = (value) => {
  vehicleType.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  vehicleTypeStore.removeVehicleType(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_vehicle_type')
}
</script>
