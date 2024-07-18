<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      :hide-actions="hidActions"
      edit-permission="lot-instalment-edit"
      delete-permission="lot-instalment-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'lot-instalment-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
      <template #more_actions="row">
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t(row.status ? 'open' : 'closed')"
          placement="left"
        >
          <el-button
            v-can="'lot-instalment-edit'"
            plain
            :type="row.status ? 'primary' : 'info'"
            @click="toggleStatus(row)"
          >
            <i-el-unlock v-if="row.status" />
            <i-el-lock v-else />
          </el-button>
        </el-tooltip>
      </template>
    </vx-table>
  </div>

  <create-edit :lot-installment="lotInstallment" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { t, dayjs } from '@/plugins'
import { InputFilter, useDialog, useQuery, sum, SelectFilter } from '@/helpers'
import { DATE_TIME_FORMAT } from '@/constants'
import CreateEdit from './components/CreateEdit'

import { useLotInstallmentStore } from '@/stores/lotInstallment'
import { useReceptionStore } from '@/stores/reception'
import { useCultivationStore } from '@/stores/cultivation'
import { useSiteStore } from '@/stores/site'
import { useVarietyStore } from '@/stores/variety'
import { useUnityStore } from '@/stores/unity'

const vxtable = ref(null)
const loading = ref(false)
const lotInstallment = ref({})
const hidActions = ref([])

const lotInstallmentStore = useLotInstallmentStore()
const receptionStore = useReceptionStore()
const cultivationStore = useCultivationStore()
const siteStore = useSiteStore()
const varietyStore = useVarietyStore()
const unityStore = useUnityStore()

onMounted(() => {
  receptionStore.fetchReceptions({ list: true })
  cultivationStore.fetchCultivations({ list: true })
  siteStore.fetchAllSites()
  varietyStore.fetchAllVarieties()
  unityStore.fetchUnities({ list: true })
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      lotInstallmentStore.fetch(query).then(async ({ data, total }) => {
        await receptionStore.fetchLimiters()

        hidActions.value = data?.filter(({ status }) => status == false)?.map(({ id }) => id)

        resolve({ page: { total: total }, result: data })
      })
    })
  },
}))

const columns = computed(() => [
  {
    title: t('lot-installment-nbr'),
    field: 'code',
    ...InputFilter({ type: 'number' }),
  },
  {
    title: t('created-at'),
    field: 'created_at',
    width: 165,
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_TIME_FORMAT),
  },
  {
    title: t('drilling-code'),
    field: 'pivot_pallets.pallet.cultivation.code',
    formatter: ({ row }) => row.pivot_pallets[0].pallet.cultivation.code,
    ...InputFilter({ type: 'number' }),
  },
  {
    title: t('farm'),
    field: 'pivot_pallets.pallet.site.name',
    formatter: ({ row }) => row.pivot_pallets[0].pallet.site.name,
    ...InputFilter(),
  },
  {
    title: t('variety'),
    field: 'pivot_pallets.pallet.unity.variety.name',
    formatter: ({ row }) => row.pivot_pallets[0].pallet.unity.variety.name,
    filterMultiple: true,
    ...SelectFilter({
      filters: varietyStore.getVarieties,
    }),
  },
  {
    title: t('nbr-boxes'),
    field: 'nbr_boxes',
    formatter: ({ row }) => sum(row.pivot_pallets.map(({ nbr_boxes }) => nbr_boxes)),
  },
  {
    title: t('total-gross'),
    field: 'total_gross',
    formatter: ({ row }) => sum(row.pivot_pallets.map(({ pallet: { gross_weight } }) => gross_weight)),
  },
  {
    title: t('total-net'),
    field: 'total_net',
    formatter: ({ row }) => sum(row.pivot_pallets.map(({ net_weight }) => net_weight)),
  },
  {
    title: t('avg-per-box'),
    field: 'avg_per_box',
    formatter: ({ row }) =>
      (
        sum(row.pivot_pallets.map(({ pallet: { gross_weight } }) => gross_weight)) /
        sum(row.pivot_pallets.map(({ nbr_boxes }) => nbr_boxes))
      ).toFixed(2),
  },
  { title: t('actions'), field: 'actions', width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  lotInstallment.value = {}
  openDialog()
}

const editHandler = (value) => {
  lotInstallment.value = value
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  lotInstallmentStore.remove(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_lot_installment')
}

const toggleStatus = (row) => {
  loading.value = true
  lotInstallmentStore.updateStatus(row).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}
</script>
