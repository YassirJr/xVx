<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="unity-edit"
      delete-permission="unity-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'unity-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-unity') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :unity="unity" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useQuery, useDialog, SelectFilter } from '@/helpers'
import { computed, ref } from 'vue'
import { t, dayjs } from '@/plugins'
import { useUnityStore } from '@/stores/unity'
import CreateEdit from './components/CreateEdit.vue'

const unityStore = useUnityStore()
const loading = ref(false)
const vxtable = ref(null)
const unity = ref(null)

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      unityStore.fetchUnities(query).then(({ data, total }) => {
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
  { field: 'code', title: t('code') },
  { field: 'label', title: t('label') },
  {
    field: 'variety.name',
    title: t('varieties'),
  },
  {
    field: 'by_kilogram',
    title: t('unit'),
    formatter: ({ cellValue }) => (cellValue ? t('kg') : t('pieces')),
  },
  { field: 'weight', title: t('value') },
  { field: 'price', title: t('price') },
  {
    field: 'created_at',
    title: t('created-at'),
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
    sortable: true,
  },
  {
    field: 'status',
    title: t('status'),
    className: ({ row }) => (row.status ? 'text-green-500' : 'text-red-500'),
    formatter: ({ cellValue }) => (cellValue ? t('active') : t('inactive')),
    ...SelectFilter({
      filters: unityStore.status.map(({ label, value }) => ({ label: t(label), value: value })),
    }),
  },

  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  unity.value = {}
  openDialog()
}

const editHandler = (value) => {
  unity.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  unityStore.removeUnity(id).finally(() => {
    loading.value = false
    vxtable.value.refresh()
  })
}

const openDialog = () => {
  useDialog.open('create_edit_unity')
}
</script>
