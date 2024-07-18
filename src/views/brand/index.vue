<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="brand-edit"
      delete-permission="brand-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'brand-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-brand') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :brand="brand" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog } from '@/helpers'
import { ref, computed } from 'vue'
import { dayjs, t } from '@/plugins'
import { useBrandStore } from '@/stores/brand'
import CreateEdit from './components/CreateEdit'

const brandStore = useBrandStore()
const loading = ref(false)
const brand = ref(null)

const vxtable = ref(null)
const columns = computed(() => [
  { field: 'code', title: t('code') },
  { field: 'label', title: t('label') },
  {
    field: 'is_for_sell',
    title: t('brand-for'),
    formatter: ({ cellValue }) => (cellValue ? t('sell-products') : t('purchased-products')),
  },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const ajax = computed(() => ({
  query: ({ page, sorts }) => {
    const query = {
      page: page.currentPage,
      per_page: page.pageSize,
      filter: {},
    }

    query.sort = sorts.length ? 'created_at' : '-created_at'

    return new Promise((resolve) => {
      brandStore.fetchBrands(query).then(({ data, total }) => {
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

const addHandler = () => {
  brand.value = {}
  openDialog()
}

const editHandler = (value) => {
  brand.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = (brand) => {
  loading.value = true
  brandStore.removeBrand(brand.id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_brand')
}
</script>
