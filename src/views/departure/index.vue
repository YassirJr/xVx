<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="departure-edit"
      delete-permission="departure-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'departure-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-departure') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :departure="departure" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery, InputFilter, SelectFilter } from '@/helpers'
import { computed, ref, onMounted } from 'vue'
import CreateEdit from './components/CreateEdit'
import { useDepartureStore } from '@/stores/departure'
import { dayjs, t } from '@/plugins'

const loading = ref(false)
const departure = ref({})
const vxtable = ref(null)
const departureStore = useDepartureStore()

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      departureStore.fetchDepartures(query).then(({ data, total }) => {
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
  departureStore.fetchAllDepartures({ list: true })
})

const columns = computed(() => [
  { field: 'code', title: t('code'), ...InputFilter({ type: 'number' }) },
  {
    field: 'label',
    title: t('label'),
    ...SelectFilter({
      filters: departureStore.departures.map(({ label }) => ({ label: label, value: label })) ?? [],
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

const addHandler = () => {
  departure.value = null
  openDialog()
}

const editHandler = (value) => {
  departure.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  departureStore.removeDeparture(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_departure')
}
</script>
