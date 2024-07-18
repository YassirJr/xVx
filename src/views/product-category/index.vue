<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="product-category-edit"
      delete-permission="product-category-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'product-category-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :product-category="productCategory" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { ref, computed } from 'vue'
import { useQuery, useDialog } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { useProductCategoryStore } from '@/stores/productCategory'

const loading = ref(false)
const productCategory = ref({})
const vxtable = ref(null)

const productCategoryStore = useProductCategoryStore()

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)
    return new Promise((resolve) => {
      productCategoryStore.fetchProductCategories(query).then(({ data, total }) => {
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
  productCategory.value = {}
  openDialog()
}

const editHandler = (value) => {
  productCategory.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  productCategoryStore.removeProductCategory(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_product_category')
}
</script>
