<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="table"
      :columns="columns"
      :ajax="ajax"
      edit-permission="family-item-edit"
      delete-permission="family-item-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'family-item-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :family-item="familyItem" @reload="table.refresh()"></create-edit>
</template>

<script setup>
import { computed, ref } from 'vue'
import { dayjs, t } from '@/plugins'
import CreateEdit from './components/CreateEdit'
import { useFamilyItemStore } from '@/stores/familyItem'
import { useDialog, useQuery } from '@/helpers'

const familyItemStore = useFamilyItemStore()
const loading = ref(false)
const table = ref(null)
const familyItem = ref({})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      familyItemStore.fetchFamilyItems(query).then(({ data, total }) => {
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
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  familyItem.value = {}
  openDialog()
}

const editHandler = (value) => {
  familyItem.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  familyItemStore.removeFamilyItem(id).finally(() => {
    table.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_family_item')
}
</script>
