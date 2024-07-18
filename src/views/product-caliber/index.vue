<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="product-caliber-edit"
      delete-permission="product-caliber-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'product-caliber-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-product-caliber') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :product-caliber="productCaliber" @reload="vxtable.refresh()"></create-edit>
</template>
<script setup>
import CreateEdit from './components/CreateEdit'
import { ref, computed } from 'vue'
import { useQuery, useDialog } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { useProductCaliberStore } from '@/stores/productCaliber'

const loading = ref(false)
const productCaliber = ref({})
const vxtable = ref(null)

const productCaliberStore = useProductCaliberStore()

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      productCaliberStore.fetchProductCalibers(query).then(({ data, total }) => {
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
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  productCaliber.value = {}
  openDialog()
}

const editHandler = (value) => {
  productCaliber.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true

  productCaliberStore.removeProductCaliber(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_product_caliber')
}
</script>
