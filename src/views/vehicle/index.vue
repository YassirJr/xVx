<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="vehicle-edit"
      delete-permission="vehicle-delete"
      @edit="editHandler"
      @delete="deleteHandler"
      @checkbox-change="checkboxChangeEvent"
    >
      <template #toolbar>
        <el-button v-can="'vehicle-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-vehicle') }}
        </el-button>
        <div class="ml-3">
          <el-button v-if="selectedRows?.length" plain type="primary" @click="downloadFile(selectedRows)">
            <i-tabler-download class="mr-2" />
            {{ $t('download-selected') }}
          </el-button>
        </div>
      </template>
      <template #more_actions="row">
        <el-button plain type="info" @click="downloadFile([row])">
          <i-tabler-id />
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :vehicle="vehicle" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery, InputFilter, SelectFilter } from '@/helpers'
import { ref, computed, onMounted } from 'vue'
import { dayjs, t } from '@/plugins'

import CreateEdit from './components/CreateEdit'
import roadImg from '@/assets/images/road.webp'
import { downloadDocs } from '@/helpers/docs'

import { useVehicleTypeStore } from '@/stores/vehicleTypes'
import { useTransporterStore } from '@/stores/transporter'
import { useVehicleStore } from '@/stores/vehicle'

const vehicleTypeStore = useVehicleTypeStore()
const transporterStore = useTransporterStore()
const vehicleStore = useVehicleStore()

const loading = ref(false)
const vehicle = ref(null)
const selectedRows = ref([])
const vxtable = ref()

const columns = computed(() => [
  { type: 'checkbox', width: 45, align: 'center' },
  {
    field: 'transporter.name',
    title: t('name'),
    ...InputFilter(),
  },
  { field: 'registration_nbr', title: t('registration-nbr'), ...InputFilter() },
  { field: 'places_nbr', title: t('places-nbr') },
  { field: 'nbr_place_max', title: t('nbr-place-max'), ...InputFilter({ type: 'number' }) },
  { field: 'nbr_place_min', title: t('nbr-place-min'), ...InputFilter({ type: 'number' }) },
  {
    field: 'calc_mode',
    title: t('calc-mode'),
    formatter: ({ cellValue }) => t(vehicleStore.calcModes.find(({ value }) => value == cellValue).label),
    ...SelectFilter({
      filters: vehicleStore.calcModes.map(({ label, value }) => ({ label: t(label), value: value })) ?? [],
    }),
  },
  {
    field: 'calc_average',
    title: t('calc-average'),
    formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
  },
  {
    field: 'calc_avg_per_grower',
    title: t('calc-avg-per-grower'),
    formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
  },
  {
    field: 'type.name',
    title: t('type'),
    filterMultiple: false,
  },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      vehicleStore.fetchVehicles(query).then(({ data, total }) => {
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

onMounted(() => {
  vehicleTypeStore.fetchVehicleTypes({ list: true })
  transporterStore.fetch({ list: true })
})

const addHandler = () => {
  vehicle.value = {}
  openDialog()
}

const editHandler = (value) => {
  vehicle.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  vehicleStore.removeVehicle(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_vehicle')
}

const downloadFile = (rows) => {
  loading.value = true
  downloadDocs({
    data: rows,
    docType: 'vehicle-ticket',
    roadImg,
  }).finally(() => (loading.value = false))
}

const checkboxChangeEvent = (e) => {
  selectedRows.value = e.records
}
</script>
