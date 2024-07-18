<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      :hide-actions="hiddenRows"
      :expand-config="tableExpand"
      edit-permission="purchase-offer-edit"
      delete-permission="purchase-offer-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #children="{ children }">
        <vx-table :columns="childColumns" :ajax="children" :show-children-table="true">
          <template #more_actions="{ media_uuid }">
            <el-button
              v-if="media_uuid"
              type="primary"
              class="mr-3"
              plain
              @click="mediaStore.download(media_uuid)"
            >
              <i-el-download />
            </el-button>
          </template>
        </vx-table>
      </template>
      <template #toolbar>
        <view-toolbar @view-changed="viewChanged"></view-toolbar>
        <el-button
          v-if="selectedView"
          v-can="'purchase-offer-create'"
          class="ml-3"
          plain
          type="primary"
          @click="addHandler()"
        >
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
      <template v-if="!selectedView" #more_actions="{ media_uuid }">
        <el-button
          v-if="media_uuid"
          type="primary"
          class="mr-3"
          plain
          @click="mediaStore.download(media_uuid)"
        >
          <i-el-download />
        </el-button>
      </template>
    </vx-table>
  </div>

  <create-edit :purchase-offer="purchaseOffer" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useDialog, useQuery } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { DATE_FORMAT } from '@/constants'
import CreateEdit from './components/CreateEdit'
import { usePurchaseOfferStore } from '@/stores/purchaseOffer'
import { usePurchaseUserStore } from '@/stores/purchaseUser'
import { useWarehouseStore } from '@/stores/warehouse'
import { useItemStore } from '@/stores/item'
import { useAuthStore } from '@/stores/auth'
import { useMediaStore } from '@/stores/media'

const purchaseOfferStore = usePurchaseOfferStore()
const purchaseUserStore = usePurchaseUserStore()
const warehouseStore = useWarehouseStore()
const itemStore = useItemStore()
const authStore = useAuthStore()
const mediaStore = useMediaStore()

const loading = ref(false)
const purchaseOffer = ref(null)
const vxtable = ref(null)
const selectedView = ref(null)
const hiddenRows = ref([])

const tableExpand = reactive({
  lazy: true,
  loadMethod({ row }) {
    return new Promise((resolve) => {
      row.children = Object.assign([], row.purchase_items)
      resolve()
    })
  },
})

onMounted(() => {
  authStore.initUser()
  warehouseStore.fetchWarehouses({ list: true })
  purchaseUserStore.fetchPurchaseUsers({ list: true })
  itemStore.fetchItems({ list: true })
})

const columns = computed(() => {
  const groupColumns = [
    { type: 'expand', slots: { content: 'children' }, width: 40 },
    { field: 'request_nbr', title: t('request-nbr') },
    {
      field: 'is_nature',
      title: t('nature'),
      formatter: ({ cellValue }) =>
        t(purchaseOfferStore.natures.find(({ value }) => value == cellValue)?.label),
    },
    { field: 'applicant.username', title: t('applicant') },
    { field: 'department.label', title: t('department') },
    { field: 'priority', title: t('priority'), formatter: ({ cellValue }) => t(cellValue) },
    {
      field: 'desired_delivery_at',
      title: t('desired-delivery-date'),
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
    },
    { field: 'warehouse.label', title: t('delivery-location') },
    {
      field: 'validated_at',
      title: t('validation-date'),
      formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format(DATE_FORMAT) : null),
    },
    {
      field: 'added_by.username',
      title: t('added-by'),
      formatter: ({ row, cellValue }) => (!selectedView.value ? row?.created_by?.username : cellValue),
    },
    {
      field: 'added_at',
      title: t('added-at'),
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
    },
    { title: t('actions'), slots: { default: 'actions' } },
  ]

  const listColumns = [
    { field: 'request_nbr', title: t('request-nbr') },
    {
      field: 'is_nature',
      title: t('nature'),
      formatter: ({ cellValue }) =>
        t(purchaseOfferStore.natures.find(({ value }) => value == cellValue)?.label),
    },
    { field: 'applicant.username', title: t('applicant') },
    { field: 'department.label', title: t('department') },
    { field: 'priority', title: t('priority'), formatter: ({ cellValue }) => t(cellValue) },
    {
      field: 'desired_delivery_at',
      title: t('desired-delivery-date'),
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
    },
    { field: 'warehouse.label', title: t('delivery-location') },
    {
      field: 'validated_at',
      title: t('validation-date'),
      formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format(DATE_FORMAT) : null),
    },
    {
      field: 'added_by.username',
      title: t('added-by'),
      formatter: ({ row, cellValue }) => (!selectedView.value ? row?.created_by?.username : cellValue),
    },
    { field: 'item.code', title: t('item-code') },
    { field: 'item.label', title: t('label') },
    {
      field: 'item.subfamily_item.family_item.label',
      title: t('family'),
    },
    { field: 'item.subfamily_item.label', title: t('sub-family') },
    {
      field: 'item.storable',
      title: t('storable'),
      formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
    },
    {
      field: 'item.unit',
      title: t('unit'),
      formatter: ({ cellValue }) => (cellValue ? t(cellValue) : null),
    },
    { field: 'quantity', title: t('quantity-requested') },
    { field: 'unit_cost', title: t('estimated-unit-cost') },
    { field: 'amount', title: t('amount') },
    {
      field: 'status',
      title: t('status'),
      formatter: ({ cellValue }) => {
        const status = purchaseOfferStore.statusList?.find((el) => el.value == cellValue)

        return status && t(status.label)
      },
      className: ({ row }) => {
        const status = purchaseOfferStore.statusList?.find((el) => el.value == row.status)

        return status && status.class
      },
    },
    {
      field: 'added_at',
      title: t('added-at'),
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
    },
    { field: 'note', width: 300, title: t('note') },
    { title: t('actions'), slots: { default: 'actions' } },
  ]

  return selectedView.value ? groupColumns : listColumns
})

const childColumns = computed(() => [
  { field: 'item.code', title: t('item-code') },
  { field: 'item.label', title: t('label') },
  { field: 'item.subfamily_item.family_item.label', title: t('family') },
  { field: 'item.subfamily_item.label', title: t('sub-family') },
  { field: 'item.storable', title: t('storable'), formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no') },
  { field: 'item.unit', title: t('unit'), formatter: ({ cellValue }) => (cellValue ? t(cellValue) : null) },
  { field: 'quantity', title: t('quantity-requested') },
  { field: 'unit_cost', title: t('estimated-unit-cost') },
  { field: 'amount', title: t('amount') },
  {
    field: 'status',
    title: t('status'),
    formatter: ({ cellValue }) => t(purchaseOfferStore.statusList.find((el) => el.value == cellValue).label),
    className: ({ row }) => purchaseOfferStore.statusList.find((el) => el.value == row.status).class,
  },
  { field: 'note', width: 300, title: t('note') },
  { title: t('actions'), slots: { default: 'actions' } },
])

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery({ ...params, grouped: selectedView.value })

    return new Promise((resolve) => {
      purchaseOfferStore.fetchPurchaseOffers(query).then(({ data, meta }) => {
        resolve({
          page: { total: meta.total },
          result: getViewData(data),
        })
      })
    })
  },
}))

const viewChanged = ({ value, isMounted }) => {
  selectedView.value = value

  if (!isMounted) {
    vxtable.value.refresh()
  }
}

const addHandler = () => {
  purchaseOffer.value = {}
  openDialog()
}

const editHandler = (value) => {
  purchaseOffer.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  purchaseOfferStore.removePurchaseOffer(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const getViewData = (data = []) => {
  hiddenRows.value = data
    ?.filter(({ added_by }) => !selectedView.value || added_by.id != authStore?.user?.id)
    ?.map(({ id, purchase_offer }) => (selectedView.value ? id : purchase_offer.id))

  return data.map((el) => ({ ...el, ...el.purchase_offer }))
}

const openDialog = () => {
  useDialog.open('create_edit_purchase_offer')
}
</script>
