<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="table"
      :columns="columns"
      :ajax="ajax"
      :expand-config="tableExpand"
      edit-permission="sales-order-edit"
      delete-permission="sales-order-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #children="{ children }">
        <vx-table
          :columns="childColumns"
          :ajax="children"
          :show-children-table="activeView"
          :max-height="350"
          stripe
        ></vx-table>
      </template>
      <template #toolbar>
        <view-toolbar @view-changed="viewChanged"></view-toolbar>
        <el-button
          v-if="activeView"
          v-can="'sales-order-create'"
          plain
          type="primary"
          class="ml-2"
          @click="addHandler()"
        >
          <i-el-plus class="mr-2" />
          {{ $t('add-sales-order') }}
        </el-button>
      </template>
      <template #more_actions="row">
        <el-button v-if="row.expedition" plain type="success" @click="openPrintDownloadDocsDialog([row])">
          <i-tabler-ticket />
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :sales-order="salesOrder" @reload="table.refresh()"></create-edit>
  <print-download-docs :data="saleOrderPrint" :labels="salesOrderStore.getLabels"></print-download-docs>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { ref, computed, onMounted, reactive } from 'vue'
import PrintDownloadDocs from '@/components/PrintDownloadDocs'
import { t, dayjs } from '@/plugins'
import { DATE_FORMAT, DATE_TIME_FORMAT } from '@/constants'
import { useQuery, useDialog, InputFilter, SelectFilter } from '@/helpers'
import { useSalesOrderStore } from '@/stores/salesOrder'
import { useClientStore } from '@/stores/client'
import { useExpeditionStore } from '@/stores/expedition'
import { useSiteStore } from '@/stores/site'
import { useProductStore } from '@/stores/product'
import { useConfectionStore } from '@/stores/confection'
import { useCompanyStore } from '@/stores/company'
import { usePriceListStore } from '@/stores/priceList'

const loading = ref(false)
const table = ref(null)
const salesOrder = ref(null)
const saleOrderPrint = ref([])
const activeView = ref(null)

const salesOrderStore = useSalesOrderStore()
const clientStore = useClientStore()
const expeditionStore = useExpeditionStore()
const siteStore = useSiteStore()
const productStore = useProductStore()
const confectionStore = useConfectionStore()
const companyStore = useCompanyStore()
const priceListStore = usePriceListStore()

onMounted(() => {
  clientStore.fetchClients({ list: true })
  expeditionStore.fetch({ list: true })
  siteStore.fetchAllSites({ list: true })
  productStore.fetch({ list: true })
  confectionStore.fetch({ list: true })
  companyStore.fetchCompanies({ list: true })
  priceListStore.fetch({ list: true })
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery({ ...params, grouped: activeView.value })

    return new Promise((resolve) => {
      salesOrderStore.fetch(query).then(({ data, meta }) => {
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

const tableExpand = reactive({
  lazy: true,
  loadMethod({ row }) {
    return new Promise((resolve) => {
      row.children = Object.assign([], row.final_products)
      resolve()
    })
  },
})

const columns = computed(() => {
  return !activeView.value
    ? [
        { type: 'seq', title: t('order'), width: 65 },
        {
          field: 'sales_order.added_at',
          title: t('date'),
          formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
        },
        {
          field: 'sales_order.invoice_nbr',
          title: t('invoice-nbr'),
        },
        {
          field: 'sales_order.client.is_international',
          title: t('nature'),
          formatter: ({ cellValue }) => t(cellValue ? 'export' : 'local-market'),
        },
        {
          field: 'sales_order.site.name',
          title: t('station'),
        },
        {
          field: 'sales_order.expedition.code',
          title: t('expedition/BL'),
          formatter: ({ row }) =>
            row.sales_order?.delivery_nbr ? row.sales_order?.delivery_nbr : row.sales_order?.expedition.code,
        },
        {
          field: 'sales_order.client.name',
          title: t('client'),
        },
        {
          field: 'sales_order.incoterm',
          title: t('incoterm'),
          formatter: ({ cellValue }) => {
            const incoterm = salesOrderStore.incoterms.find(({ value }) => value == cellValue)?.label

            return incoterm ? t(incoterm) : null
          },
        },
        {
          field: 'final_product.name',
          title: t('product'),
        },
        {
          field: 'confection',
          title: t('pallet-code'),
          formatter: ({ cellValue }) =>
            cellValue ? `${cellValue.pallet_code}-${cellValue.pallet_code_suffix}` : null,
        },
        { field: 'pallet_nbr', title: t('pallet-nbr') },
        {
          field: 'final_product.sales_unit',
          title: t('sales-unit'),
          formatter: ({ cellValue }) => {
            const salesUnit = productStore.salesUnit.find(({ value }) => value == cellValue)?.label

            return salesUnit ? t(salesUnit) : null
          },
        },
        {
          field: 'quantity',
          title: t('quantity'),
        },
        {
          field: 'final_product.nbr_unities',
          title: t('number-of-unities'),
        },
        {
          field: 'sales_order.client.currency',
          title: t('currency'),
          formatter: ({ cellValue }) => (cellValue ? t(cellValue) : null),
        },
        {
          field: 'unit_price',
          title: t('unit-price'),
        },
        {
          field: 'discount',
          title: t('discount'),
        },
        {
          field: 'advance',
          title: t('advance'),
        },
        {
          field: 'transport_cost',
          title: t('transport'),
        },
        {
          field: 'total',
          title: t('amount'),
        },
        {
          field: 'sales_order.created_at',
          title: t('created-at'),
          width: 165,
          formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_TIME_FORMAT),
        },
      ]
    : [
        { width: 40, type: 'expand', slots: { content: 'children' } },
        {
          field: 'added_at',
          title: t('date'),
          formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
          ...InputFilter({ type: 'date' }),
        },
        {
          field: 'expedition.code ',
          title: t('expedition/BL'),
          formatter: ({ row }) => (row.expedition_id ? row.expedition.code : row.delivery_nbr),
        },
        {
          field: 'invoice_nbr',
          title: t('invoice-nbr'),
          ...InputFilter(),
        },
        {
          field: 'client.name',
          title: t('client'),
          ...InputFilter(),
        },
        {
          field: 'site.name',
          title: t('station'),
          ...SelectFilter({
            filters: siteStore.getStationSites.map(({ name }) => ({ label: name, value: name })) ?? [],
          }),
        },
        {
          field: 'client.currency',
          title: t('currency'),
          formatter: ({ cellValue }) => (cellValue ? t(cellValue) : null),
        },
        {
          field: 'incoterm',
          title: t('incoterm'),
          formatter: ({ cellValue }) => {
            const incoterm = salesOrderStore.incoterms.find(({ value }) => value == cellValue)?.label

            return incoterm ? t(incoterm) : null
          },
        },
        {
          field: 'created_at',
          title: t('created-at'),
          width: 165,
          sortable: true,
          formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_TIME_FORMAT),
        },
        { title: t('actions'), width: 200, slots: { default: 'actions' } },
      ]
})

const childColumns = computed(() => [
  {
    field: 'name',
    title: t('product'),
  },
  {
    field: 'confection',
    title: t('pallet-code'),
    formatter: ({ cellValue }) =>
      cellValue ? `${cellValue.pallet_code}-${cellValue.pallet_code_suffix}` : null,
  },
  {
    field: 'pallet_nbr',
    title: t('pallet-nbr'),
  },
  {
    field: 'sales_unit',
    title: t('sales-unit'),
    formatter: ({ cellValue }) => {
      const salesUnit = productStore.salesUnit.find(({ value }) => value == cellValue)?.label

      return salesUnit ? t(salesUnit) : null
    },
  },
  {
    field: 'quantity',
    title: t('quantity'),
  },
  {
    field: 'nbr_unities',
    title: t('number-of-unities'),
  },
  {
    field: 'gross_weight',
    title: t('gross-weights'),
  },
  {
    field: 'net_weight',
    title: t('net-weights'),
  },
  {
    field: 'unit_price',
    title: t('unit-price'),
  },
  {
    field: 'discount',
    title: t('discount'),
  },
  {
    field: 'advance',
    title: t('advance'),
  },
  {
    field: 'transport_cost',
    title: t('transport'),
  },
  {
    field: 'total',
    title: t('amount'),
  },
  { field: '#', title: '#', width: 200 },
])

const addHandler = () => {
  salesOrder.value = Object.assign({}, {})
  openDialog()
}

const editHandler = (value) => {
  salesOrder.value = Object.assign({}, value)

  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  salesOrderStore.remove(id).finally(() => {
    table.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_sales_order')
}

const viewChanged = ({ value, isMounted }) => {
  activeView.value = value

  if (!isMounted) {
    table.value.refresh()
  }
}

const openPrintDownloadDocsDialog = (rows) => {
  saleOrderPrint.value = rows
  useDialog.open('print_download_docs')
}
</script>
