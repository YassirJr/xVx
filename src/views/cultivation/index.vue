<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="cultivation-edit"
      delete-permission="cultivation-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'cultivation-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-cultivation') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :cultivation="cultivation" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { InputFilter, useDialog, useQuery, SelectFilter } from '@/helpers'
import { computed, onMounted, ref } from 'vue'
import CreateEdit from './components/CreateEdit'
import { useCultivationStore } from '@/stores/cultivation'
import { useSiteStore } from '@/stores/site'
import { useVarietyStore } from '@/stores/variety'
import { useParcelStore } from '@/stores/parcel'
import { useVarietyFieldStore } from '@/stores/varietyField'
import { dayjs, t } from '@/plugins'
import { DATE_FORMAT } from '@/constants'

const loading = ref(false)
const cultivation = ref({})
const vxtable = ref(null)

const cultivationStore = useCultivationStore()

const siteStore = useSiteStore()
const parcelStore = useParcelStore()
const varietyStore = useVarietyStore()
const varietyFieldStore = useVarietyFieldStore()

onMounted(() => {
  siteStore.fetchAllSites()
  varietyStore.fetchAllVarieties()
  parcelStore.fetchAllParcels()
  varietyFieldStore.fetch({ list: true })
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      cultivationStore.fetchCultivations(query).then(({ data, total }) => {
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
  { field: 'code', title: t('drilling-code'), ...InputFilter({ type: 'number' }) },
  { field: 'season', title: t('season'), ...InputFilter({ type: 'number' }) },
  {
    field: 'parcel.site.name',
    title: t('site'),
    filters: siteStore.getSites,
  },
  { field: 'parcel.name', title: t('parcel'), ...InputFilter() },
  { field: 'arrached_surface', title: t('arrached-surface') },
  { field: 'available_surface', title: t('available-surface') },
  { field: 'total_surface', title: t('total-surface') },
  {
    field: 'cycle',
    title: t('cycle'),
    formatter: ({ cellValue }) =>
      cellValue
        ? t((cellValue = cultivationStore.cycles.find(({ value }) => value == cellValue)?.label))
        : null,
  },
  {
    field: 'variety.name',
    title: t('variety'),
    ...SelectFilter({
      filters: varietyStore.getVarieties,
    }),
  },
  { field: 'variety_field.label', title: t('variety-field') },
  {
    field: 'sowing_date',
    title: t('sowing-date'),
    formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
  },
  {
    field: 'uprooting_date',
    title: t('uprooting-date'),
    formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
  },
  {
    field: 'status',
    title: t('status'),
    formatter: ({ cellValue }) => t(cellValue),
    className: ({ row }) => cultivationStore.statusList.find(({ label }) => label == row.status).class,
    ...SelectFilter({
      filters: cultivationStore.statusList.map((el) => ({ label: t(el.label), value: el.label })),
    }),
  },
  { title: t('actions'), slots: { default: 'actions' } },
])

const addHandler = () => {
  cultivation.value = null
  openDialog()
}

const editHandler = (value) => {
  cultivation.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  cultivationStore.removeCultivation(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_cultivation')
}
</script>
