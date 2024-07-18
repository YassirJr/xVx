<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="farm-track-load-edit"
      delete-permission="farm-track-load-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'farm-track-load-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :farm-track-load="farmTrackLoad" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { useQuery, useDialog, InputFilter } from '@/helpers'
import { ref, computed, onMounted } from 'vue'
import { t, dayjs } from '@/plugins'
import { useFarmTrackLoadStore } from '@/stores/farmTrackLoad'
import { useSiteStore } from '@/stores/site'
import { useEmployeeStore } from '@/stores/employee'
import { useVehicleStore } from '@/stores/vehicle'
import { useParcelStore } from '@/stores/parcel'
import { useUnityStore } from '@/stores/unity'
import { useVarietyStore } from '@/stores/variety'
import { DATE_FORMAT, TIME_FORMAT } from '@/constants'

const loading = ref(false)
const vxtable = ref(null)
const farmTrackLoad = ref({})

const farmTrackLoadStore = useFarmTrackLoadStore()

const employeeStore = useEmployeeStore()
const varietyStore = useVarietyStore()
const vehicleStore = useVehicleStore()
const parcelStore = useParcelStore()
const unityStore = useUnityStore()
const siteStore = useSiteStore()

onMounted(() => {
  employeeStore.fetchAllEmployees({ leaders_only: true, get: ['id,firstname,lastname,uid'] })
  varietyStore.fetchAllVarieties({ list: true })
  vehicleStore.fetchAllVehicles({ list: true })
  parcelStore.fetchAllParcels({ list: true })
  unityStore.fetchUnities({ list: true })
  siteStore.fetchAllSites({ list: true })
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      farmTrackLoadStore.fetchFarmTrackLoads(query).then(({ total, data }) => {
        resolve({
          page: { total: total },
          result: data?.map((el) => ({
            ...el,
            'leader.uid': el.leader?.uid ? el.leader.uid : null,
            leader_fullname: el.leader ? `${el.leader.firstname} ${el.leader.lastname}` : null,
          })),
        })
      })
    })
  },
}))

const columns = computed(() => [
  { field: 'track_loader_id', title: t('code') },
  { field: 'site.name', title: t('site') },
  { field: 'variety.name', title: t('variety') },
  { field: 'unity.label', title: t('unity') },
  { field: 'vehicle.registration_nbr', title: t('vehicle') },
  { field: 'parcel.name', title: t('parcel') },
  { field: 'leader.uid', title: t('leader-code') },
  { field: 'leader_fullname', title: t('leader') },
  { field: 'nbr_unities', title: t('number') },
  {
    field: 'added_at',
    title: t('created-at'),
    formatter: ({ cellValue }) => dayjs(cellValue).format(`${DATE_FORMAT} ${TIME_FORMAT}`),
    ...InputFilter({ type: 'date' }),
  },
  { title: t('actions'), field: 'actions', width: 150, slots: { default: 'actions' } },
])

const addHandler = () => {
  farmTrackLoad.value = {}
  openDialog()
}

const editHandler = (value) => {
  farmTrackLoad.value = value
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true

  farmTrackLoadStore.removeFarmTrackLoad(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_farm_track_load')
}
</script>
