<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="final-product-edit"
      delete-permission="final-product-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'final-product-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-product') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :product="product" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuery, useDialog, InputFilter, SelectFilter } from '@/helpers'
import { t, dayjs } from '@/plugins'
import CreateEdit from './components/CreateEdit'
import { useProductStore } from '@/stores/product'
import { useVarietyStore } from '@/stores/variety'
import { useBrandStore } from '@/stores/brand'
import { useProductCategoryStore } from '@/stores/productCategory'
import { useProductCaliberStore } from '@/stores/productCaliber'
import { usePalletTypeStore } from '@/stores/palletType'
import { usePackagingTypesStore } from '@/stores/packagingTypes'

const loading = ref(false)
const product = ref({})
const vxtable = ref(null)

const productStore = useProductStore()
const varietyStore = useVarietyStore()
const brandStore = useBrandStore()
const productCategoryStore = useProductCategoryStore()
const productCaliberStore = useProductCaliberStore()
const palletTypesStore = usePalletTypeStore()
const packagingTypesStore = usePackagingTypesStore()

onMounted(() => {
  varietyStore.fetchAllVarieties()
  brandStore.fetchBrands({ list: true })
  productCategoryStore.fetchProductCategories({ list: true })
  productCaliberStore.fetchProductCalibers({ list: true })
  palletTypesStore.fetchPalletTypes({ list: true })
  packagingTypesStore.fetch({ list: true })
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      productStore.fetch(query).then(({ data, total }) => {
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
  { title: t('code'), field: 'code', ...InputFilter({ type: 'number' }) },
  { title: t('name'), field: 'name', ...InputFilter() },
  {
    title: t('destination'),
    field: 'destination',
    formatter: ({ cellValue }) => t(productStore.destinations.find(({ value }) => value == cellValue)?.label),
    ...SelectFilter({
      filters: productStore.destinations.map(({ label, value }) => ({ label: t(label), value })),
    }),
  },
  {
    title: t('variety'),
    field: 'variety.name',
    ...SelectFilter({
      filters: varietyStore.getVarieties,
    }),
  },
  { title: t('unity-measure'), field: 'unity_measure', formatter: ({ cellValue }) => t(cellValue) },
  { title: t('nbr-unit'), field: 'nbr_unities' },
  {
    title: t('sales-unit'),
    field: 'sales_unit',
    formatter: ({ cellValue }) => t(productStore.salesUnit.find(({ value }) => value == cellValue)?.label),
  },
  { title: t('commercial-restraint'), field: 'commercial_weight' },
  { title: t('net-weight'), field: 'net_weight' },
  {
    title: t('brand'),
    field: 'brand.label',
    ...SelectFilter({ filters: brandStore.getBrands }),
  },
  {
    title: t('category'),
    field: 'product_category.label',
    ...SelectFilter({
      filters: productCategoryStore.getProductCategories,
    }),
  },
  {
    title: t('product-caliber'),
    field: 'product_caliber.label',
    ...SelectFilter({ filters: productCaliberStore.getProductCalibers }),
  },
  { title: t('pallet-type'), field: 'pallet_type.label' },
  { title: t('packaging-type'), field: 'packhouse_unity.label' },
  { title: t('packaging-price'), field: 'packaging_price' },
  { title: t('nbr-box-pallet'), field: 'nbr_box_per_pallet' },
  {
    title: t('created-at'),
    field: 'created_at',
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), field: 'actions', width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  product.value = {}
  openDialog()
}

const editHandler = (value) => {
  product.value = value
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  productStore.remove(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_product')
}
</script>
