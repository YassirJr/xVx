<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      :hide-actions="hiddenRows"
      edit-permission="confection-edit"
      delete-permission="confection-delete"
      @edit="editHandler"
      @delete="deleteHandler"
      @checkbox-change="checkboxChangeEvent"
    >
      <template #toolbar>
        <el-button v-can="'confection-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-confection') }}
        </el-button>
        <div class="ml-3">
          <el-button
            v-if="selectedRows?.length"
            plain
            type="primary"
            @click="openPrintDownloadDocsDialog(selectedRows)"
          >
            <i-tabler-download class="mr-2" />
            {{ $t('download-selected') }}
          </el-button>
        </div>
      </template>
      <template #more_actions="row">
        <el-button plain type="info" @click="openPrintDownloadDocsDialog([row])">
          <i-tabler-ticket />
        </el-button>
        <el-button
          v-if="!hideAction(row)"
          v-can="'confection-create'"
          plain
          type="primary"
          @click="addSubPallet(row)"
        >
          <i-tabler-square-plus />
        </el-button>
      </template>
    </vx-table>
  </div>

  <create-edit :confection="confection" @reload="vxtable.refresh()"></create-edit>
  <print-download-docs :data="printableConfections" :labels="confectionStore.getLabels" />
</template>

<script setup>
import PrintDownloadDocs from '@/components/PrintDownloadDocs'
import { useConfectionStore } from '@/stores/confection'
import { ref, computed, onMounted } from 'vue'
import CreateEdit from './components/CreateEdit'
import { dayjs, t } from '@/plugins'
import { useQuery, InputFilter, SelectFilter, useDialog, isGanFruits, groupBy } from '@/helpers'
import { DATE_FORMAT, GAN_FRUITS_COMPANIES, GAN_FRUITS_COMPANIES_LIST, DATE_TIME_FORMAT } from '@/constants'
import { useCompanyStore } from '@/stores/company'
import { useVarietyFieldStore } from '@/stores/varietyField'
import { useProductStore } from '@/stores/product'
import { useUnityStore } from '@/stores/unity'
import { useSiteStore } from '@/stores/site'
import { useVarietyStore } from '@/stores/variety'
import { usePalletTypeStore } from '@/stores/palletType'
import { useLotInstallmentStore } from '@/stores/lotInstallment'
import { useBrandStore } from '@/stores/brand'
import { useDayIndexStore } from '@/stores/dayIndex'

const vxtable = ref(null)
const loading = ref(false)
const confection = ref({})
const selectedRows = ref([])
const hiddenRows = ref([])
const confections = ref([])

const confectionStore = useConfectionStore()
const companyStore = useCompanyStore()
const siteStore = useSiteStore()
const varietyStore = useVarietyStore()
const varietiesFieldStore = useVarietyFieldStore()
const productStore = useProductStore()
const unityStore = useUnityStore()
const palletTypeStore = usePalletTypeStore()
const LotInstallmentStore = useLotInstallmentStore()
const brandStore = useBrandStore()
const dayIndexStore = useDayIndexStore()

onMounted(() => {
  siteStore.fetchAllSites({ list: true })
  varietyStore.fetchAllVarieties({ list: true })
  varietiesFieldStore.fetch({ list: true })
  productStore.fetch({ list: true })
  companyStore.fetchCompanies({ list: true })
  unityStore.fetchUnities({ list: true })
  palletTypeStore.fetchPalletTypes({ list: true })
  LotInstallmentStore.fetch({ list: true })
  LotInstallmentStore.fetchLimiters()
  brandStore.fetchBrands({ list: true })
  dayIndexStore.fetchDayIndexes({ list: true })
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      confectionStore.fetch(query).then(({ data, total }) => {
        hiddenRows.value = data
          ?.filter(({ status }) => status !== confectionStore.statusOptions[0].value)
          ?.map(({ id }) => id)
        confectionStore.fetch({ list: true })

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
  { type: 'checkbox', width: 45, align: 'center' },
  { type: 'seq', title: t('order'), width: 65 },
  {
    title: t('date'),
    field: 'added_at',
    formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
    filters: [{ data: '' }],
    ...InputFilter({ type: 'date', clearable: true }),
  },
  {
    title: t('index-date'),
    field: 'day_index.code',
    ...InputFilter({ type: 'number' }),
    visible: false,
  },

  {
    title: t('company'),
    field: 'company',
    formatter: ({ cellValue }) => GAN_FRUITS_COMPANIES[cellValue]?.label ?? null,
    visible: isGanFruits,
    ...SelectFilter({
      filters: GAN_FRUITS_COMPANIES_LIST.map(({ label, id }) => ({ label, value: id })),
    }),
  },
  { title: t('tracking-nbr'), field: 'tracking_nbr', ...InputFilter() },
  {
    title: t('packhouse'),
    field: 'site.name',
    ...SelectFilter({
      filters: siteStore.getStationSites.map(({ name }) => ({ label: name, value: name })) ?? [],
    }),
    visible: false,
  },
  {
    title: t('farm'),
    field: 'lot_installment.pallets.site.name',
    formatter: ({ row }) => row.lot_installment.pallets[0]?.site.name,
    ...SelectFilter({
      filters: siteStore.getSites,
    }),
  },
  {
    title: t('variety'),
    field: 'lot_installment.pallets.cultivation.variety.name',
    formatter: ({ row }) => row.lot_installment.pallets[0]?.cultivation.variety.name,
    ...SelectFilter({
      filters: varietyStore.varieties.map(({ name }) => ({ label: name, value: name })) ?? [],
    }),
    visible: false,
  },
  {
    title: t('variety-field'),
    field: 'lot_installment.pallets.cultivation.variety_field.label',
    formatter: ({ row }) => row.lot_installment.pallets[0]?.cultivation?.variety_field?.label,

    ...SelectFilter({
      filters: varietiesFieldStore.varietyFields.map(({ label }) => ({ label: label, value: label })) ?? [],
    }),
    visible: false,
  },
  {
    title: t('unity'),
    field: 'lot_installment.pallets.unity.label',
    formatter: ({ row }) => row.lot_installment.pallets[0]?.unity.label,
    ...SelectFilter({ filters: unityStore.getUnities }),
    visible: false,
  },
  {
    title: t('drilling-code'),
    field: 'lot_installment.pallets.cultivation.code',
    formatter: ({ row }) => row.lot_installment.pallets[0]?.cultivation.code,
    ...InputFilter(),
    visible: false,
  },
  {
    field: 'lot_installment.code',
    title: t('lot-installment-nbr'),
    ...InputFilter(),
  },
  {
    title: t('pallet-code'),
    field: 'pallet_code',
    formatter: ({ row: { pallet_code, pallet_code_suffix } }) => `${pallet_code}-${pallet_code_suffix}`,
    ...InputFilter({ type: 'number' }),
  },
  {
    title: t('product'),
    field: 'final_product.name',
    ...SelectFilter({ filters: productStore.getProducts }),
  },
  {
    title: t('nature'),
    field: 'final_product.destination',
    formatter: ({ cellValue }) => t(productStore.destinations.find(({ value }) => value == cellValue).label),
    ...SelectFilter({
      filters: productStore.destinations.map(({ label, value }) => ({ label: t(label), value: value })),
    }),
  },
  { title: t('category'), field: 'final_product.product_category.label', visible: false },
  {
    title: t('product-caliber'),
    field: 'final_product.product_caliber.label',
    ...InputFilter(),
    visible: false,
  },
  {
    title: t('brand'),
    field: 'final_product.brand.label',
    ...SelectFilter({ filters: brandStore.getBrands }),
  },
  {
    title: t('unity-measure'),
    field: 'final_product.unity_measure',
    formatter: ({ cellValue }) => t(cellValue),
    visible: false,
  },
  { title: t('nbr-boxes'), field: 'nbr_boxes' },
  { title: t('number-of-unities'), field: 'nbr_unities', visible: false },
  { title: t('weight-per-package'), field: 'final_product.net_weight', visible: false },
  { title: t('total-gross'), field: 'gross_weight' },
  { title: t('total-net'), field: 'net_weight' },
  {
    title: t('status'),
    field: 'status',
    formatter: ({ cellValue }) =>
      t(confectionStore.statusOptions.find(({ value }) => value == cellValue).label),
    className: ({ row }) => confectionStore.statusOptions.find(({ value }) => value == row.status).class,
    ...SelectFilter({
      filters: confectionStore.statusOptions.map(({ label, value }) => ({ label: t(label), value: value })),
    }),
  },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_TIME_FORMAT),
  },
  { title: t('actions'), field: 'actions', width: 250, slots: { default: 'actions' } },
])

const printableConfections = computed(() => {
  return confections.value.map((el) => ({ confection: el, company: companyStore.companies[0] }))
})

const checkboxChangeEvent = (e) => {
  selectedRows.value = e.records
}

const addHandler = () => {
  confection.value = Object.assign({}, {})

  openDialog()
}

const addSubPallet = ({ pallet_code, tracking_nbr }) => {
  let groupedPallets = groupBy(confectionStore.confections, 'pallet_code')

  const latestPallet = Object.values(groupedPallets)
    .reduce((pallets, confection) => pallets.concat(confection), [])
    .filter((el) => el.pallet_code == pallet_code)
    .sort((prev, current) => current.pallet_code_suffix - prev.pallet_code_suffix)

  const { added_at, company, site_id, pallet_code_suffix, day_index_id } = latestPallet[0]

  confection.value = Object.assign(
    {},
    { added_at, company, site_id, pallet_code, pallet_code_suffix, day_index_id, tracking_nbr },
  )

  openDialog()
}

const editHandler = (row) => {
  confection.value = Object.assign({}, row)

  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  confectionStore.remove(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_confection')
}

const openPrintDownloadDocsDialog = (rows) => {
  confections.value = rows
  useDialog.open('print_download_docs')
}

const hideAction = (row) => {
  return hiddenRows.value.includes(row.id)
}
</script>
