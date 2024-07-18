<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="variety-field-edit"
      delete-permission="variety-field-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'variety-field-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :variety-field="varietyField" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './component/CreateEdit'
import { useDialog, useQuery } from '@/helpers/index'
import { ref, computed, onMounted } from 'vue'
import { useVarietyFieldStore } from '@/stores/varietyField'
import { useVarietyStore } from '@/stores/variety'
import { t, dayjs } from '@/plugins'

const loading = ref(false)
const varietyField = ref({})
const vxtable = ref(null)

const varietyFieldStore = useVarietyFieldStore()
const varietyStore = useVarietyStore()
onMounted(() => varietyStore.fetchAllVarieties({ list: true }))

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      varietyFieldStore.fetch(query).then(({ data, total }) => {
        resolve({
          page: { total: total },
          result: data,
        })
      })
    })
  },
}))

const columns = computed(() => [
  { field: 'code', title: t('code') },
  { field: 'label', title: t('label') },
  { field: 'variety.name', title: t('variety') },
  {
    field: 'status',
    title: t('status'),
    formatter: ({ cellValue }) => t(cellValue ? 'active' : 'inactive'),
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
  varietyField.value = {}
  openDialog()
}

const editHandler = (value) => {
  varietyField.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  varietyFieldStore.remove(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_variety_field')
}
</script>
