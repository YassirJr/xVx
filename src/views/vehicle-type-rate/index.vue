<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="vehicle-type-rate-edit"
      delete-permission="vehicle-type-rate-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'vehicle-type-rate-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-vehicle-type-rate') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :vehicle-type-rate="vehicleTypeRate" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { ref, computed } from 'vue'
import { useQuery, useDialog, InputFilter, SelectFilter } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { useVehicleTypeStore } from '@/stores/vehicleTypes'

const vxtable = ref(null)
const loading = ref(false)
const vehicleTypeRate = ref({})

const vehicleTypeStore = useVehicleTypeStore()

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      vehicleTypeStore.fetchRates(query).then(({ data, total }) => {
        resolve({
          page: { total: total },
          result: data,
        })
      })
    })
  },
}))

const columns = computed(() => [
  {
    field: 'vehicle_type.name',
    title: t('vehicle-type'),
    ...SelectFilter({
      filters: vehicleTypeStore.vehicleTypes.map(({ name }) => ({ label: name, value: name })) ?? [],
    }),
  },
  { field: 'min', title: t('min-kilometer'), ...InputFilter({ type: 'number' }) },
  { field: 'max', title: t('max-kilometer'), ...InputFilter({ type: 'number' }) },
  { field: 'rate', title: t('price-per-place'), ...InputFilter({ type: 'number' }) },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  vehicleTypeRate.value = {}
  openDialog()
}

const editHandler = (value) => {
  vehicleTypeRate.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true

  vehicleTypeStore.removeRate(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_vehicle_type_rate')
}
</script>
