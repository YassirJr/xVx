<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="warehouse-edit"
      delete-permission="warehouse-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'warehouse-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-warehouse') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :warehouse="warehouse" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { useWarehouseStore } from '@/stores/warehouse'
import { ref, computed } from 'vue'
import CreateEdit from './components/CreateEdit'

const warehouseStore = useWarehouseStore()
const loading = ref(false)
const warehouse = ref(null)
const vxtable = ref(null)

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      warehouseStore.fetchWarehouses(query).then(({ data, total }) => {
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
    field: 'is_active',
    title: t('status'),
    formatter: ({ cellValue }) => (cellValue ? t('active') : t('inactive')),
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
  warehouse.value = {}
  openDialog()
}

const editHandler = (row) => {
  warehouse.value = Object.assign({}, row)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  warehouseStore.removeWarehouse(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_warehouse')
}
</script>
