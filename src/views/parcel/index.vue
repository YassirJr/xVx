<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="parcel-edit"
      delete-permission="parcel-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'parcel-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-parcel') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :parcel="parcel" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useParcelStore } from '@/stores/parcel'
import { useSiteStore } from '@/stores/site'
import { useDialog, useQuery, InputFilter, SelectFilter } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { ref, computed, onMounted } from 'vue'
import CreateEdit from './components/CreateEdit'

const parcelStore = useParcelStore()
const siteStore = useSiteStore()

const loading = ref(false)
const parcel = ref(null)
const vxtable = ref(null)

const columns = computed(() => [
  {
    field: 'code',
    title: t('code'),
    ...InputFilter({ type: 'number', clearable: true }),
  },
  {
    field: 'name',
    title: t('name'),
    ...InputFilter({ clearable: true }),
  },
  { field: 'surface', title: t('surface') },
  { field: 'available_surface', title: t('available-surface') },
  {
    field: 'site.name',
    title: t('site'),
    ...SelectFilter({
      filters: siteStore.getSites,
    }),
  },
  {
    field: 'status',
    title: t('status'),
    className: ({ row }) => (row?.status ? 'text-green-500' : 'text-red-500'),
    formatter: ({ cellValue }) => (cellValue ? t('available') : t('not-available')),
    ...SelectFilter({
      filters: [
        { label: t('available'), value: true },
        { label: t('not-available'), value: false },
      ],
    }),
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
      parcelStore.fetchParcels(query).then(({ data, total }) => {
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
  siteStore.fetchSites()
})

const addHandler = () => {
  parcel.value = {}
  openDialog()
}

const editHandler = (value) => {
  parcel.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true

  parcelStore.removeParcel(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_parcel')
}
</script>
