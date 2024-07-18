<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="item-edit"
      delete-permission="item-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'item-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-item') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :item="item" @reload="vxtable.refresh()" />
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { useQuery, useDialog } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { ref, computed, onMounted } from 'vue'
import { useItemStore } from '@/stores/item'
import { useSubFamilyItemStore } from '@/stores/subfamilyItem'
import { useFamilyItemStore } from '@/stores/familyItem'
import { useBrandStore } from '@/stores/brand'

const loading = ref(false)
const item = ref({})
const vxtable = ref(null)

const itemStore = useItemStore()
const subfamilyItemStore = useSubFamilyItemStore()
const familyItemStore = useFamilyItemStore()
const brandStore = useBrandStore()

onMounted(() => {
  brandStore.fetchBrands({ list: true })
  familyItemStore.fetchFamilyItems({ list: true })
  subfamilyItemStore.fetchSubfamilyItems({ list: true })
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)
    return new Promise((resolve) => {
      itemStore
        .fetchItems(query)
        .then(({ data, total }) => {
          resolve({ page: { total: total }, result: data })
        })
        .catch(() => {
          resolve({ result: [] })
        })
    })
  },
}))

const columns = computed(() => [
  { field: 'code', title: t('code') },
  { field: 'label', title: t('label') },
  {
    field: 'storable',
    title: t('storable'),
    formatter: ({ cellValue }) => (cellValue ? t('yes') : t('no')),
  },
  { field: 'subfamily_item.family_item.label', title: t('family') },
  { field: 'subfamily_item.label', title: t('sub-family') },
  { field: 'brand.label', title: t('brand') },
  { field: 'unit', title: t('unit') },
  { field: 'min_stock', title: t('stock-min') },
  { field: 'stock_evaluation_mode', title: t('stock-evaluation-mode') },
  { field: 'unit_cost', title: t('cost-u') },
  {
    field: 'vat_rate',
    title: t('vat-rates'),
    formatter: ({ cellValue }) => {
      const vatRate = itemStore.vatRates.find((rate) => rate.value === cellValue)
      return vatRate ? vatRate.label : null
    },
  },
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
  item.value = {}
  openDialog()
}

const editHandler = (value) => {
  item.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  itemStore.removeItem(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_item')
}
</script>
