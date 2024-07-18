<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="transport-rate-edit"
      delete-permission="transport-rate-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'transport-rate-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-transport-rate') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :transport-rate="transportRate" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { ref, computed, onMounted } from 'vue'
import { t, dayjs } from '@/plugins'
import { useQuery, useDialog, InputFilter, SelectFilter } from '@/helpers'
import { DATE_FORMAT } from '@/constants'

import { useTransportRateStore } from '@/stores/transportRate'
import { useVehicleStore } from '@/stores/vehicle'
import { useVehicleTypeStore } from '@/stores/vehicleTypes'
import { useItineraryStore } from '@/stores/itinerary'
import { useSiteStore } from '@/stores/site'
import { useDepartureStore } from '@/stores/departure'

const vxtable = ref(null)
const loading = ref(false)
const transportRate = ref({})

const transportRateStore = useTransportRateStore()
const vehicleStore = useVehicleStore()
const vehicleTypeStore = useVehicleTypeStore()
const itineraryStore = useItineraryStore()
const siteStore = useSiteStore()
const departureStore = useDepartureStore()

onMounted(() => {
  vehicleStore.fetchAllVehicles({ list: true })
  vehicleTypeStore.fetchVehicleTypes({ list: true })
  itineraryStore.fetchItineraries({ list: true })
  siteStore.fetchAllSites({ list: true })
  departureStore.fetchAllDepartures({ list: true })
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      transportRateStore.fetch(query).then(({ data, total }) => {
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
  { type: 'checkbox', width: 45, align: 'center' },
  {
    title: t('itinerary'),
    field: 'itinerary',
    formatter: ({ cellValue }) => `${cellValue.departure.label} ${t('to')} ${cellValue.site.name}`,
  },
  {
    title: t('distance'),
    field: 'itinerary.distance',
    ...InputFilter({ type: 'number' }),
  },
  {
    title: t('vehicle-type'),
    field: 'vehicle_type.name',
    ...SelectFilter({
      filters: vehicleTypeStore.vehicleTypes.map(({ name }) => ({ label: name, value: name })) ?? [],
    }),
  },
  {
    title: t('nbr-place-min'),
    field: 'vehicle_type.nbr_place_min',
  },
  {
    title: t('nbr-place-max'),
    field: 'vehicle_type.nbr_place_max',
  },
  {
    title: t('place-rate'),
    field: 'place_rate',
    ...InputFilter({ type: 'number' }),
  },
  {
    title: t('trip-rate'),
    field: 'trip_rate',
    ...InputFilter({ type: 'number' }),
  },
  {
    title: t('added-at'),
    field: 'added_at',
    formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
  },
  { title: t('actions'), field: 'actions', width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  transportRate.value = {}
  openDialog()
}

const editHandler = (value) => {
  transportRate.value = value
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  transportRateStore.remove(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_transport_rate')
}
</script>
