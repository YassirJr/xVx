<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="subfamily-item-edit"
      delete-permission="subfamily-item-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'subfamily-item-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-subfamily-item') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :subfamily-item="subfamilyItem" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { ref, computed, onMounted } from 'vue'
import { useSubFamilyItemStore } from '@/stores/subfamilyItem'
import { useFamilyItemStore } from '@/stores/familyItem'
import { useDialog, useQuery } from '@/helpers'
import { t, dayjs } from '@/plugins'

const loading = ref(false)
const subfamilyItem = ref(null)
const vxtable = ref(null)

const subFamilyItemStore = useSubFamilyItemStore()

const familyItemStore = useFamilyItemStore()
onMounted(() => familyItemStore.fetchFamilyItems({ list: true }))

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)
    return new Promise((resolve) => {
      subFamilyItemStore.fetchSubfamilyItems(query).then(({ data }) => {
        resolve({
          page: { total: data.length },
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
    field: 'family_item.label',
    title: t('family'),
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
  subfamilyItem.value = {}
  openDialog()
}

const editHandler = (value) => {
  subfamilyItem.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  subFamilyItemStore.removeSubfamilyItem(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

function openDialog() {
  useDialog.open('create_edit_subfamily_item')
}
</script>
