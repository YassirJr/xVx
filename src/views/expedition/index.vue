<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      :hide-actions="hideActions"
      :expand-config="tableExpand"
      edit-permission="expedition-edit"
      delete-permission="expedition-delete"
      @edit="editHandler"
      @delete="deleteHandler"
      @checkbox-change="checkboxChangeEvent"
    >
      <template #children="{ childrenAjax }">
        <vx-table :columns="childColumns" :ajax="childrenAjax" :show-children-table="true"></vx-table>
      </template>
      <template #toolbar>
        <view-toolbar @view-changed="viewChanged"></view-toolbar>
        <el-button
          v-if="selectedView"
          v-can="'expedition-create'"
          class="ml-3"
          plain
          type="primary"
          @click="addHandler()"
        >
          <i-el-plus class="mr-2" />
          {{ $t('add-expedition') }}
        </el-button>
        <div class="ml-3">
          <el-button
            v-if="selectedRows?.length > 1"
            plain
            type="success"
            @click="openPrintDownloadDocsDialog(selectedRows)"
          >
            <i-tabler-download class="mr-2" />
            {{ $t('download') }}
          </el-button>
        </div>
      </template>
      <template #more_actions="row">
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t(row.is_shipped ? 'shipped' : 'on-hold')"
          placement="left"
        >
          <el-button
            v-can="'expedition-edit'"
            plain
            :type="row.is_shipped ? 'info' : 'primary'"
            @click="toggleStatus(row)"
          >
            <i-el-unlock v-if="!row.is_shipped" />
            <i-el-lock v-else />
          </el-button>
        </el-tooltip>
        <el-button plain type="success" @click="openPrintDownloadDocsDialog([row])">
          <i-tabler-ticket />
        </el-button>
      </template>
    </vx-table>
  </div>

  <create-edit :expedition="expedition" @reload="vxtable.refresh()"></create-edit>
  <print-download-docs :data="expeditions" :labels="expeditionStore.getLabels" />
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useQuery, useDialog, InputFilter, SelectFilter, isGanFruits } from '@/helpers'
import { DATE_FORMAT, GAN_FRUITS_COMPANIES, GAN_FRUITS_COMPANIES_LIST, DATE_TIME_FORMAT } from '@/constants'
import { t, dayjs } from '@/plugins'

import CreateEdit from './components/CreateEdit'
import ViewToolbar from '@/components/ViewToolbar'
import PrintDownloadDocs from '@/components/PrintDownloadDocs'

import { useExpeditionStore } from '@/stores/expedition'
import { useSiteStore } from '@/stores/site'
import { useVehicleStore } from '@/stores/vehicle'
import { useVehicleTypeStore } from '@/stores/vehicleTypes'
import { useTransporterStore } from '@/stores/transporter'
import { useLotInstallmentStore } from '@/stores/lotInstallment'
import { useProductStore } from '@/stores/product'
import { useUnityStore } from '@/stores/unity'
import { useVarietyStore } from '@/stores/variety'
import { useConfectionStore } from '@/stores/confection'
import { useClientStore } from '@/stores/client'
import { useCompanyStore } from '@/stores/company'
import { useBrandStore } from '@/stores/brand'
import { useProductCaliberStore } from '@/stores/productCaliber'
import { useProductCategoryStore } from '@/stores/productCategory'

const expeditionStore = useExpeditionStore()
const siteStore = useSiteStore()
const vehicleStore = useVehicleStore()
const vehicleTypeStore = useVehicleTypeStore()
const transporterStore = useTransporterStore()
const lotInstallmentsStore = useLotInstallmentStore()
const productStore = useProductStore()
const unityStore = useUnityStore()
const varietyStore = useVarietyStore()
const confectionStore = useConfectionStore()
const clientStore = useClientStore()
const companyStore = useCompanyStore()
const brandStore = useBrandStore()
const productCaliberStore = useProductCaliberStore()
const productCategoryStore = useProductCategoryStore()

const loading = ref(false)
const selectedView = ref(null)
const expedition = ref({})
const expeditions = ref([])
const hideActions = ref([])
const selectedRows = ref([])
const vxtable = ref()

const tableExpand = reactive({
  lazy: true,
  loadMethod({ row }) {
    return new Promise((resolve) => {
      row.childrenAjax = Object.assign([], row.confections)
      resolve()
    })
  },
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery({ ...params, grouped: selectedView.value })

    return new Promise((resolve) => {
      expeditionStore.fetch(query).then(({ data, total }) => {
        hideActions.value = data?.filter(({ is_shipped }) => is_shipped == true).map(({ id }) => id)

        resolve({ page: { total: total }, result: data })
      })
    })
  },
}))

const columns = computed(() => {
  const groupColumns = [
    { type: 'checkbox', width: 45, align: 'center' },
    { type: 'expand', slots: { content: 'children' }, width: 40 },
    { title: t('expedition-code'), field: 'code', ...InputFilter() },
    {
      title: t('date'),
      field: 'added_at',
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
      ...InputFilter({ type: 'date' }),
    },
    {
      title: t('company'),
      field: 'confections.company',
      formatter: ({ row }) => {
        const confections = row?.confections ?? []
        const companyId = confections.length ? confections[0].company ?? null : null

        return companyId ? GAN_FRUITS_COMPANIES[companyId]?.label ?? null : null
      },
      visible: isGanFruits,
      ...SelectFilter({
        filters: GAN_FRUITS_COMPANIES_LIST?.map(({ label, id }) => ({ label, value: id })),
      }),
    },
    {
      title: t('packhouse'),
      field: 'confections.site.name',
      formatter: ({ row }) => (row.confections?.length ? row.confections[0].site.name : ''),
      ...SelectFilter({
        filters: siteStore.getStationSites.map(({ name }) => ({ label: name, value: name })) ?? [],
      }),
    },
    {
      title: t('tracking-nbr'),
      field: 'confections[0].tracking_nbr',
    },
    {
      title: t('vehicle'),
      field: 'vehicle.registration_nbr',
      ...InputFilter(),
    },
    { title: t('nbr-pallets'), field: 'nbr_pallets', ...InputFilter({ type: 'number' }) },
    { title: t('total-gross'), field: 'gross_weight' },
    { title: t('total-net'), field: 'net_weight' },
    { title: t('client'), field: 'client.name', ...InputFilter() },
    {
      title: t('status'),
      field: 'is_shipped',
      formatter: ({ cellValue }) => t(expeditionStore.status.find(({ value }) => value == cellValue).label),
      className: ({ row }) => expeditionStore.status.find(({ value }) => value == row.is_shipped).class,
      ...SelectFilter({
        filters: expeditionStore.status.map(({ label, value }) => ({ label: t(label), value: value })),
      }),
    },
    {
      field: 'created_at',
      title: t('created-at'),
      sortable: true,
      width: 165,
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_TIME_FORMAT),
    },
    { title: t('actions'), field: 'actions', width: 250, slots: { default: 'actions' } },
  ]

  const listColumns = [
    { type: 'seq', title: t('order'), width: 65 },
    {
      title: t('date'),
      field: 'expedition.added_at',
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
      ...InputFilter({ type: 'date' }),
    },
    { title: t('expedition-code'), field: 'expedition.code', ...InputFilter() },
    {
      title: t('company'),
      field: 'confection.company',
      formatter: ({ cellValue }) => GAN_FRUITS_COMPANIES[cellValue]?.label ?? null,
      visible: isGanFruits,
      ...SelectFilter({
        filters: GAN_FRUITS_COMPANIES_LIST.map(({ label, id }) => ({ label, value: id })),
      }),
    },
    {
      title: t('packhouse'),
      field: 'confection.site.name',
      ...SelectFilter({
        filters: siteStore.getStationSites.map(({ name }) => ({ label: name, value: name })) ?? [],
      }),
    },
    {
      title: t('tracking-nbr'),
      field: 'confections.tracking_nbr',
    },
    { title: t('vehicle'), field: 'expedition.vehicle.registration_nbr', ...InputFilter() },
    { title: t('client'), field: 'expedition.client.name', ...InputFilter() },
    {
      title: t('status'),
      field: 'is_shipped',
      formatter: ({ cellValue }) => t(expeditionStore.status.find(({ value }) => value == cellValue).label),
      className: ({ row }) => expeditionStore.status.find(({ value }) => value == row.is_shipped).class,
      ...SelectFilter({
        filters: expeditionStore.status.map(({ label, value }) => ({ label: t(label), value: value })),
      }),
    },
    {
      title: t('pallet-code'),
      field: 'confection.pallet_code',
      formatter: ({ cellValue, row }) => `${cellValue}-${row?.confection?.pallet_code_suffix}`,
      ...InputFilter({ type: 'number' }),
    },
    { title: t('day-indexes'), field: 'confection.day_index.code', visible: false },
    {
      title: t('lot-installments'),
      field: 'confection.lot_installment.code',
      ...InputFilter({ type: 'number' }),
      visible: false,
    },
    {
      title: t('drilling-code'),
      field: 'confection.lot_installment.pallets.cultivation.code',
      formatter: ({ row }) => row.confection?.lot_installment?.pallets[0]?.cultivation.code,
      ...InputFilter(),
      visible: false,
    },
    {
      title: t('product'),
      field: 'confection.final_product.name',
      ...SelectFilter({
        filters: productStore.getProducts,
      }),
    },
    {
      title: t('category'),
      field: 'confection.final_product.product_category.label',
      ...SelectFilter({
        filters: productCategoryStore.getProductCategories,
      }),
      visible: false,
    },
    {
      title: t('product-caliber'),
      field: 'confection.final_product.product_caliber.label',
      ...SelectFilter({ filters: productCaliberStore.getProductCalibers }),
    },
    {
      title: t('variety'),
      field: 'confection.final_product.variety.name',
      ...SelectFilter({ filters: varietyStore.getVarieties }),
    },
    {
      title: t('brand'),
      field: 'confection.final_product.brand.label',
      ...SelectFilter({ filters: brandStore.getBrands }),
    },
    {
      title: t('unity-measure'),
      field: 'confection.final_product.unity_measure',
      formatter: ({ cellValue }) => (cellValue ? t(cellValue) : ''),
      ...SelectFilter({
        filters: productStore.measureUnits.map(({ label, value }) => ({ label: t(label), value })),
      }),
      visible: false,
    },
    { title: t('nbr-boxes'), field: 'confection.nbr_boxes' },
    { title: t('nbr-unit'), field: 'confection.nbr_unities' },
    { title: t('weight-per-package'), field: 'confection.final_product.net_weight', visible: false },
    { title: t('net-weight'), field: 'confection.net_weight' },
    { title: t('gross-weight'), field: 'confection.gross_weight' },
    { title: t('temperature'), field: 'temperature' },
    {
      field: 'expedition.created_at',
      title: t('created-at'),
      width: 165,
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_TIME_FORMAT),
    },
  ]

  return selectedView.value ? groupColumns : listColumns
})

const childColumns = computed(() => [
  { type: 'seq', title: t('order'), width: 65 },
  { title: t('product'), field: 'final_product.name' },
  {
    title: t('pallet-code'),
    field: 'pallet_code',
    formatter: ({ cellValue, row }) => `${cellValue}-${row?.pallet_code_suffix}`,
  },
  { title: t('nbr-boxes'), field: 'nbr_boxes' },
  { title: t('total-gross'), field: 'gross_weight' },
  { title: t('total-net'), field: 'net_weight' },
  {
    title: t('status'),
    field: 'is_shipped',
    formatter: ({ cellValue }) => t(expeditionStore.status.find(({ value }) => value == cellValue).label),
    className: ({ row }) => expeditionStore.status.find(({ value }) => value == row.is_shipped).class,
  },
  { title: t('temperature'), field: 'temperature' },
])

onMounted(() => {
  siteStore.fetchAllSites()
  vehicleStore.fetchAllVehicles()
  vehicleTypeStore.fetchVehicleTypes({ list: true })
  transporterStore.fetch({ list: true })
  lotInstallmentsStore.fetch({ list: true })
  productStore.fetch({ list: true })
  unityStore.fetchUnities({ list: true })
  varietyStore.fetchAllVarieties({ list: true })
  confectionStore.fetch({ list: true })
  clientStore.fetchClients({ list: true })
  companyStore.fetchCompanies({ list: true })
  brandStore.fetchBrands({ list: true })
  productCaliberStore.fetchProductCalibers({ list: true })
  productCategoryStore.fetchProductCategories({ list: true })
})

const checkboxChangeEvent = (e) => (selectedRows.value = e.records)

const addHandler = () => {
  expedition.value = {}
  openDialog()
}

const editHandler = (value) => {
  expedition.value = value
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  expeditionStore.remove(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const viewChanged = ({ value, isMounted }) => {
  selectedView.value = value

  if (!isMounted) {
    vxtable.value.refresh()
  }
}

const openDialog = () => useDialog.open('create_edit_expedition')

const openPrintDownloadDocsDialog = (rows) => {
  expeditions.value = rows
  useDialog.open('print_download_docs')
}

const toggleStatus = (row) => {
  loading.value = true

  expeditionStore.updateStatus(row).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}
</script>
