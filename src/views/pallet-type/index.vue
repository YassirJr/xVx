<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="table"
      :columns="columns"
      :ajax="ajax"
      edit-permission="pallet-type-edit"
      delete-permission="pallet-type-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'pallet-type-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :pallet-type="palletType" @reload="table.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { ref, computed } from 'vue'
import { dayjs, t } from '@/plugins'
import { usePalletTypeStore } from '@/stores/palletType'
import CreateEdit from './components/CreateEdit'

const palletTypeStore = usePalletTypeStore()

const loading = ref(false)
const palletType = ref({})
const table = ref(null)

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)
    return new Promise((resolve) => {
      palletTypeStore.fetchPalletTypes(query).then(({ data, total }) => {
        resolve({
          page: { total: total },
          result: data,
        })
      })
    })
  },
}))

const columns = [
  { title: t('code'), field: 'code' },
  { title: t('label'), field: 'label' },
  { title: t('tare-weight'), field: 'tare_weight' },
  {
    title: t('created-at'),
    field: 'created_at',
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), field: 'actions', width: 200, slots: { default: 'actions' } },
]

const addHandler = () => {
  palletType.value = {}
  openDialog()
}

const editHandler = (value) => {
  palletType.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  palletTypeStore.removePalletType(id).finally(() => {
    loading.value = false
    table.value.refresh()
  })
}

const openDialog = () => {
  useDialog.open('create_edit_pallet_type')
}
</script>
