<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      :expand-config="tableExpand"
      :hide-actions="!activeView"
      edit-permission="reception-edit"
      delete-permission="reception-delete"
      @edit="editHandler"
      @delete="deleteHandler"
      @checkbox-change="checkboxChangeEvent"
    >
      <template #children="{ internalAjax, externalAjax }">
        <div class="-m-3 p-3 bg-slate-50">
          <strong class="inline-block text-md mx-2 mb-2 text-prima">{{ $t('internal') }}</strong>
          <vx-table
            :columns="childColumns"
            :ajax="internalAjax"
            :show-children-table="true"
            :show-footer="internalAjax.length > 1"
            :footer-method="receptionFooterMethod"
            :footer-cell-class-name="'bg-gray-100 font-semibold'"
            :max-height="250"
            stripe
          >
            <template #more_actions="row">
              <el-button plain type="success" @click="openPrintDialog({ data: [row], singleDoc: true })">
                <i-tabler-id />
              </el-button>
            </template>
          </vx-table>
          <el-divider class="!mb-2"></el-divider>
          <strong class="inline-block text-md mx-2 mb-2">{{ $t('external') }}</strong>
          <vx-table
            :columns="childColumns.filter(({ field }) => field != 'status')"
            :ajax="externalAjax"
            :show-children-table="true"
            :show-footer="externalAjax.length > 1"
            :footer-method="receptionFooterMethod"
            :footer-cell-class-name="'bg-gray-100 font-semibold'"
            :max-height="250"
            stripe
          >
            <template #more_actions="row">
              <el-button plain type="success" @click="openPrintDialog({ data: [row], singleDoc: true })">
                <i-tabler-id />
              </el-button>
            </template>
          </vx-table>
        </div>
      </template>
      <template #toolbar>
        <view-toolbar @view-changed="viewChanged"></view-toolbar>
        <el-button
          v-if="activeView"
          v-can="'reception-create'"
          type="primary"
          class="ml-3"
          plain
          @click="addHandler()"
        >
          <i-el-plus class="mr-2" />
          {{ $t('add-reception') }}
        </el-button>
        <div class="ml-3">
          <el-button
            v-if="selectedRows.length > 1"
            plain
            type="success"
            @click="openPrintDialog({ data: selectedRows })"
          >
            <i-tabler-download class="mr-2" />
            {{ $t('download-selected') }}
          </el-button>
        </div>
      </template>
      <template #more_actions="row">
        <el-button plain type="success" @click="openPrintDialog({ data: [row] })">
          <i-tabler-id />
        </el-button>
        <el-button v-if="row.media_uuid" type="primary" plain @click="downloadFile(row.media_uuid)">
          <i-el-download />
        </el-button>
      </template>
    </vx-table>
  </div>

  <create-edit :reception="reception" @reload="reloadTable()"></create-edit>
  <print-download-docs
    :data="receptionDocs"
    :labels="isSingleDoc ? [receptionStore.getLabels[0]] : receptionStore.getLabels.slice(1)"
  />
</template>

<script setup>
import { receptionFooterMethod } from './helpers/receptionFooterMethod'
import { computed, onMounted, reactive, ref } from 'vue'
import { useBoxTypeStore } from '@/stores/boxType'
import { useCompanyStore } from '@/stores/company'
import { useCultivationStore } from '@/stores/cultivation'
import { InputFilter, sum, useDialog, useQuery, SelectFilter } from '@/helpers'
import { usePalletTypeStore } from '@/stores/palletType'
import { useReceptionStore } from '@/stores/reception'
import { useSiteStore } from '@/stores/site'
import { useTransporterStore } from '@/stores/transporter'
import { useUnityStore } from '@/stores/unity'
import { useVarietyStore } from '@/stores/variety'
import { useVehicleStore } from '@/stores/vehicle'
import { useVehicleTypeStore } from '@/stores/vehicleTypes'
import CreateEdit from './components/CreateEdit'
import { dayjs, t } from '@/plugins'
import { DATE_FORMAT, TIME_FORMAT, DATE_TIME_FORMAT } from '@/constants'
import PrintDownloadDocs from '@/components/PrintDownloadDocs'
import { useMediaStore } from '@/stores/media'

const boxTypeStore = useBoxTypeStore()
const companyStore = useCompanyStore()
const cultivationStore = useCultivationStore()
const palletTypeStore = usePalletTypeStore()
const receptionStore = useReceptionStore()
const transporterStore = useTransporterStore()
const unityStore = useUnityStore()
const varietyStore = useVarietyStore()
const vehicleTypeStore = useVehicleTypeStore()
const siteStore = useSiteStore()
const vehicleStore = useVehicleStore()
const mediaStore = useMediaStore()

const loading = ref(false)
const vxtable = ref(null)
const reception = ref({})
const selectedRows = ref([])
const receptionDocs = ref([])
const isSingleDoc = ref(true)
const activeView = ref(true)

onMounted(() => {
  boxTypeStore.fetchBoxTypes({ list: true })
  companyStore.fetchCompanies({ list: true })
  cultivationStore.fetchCultivations({ list: true })
  palletTypeStore.fetchPalletTypes({ list: true })
  transporterStore.fetch({ list: true })
  unityStore.fetchUnities({ list: true })
  varietyStore.fetchAllVarieties({ list: true })
  vehicleTypeStore.fetchVehicleTypes({ list: true })
  siteStore.fetchAllSites({ list: true })
  vehicleStore.fetchAllVehicles({ list: true })
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery({ ...params, grouped: activeView.value })

    return new Promise((resolve) => {
      receptionStore.fetchReceptions(query).then(({ data, meta }) => {
        resolve({ page: { total: meta.total }, result: data })
      })
    })
  },
}))

const tableExpand = reactive({
  lazy: true,
  loadMethod({ row }) {
    const data = row.pallets?.map((el) => ({ ...el, added_at: row.added_at, station: row.site }))

    return new Promise((resolve) => {
      row.internalAjax = data?.filter(({ type }) => type == receptionStore.type.internal)
      row.externalAjax = data?.filter(({ type }) => type == receptionStore.type.external)

      resolve()
    })
  },
})

const columns = computed(() => {
  const groupedColumns = [
    { type: 'checkbox', width: 45, align: 'center' },
    { width: 40, type: 'expand', slots: { content: 'children' } },
    {
      field: 'added_at',
      title: t('added-at'),
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
      ...InputFilter({ type: 'date' }),
    },
    { field: 'code', title: t('reception-code'), ...InputFilter() },
    {
      field: 'site.name',
      title: t('station'),
      ...SelectFilter({
        filters: siteStore.getStationSites.map(({ name }) => ({ label: name, value: name })) ?? [],
      }),
    },
    { field: 'vehicle.registration_nbr', title: t('vehicle'), ...InputFilter() },
    {
      field: 'depart_hour',
      title: t('depart-hour'),
      formatter: ({ cellValue }) => dayjs(cellValue).format(TIME_FORMAT),
    },
    {
      field: 'arrival_hour',
      title: t('arrival-hour'),
      formatter: ({ cellValue }) => dayjs(cellValue).format(TIME_FORMAT),
    },

    {
      field: 'internal_net',
      title: t('internal-net'),
      formatter: ({ row }) => {
        const palletNetWeight = row?.pallets
          ?.filter(({ type }) => type == receptionStore.type.internal)
          ?.map(({ net_weight }) => net_weight)

        return sum(palletNetWeight ?? []).toFixed(2)
      },
    },
    {
      field: 'external_net',
      title: t('external-net'),
      formatter: ({ row }) => {
        const palletNetWeight = row?.pallets
          ?.filter(({ type }) => type == receptionStore.type.external)
          ?.map(({ net_weight }) => net_weight)

        return sum(palletNetWeight ?? []).toFixed(2)
      },
    },
    {
      field: 'difference',
      title: t('difference'),
      formatter: ({ row }) => {
        const externalNetWeight = row?.pallets
          ?.filter(({ type }) => type == receptionStore.type.external)
          ?.map(({ net_weight }) => net_weight)

        const internalNetWeight = row?.pallets
          ?.filter(({ type }) => type == receptionStore.type.internal)
          ?.map(({ net_weight }) => net_weight)

        return (sum(internalNetWeight ?? []) - sum(externalNetWeight ?? [])).toFixed(2)
      },
    },
    {
      field: 'created_at',
      title: t('created-at'),
      width: 165,
      sortable: true,
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_TIME_FORMAT),
    },
    {
      title: t('actions'),
      field: 'actions',
      width: 245,
      slots: { default: 'actions' },
    },
  ]

  const listColumns = [
    { type: 'checkbox', width: 45, align: 'center' },
    { type: 'seq', title: t('order'), width: 65 },
    {
      field: 'reception.added_at',
      title: t('added-at'),
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
      ...InputFilter({ type: 'date' }),
    },
    { field: 'reception.code', title: t('reception-code'), ...InputFilter() },
    {
      field: 'reception.site.name',
      title: t('station'),
      ...SelectFilter({
        filters: siteStore.getStationSites.map(({ name }) => ({ label: name, value: name })) ?? [],
      }),
    },
    { field: 'reception.vehicle.registration_nbr', title: t('vehicle'), ...InputFilter() },
    { field: 'delivery_nbr', title: t('delivery-code'), ...InputFilter() },
    { field: 'pallet_id', title: t('pallet-code'), ...InputFilter() },
    {
      field: 'type',
      title: t('type'),
      formatter: ({ cellValue }) => {
        const type = Object.keys(receptionStore.type).find((key) => receptionStore.type[key] === cellValue)

        return type ? t(type) : null
      },
      ...SelectFilter({
        filters: Object.keys(receptionStore.type).map((key) => ({
          label: t(key),
          value: receptionStore.type[key],
        })),
      }),
    },
    {
      field: 'cultivation.parcel.site.name',
      title: t('site'),
      ...SelectFilter({ filters: siteStore.getSites }),
    },
    {
      field: 'cultivation.variety.name',
      title: t('variety'),
      ...SelectFilter({
        filters: varietyStore.getVarieties,
      }),
    },
    { field: 'cultivation.code', title: t('cultivation-code'), ...InputFilter() },
    {
      field: 'unity.label',
      title: t('unity'),
      ...SelectFilter({ filters: unityStore.getUnities }),
    },
    {
      field: 'box_type.label',
      title: t('box-type'),
      ...SelectFilter({ filters: boxTypeStore.boxTypes.map(({ label }) => ({ label, value: label })) ?? [] }),
    },
    {
      field: 'pallet_type.label',
      title: t('pallet-type'),
      ...SelectFilter({
        filters: palletTypeStore.palletTypes.map(({ label }) => ({ label, value: label })) ?? [],
      }),
    },
    { field: 'nbr_boxes', title: t('nbr-boxes') },
    { field: 'gross_weight', title: t('gross-weight') },
    { field: 'net_weight', title: t('net-weight') },
    { field: 'avg_per_box', title: t('avg-per-box') },
    {
      title: t('status'),
      field: 'status',
      className: ({ row }) => receptionStore.status.find(({ value }) => value == row.status)?.class,
      formatter: ({ cellValue }) => {
        const status = receptionStore.status.find(({ value }) => value == cellValue)?.label

        return status ? t(status) : null
      },
      ...SelectFilter({
        filters: receptionStore.status.map(({ label, value }) => ({ label: t(label), value })) ?? [],
      }),
    },
    {
      field: 'reception.created_at',
      title: t('created-at'),
      width: 165,
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_TIME_FORMAT),
    },
    { title: t('actions'), field: 'actions', width: 100, slots: { default: 'actions' } },
  ]

  return activeView.value ? groupedColumns : listColumns
})

const childColumns = computed(() => [
  { type: 'seq', title: t('order'), width: 65 },
  { field: 'delivery_nbr', title: t('delivery-code') },
  { field: 'pallet_id', title: t('pallet-code') },
  { field: 'site.name', title: t('site') },
  { field: 'unity.variety.name', title: t('variety') },
  { field: 'cultivation.code', title: t('cultivation-code') },
  { field: 'unity.label', title: t('unity') },
  { field: 'box_type.label', title: t('box-type') },
  { field: 'pallet_type.label', title: t('type') },
  { field: 'nbr_boxes', title: t('nbr-boxes') },
  { field: 'gross_weight', title: t('gross-weight') },
  { field: 'net_weight', title: t('net-weight') },
  { field: 'avg_per_box', title: t('avg-per-box') },
  {
    title: t('status'),
    field: 'status',
    className: ({ row }) => receptionStore.status.find(({ value }) => value == row.status).class,
    formatter: ({ cellValue }) => t(receptionStore.status.find(({ value }) => value == cellValue).label),
  },
  { title: t('actions'), field: 'actions', width: 250, slots: { default: 'actions' } },
])

const openDialog = () => {
  useDialog.open('create_edit_reception')
}

const addHandler = () => {
  reception.value = {}
  openDialog()
}

const checkboxChangeEvent = (e) => {
  selectedRows.value = e.records.flat()
}

const editHandler = (row) => {
  row.pallets = row.pallets.map((el) => ({ ...el, is_valid: true }))

  reception.value = Object.assign({}, row)

  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true

  receptionStore.removeReception(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openPrintDialog = ({ data, singleDoc = false }) => {
  isSingleDoc.value = singleDoc || !activeView.value

  const singlePalletData = data.map((el) => {
    let parentData = el.reception ? el.reception : { added_at: el?.added_at, site: el?.station }

    return { ...parentData, pallets: [{ ...el }] }
  })

  receptionDocs.value = isSingleDoc.value
    ? singlePalletData
    : data.map((el) => {
        return { ...el, pallets: el.pallets.filter(({ type }) => type == receptionStore.type.internal) }
      })

  useDialog.open('print_download_docs')
}

const downloadFile = (uuid) => {
  loading.value = true

  mediaStore.download(uuid).finally(() => (loading.value = false))
}

const reloadTable = () => {
  reception.value = Object.assign({}, {})

  vxtable.value.refresh()
}

const viewChanged = ({ value, isMounted }) => {
  activeView.value = value

  if (!isMounted) vxtable.value.refresh()
}
</script>
