<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      :expand-config="tableExpand"
      edit-permission="price-list-edit"
      delete-permission="price-list-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #children="{ childrenAjax }">
        <vx-table :columns="childColumns" :ajax="childrenAjax" :show-children-table="true"></vx-table>
      </template>
      <template #toolbar>
        <el-button v-can="'price-list-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-price-list') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :price-list="priceList" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { ref, reactive, computed, onMounted } from 'vue'
import { usePriceListStore } from '@/stores/priceList'
import { useClientStore } from '@/stores/client'
import { useItemStore } from '@/stores/item'
import { useSupplierStore } from '@/stores/supplier'
import { useProductStore } from '@/stores/product'
import { dayjs, t } from '@/plugins'
import { useDialog, useQuery, dateLabelFormat, InputFilter, SelectFilter } from '@/helpers'

const loading = ref(false)
const vxtable = ref(null)
const priceList = ref(null)

const tableExpand = reactive({
  lazy: true,
  loadMethod({ row }) {
    return new Promise((resolve) => {
      row.childrenAjax = Object.assign([], row.sell_purchase ? row.items : row.final_products)

      resolve()
    })
  },
})

const priceListStore = usePriceListStore()

const clientStore = useClientStore()
onMounted(() => clientStore.fetchClients({ list: true }))

const itemStore = useItemStore()
onMounted(() => itemStore.fetchItems({ list: true }))

const supplierStore = useSupplierStore()
onMounted(() => supplierStore.fetchSuppliers({ list: true }))

const productStore = useProductStore()
onMounted(() => productStore.fetch({ list: true }))

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      priceListStore.fetch(query).then(({ data, meta }) => {
        resolve({
          page: {
            total: meta.total,
          },
          result: data,
        })
      })
    })
  },
}))

const columns = computed(() => [
  { type: 'expand', slots: { content: 'children' }, width: 40 },
  {
    field: 'sell_purchase',
    title: t('sale-purchase'),
    formatter: ({ cellValue }) => t(cellValue ? 'purchase' : 'sell'),
    ...SelectFilter({
      filters: priceListStore.priceTypes.map((el) => ({ label: t(el.label), value: el.value })),
    }),
  },
  {
    field: 'supplier.code',
    title: t('code'),
    formatter: ({ row }) => (row.sell_purchase ? row.supplier.code : row.client.code),
    ...InputFilter(),
  },
  {
    field: 'supplier.name',
    title: t('name'),
    formatter: ({ row }) => (row.sell_purchase ? row.supplier.name : row.client.name),
  },
  {
    field: 'start_date',
    title: t('start-date'),
    formatter: ({ cellValue }) => dayjs(cellValue).format(dateLabelFormat(true)),
  },
  {
    field: 'end_date',
    title: t('end-date'),
    formatter: ({ cellValue }) => dayjs(cellValue).format(dateLabelFormat(true)),
  },
  { title: t('actions'), width: 140, slots: { default: 'actions' } },
])

const childColumns = computed(() => [
  {
    field: 'code',
    title: t('code'),
    formatter: ({ row }) => row.code,
  },
  {
    field: 'name',
    title: t('label'),
    formatter: ({ row }) => row.name ?? row.label,
  },
  {
    field: 'unit_price',
    title: t('unit-price'),
    formatter: ({ row }) => row.unit_price,
  },
  {
    field: 'discount',
    title: t('discount'),
    formatter: ({ row }) => row.discount,
  },
])

const addHandler = () => {
  priceList.value = {}
  openDialog()
}

const editHandler = (value) => {
  priceList.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  priceListStore.remove(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => useDialog.open('create_edit_price_list')
</script>
