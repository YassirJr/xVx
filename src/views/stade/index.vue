<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="stade-edit"
      delete-permission="stade-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'stade-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-stade') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :stade="stade" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { computed, ref } from 'vue'
import CreateEdit from './components/CreateEdit'
import { useStadeStore } from '@/stores/stade'
import { dayjs, t } from '@/plugins'

const loading = ref(false)
const stade = ref({})
const vxtable = ref(null)
const stadeStore = useStadeStore()

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      stadeStore.fetchStades(query).then(({ data, total }) => {
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
  { field: 'name', title: t('name') },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  stade.value = {}
  openDialog()
}

const editHandler = (value) => {
  stade.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  stadeStore.removeStade(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_stade')
}
</script>
