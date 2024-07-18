<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="itinerary-edit"
      delete-permission="itinerary-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'itinerary-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-new-itinerary') }}
        </el-button>
      </template>
    </vx-table>
  </div>

  <create-edit :itinerary="itinerary" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { ref, computed, onMounted } from 'vue'
import { t, dayjs } from '@/plugins'
import { useQuery, useDialog, InputFilter, SelectFilter } from '@/helpers'
import { useItineraryStore } from '@/stores/itinerary'
import { useSiteStore } from '@/stores/site'
import { useDepartureStore } from '@/stores/departure'

const loading = ref(false)
const itinerary = ref({})
const vxtable = ref(null)

const itineraryStore = useItineraryStore()
const departureStore = useDepartureStore()
const siteStore = useSiteStore()

onMounted(() => {
  siteStore.fetchAllSites({ list: true })
  departureStore.fetchAllDepartures({ list: true })
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)
    return new Promise((resolve) => {
      itineraryStore.fetchItineraries(query).then(({ data, total }) => {
        resolve({
          page: {
            total,
          },
          result: data,
        })
      })
    })
  },
}))

const columns = computed(() => [
  {
    title: t('departure'),
    field: 'departure.label',
    ...SelectFilter({
      filters: departureStore.departures.map(({ label }) => ({ label: label, value: label })) ?? [],
    }),
  },
  {
    title: t('arrival'),
    field: 'site.name',
    ...SelectFilter({
      filters: siteStore.getSites,
    }),
  },
  { title: t('distance'), field: 'distance', ...InputFilter({ type: 'number' }) },
  {
    title: t('created-at'),
    field: 'created_at',
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), field: 'actions', width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  itinerary.value = {}
  openDialog()
}

const editHandler = (value) => {
  itinerary.value = value
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  itineraryStore.removeItinerary(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_itinerary')
}
</script>
