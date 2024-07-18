<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="pointing-transporter-edit"
      delete-permission="pointing-transporter-delete"
      @edit="editHandler"
      @delete="deleteHandler"
      @checkbox-change="checkboxChangeEvent"
    >
      <template #toolbar>
        <div class="flex justify-start items-center">
          <div v-if="payClosure.status" class="mr-3">
            <el-button v-can="'pointing-transporter-create'" plain type="primary" @click="addHandler()">
              <i-el-plus class="mr-2" />
              {{ $t('new-pointing') }}
            </el-button>
          </div>
          <period-type @pay-closure-change="payClosureChange" />
        </div>
        <div class="ml-2">
          <el-button v-if="selectedRows?.length" plain type="primary" @click="openPrintDialog(selectedRows)">
            <i-tabler-download class="mr-2" />
            {{ $t('download-selected') }}
          </el-button>
        </div>
        <div v-if="payClosure.status" class="ml-3">
          <el-popconfirm
            v-if="selectedRows?.length"
            :title="$t('are-you-sure-to-delete-this')"
            @confirm="deleteMultiPointing()"
          >
            <template #reference>
              <el-button v-can="'pointing-transporter-delete'" plain type="danger">
                <i-el-delete class="mr-2" />
                {{ $t('delete') }}
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
      <template #more_actions="row">
        <el-button plain type="info" @click="openPrintDialog([row])">
          <i-tabler-barcode />
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :pointing="pointing" @reload="vxtable.refresh()"></create-edit>
  <print-download-docs
    :key="barcodeOptions.key"
    :data="dataToPrint"
    :options="barcodeOptions"
    :disabled="printDisabled"
    @closed="(key) => (barcodeOptions.key = key)"
  >
    <template #custom_labels>
      <barcode-copies ref="barcodePrint" @on-barcode-change="onBarcodeChange"></barcode-copies>
    </template>
  </print-download-docs>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import BarcodeCopies from '@/components/BarcodeCopies'
import PeriodType from '@/components/PeriodType'
import PrintDownloadDocs from '@/components/PrintDownloadDocs'
import { ref, computed, onMounted } from 'vue'
import { useQuery, useDialog, InputFilter, SelectFilter } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { TIME_FORMAT, DATE_FORMAT } from '@/constants'
import { usePointingTransporterStore } from '@/stores/pointingTransporter'
import { usePointingReasonStore } from '@/stores/pointingReason'
import { useEmployeeStore } from '@/stores/employee'
import { useVehicleStore } from '@/stores/vehicle'
import { useSiteStore } from '@/stores/site'

const loading = ref(false)
const vxtable = ref(null)
const barcodePrint = ref(null)
const payClosure = ref({
  id: null,
  status: false,
  start_date: null,
  end_date: null,
})
const pointing = ref({})
const selectedRows = ref([])
const selectedPointings = ref([])
const barcodeOptions = ref({
  key: null,
})
const printDisabled = ref(true)
const dataToPrint = ref([])

const pointingTransporterStore = usePointingTransporterStore()
const pointingReasonStore = usePointingReasonStore()
const employeeStore = useEmployeeStore()
const vehicleStore = useVehicleStore()
const siteStore = useSiteStore()

onMounted(() => {
  const query = { get: ['id,uid,firstname,lastname,added_at,type_id'], with: 'departure' }

  employeeStore.fetchAllEmployees(query)
  siteStore.fetchAllSites()
  vehicleStore.fetchAllVehicles()
  pointingReasonStore.fetchAllReasons()
})

const columns = computed(() => [
  { type: 'checkbox', width: 45, align: 'center', visible: payClosure.value.status },
  {
    field: 'added_at',
    title: t('date'),
    sortable: true,
    formatter: ({ row }) => dayjs(row.added_at).format(DATE_FORMAT),
    ...InputFilter({ type: 'date', payClosure: payClosure.value, data: payClosure.value.start_date }),
  },
  {
    field: 'added_time',
    title: t('time'),
    formatter: ({ row }) => dayjs(row.added_at).format(TIME_FORMAT),
  },
  {
    field: 'leader.uid',
    title: t('leader-code'),
    formatter: ({ row }) => row.leader_uid,
    ...InputFilter(),
  },
  {
    field: 'leader_fullname',
    title: t('leader'),
  },
  {
    field: 'employee.uid',
    title: t('employee-code'),
    ...InputFilter(),
  },
  {
    field: 'employee_fullname',
    title: t('employee'),
  },
  {
    field: 'employee.departure.label',
    title: t('departure'),
    ...InputFilter(),
  },
  {
    field: 'site.name',
    title: t('site'),
    ...SelectFilter({ filters: siteStore.getSites }),
  },
  {
    field: 'vehicle.registration_nbr',
    title: t('vehicle'),
    ...InputFilter(),
  },
  {
    field: 'vehicle.transporter.name',
    title: t('transporter'),
  },
  {
    field: 'user.username',
    title: t('added-by'),
    visible: false,
  },
  {
    field: 'reason.reason',
    title: t('reason'),
    visible: false,
  },
  {
    field: 'is_nature',
    title: t('nature'),
    formatter: ({ cellValue }) => t(cellValue ? 'auto' : 'manual'),
  },
  {
    title: t('actions'),
    width: 200,
    slots: { default: 'actions' },
    visible: payClosure.value.status,
  },
])

const ajax = computed(() => {
  {
    return {
      query: (params) => {
        if (!payClosure.value.id) {
          return { page: { total: 0 }, result: [] }
        }
        const query = useQuery(params)

        query.filter['pay_closure_id'] = payClosure.value.id

        return new Promise((resolve) => {
          pointingTransporterStore.fetchPointing(query).then(({ data, total }) => {
            resolve({
              page: {
                total: total,
              },
              result: data?.map((el) => ({
                ...el,
                employee_fullname: `${el.employee.firstname} ${el.employee.lastname}`,
                leader_uid: el.leader.uid,
                leader_fullname: `${el.leader.firstname} ${el.leader.lastname}`,
              })),
            })
          })
        })
      },
    }
  }
})

const onBarcodeChange = ({ format, copies }) => {
  if (copies && format) {
    printDisabled.value = false
    barcodeOptions.value = { ...barcodeOptions.value, format, copies, docType: 'transport-barcode' }

    dataToPrint.value = barcodePrint.value.getDataToPrint(selectedPointings.value, { format, copies })
  } else {
    printDisabled.value = true
  }
}

const payClosureChange = (val) => {
  payClosure.value = val
  vxtable.value.refresh()
}

const addHandler = () => {
  pointing.value = { payClosure: payClosure.value }
  openDialog()
}

const editHandler = (val) => {
  pointing.value = Object.assign({}, { ...val, payClosure: payClosure.value })
  openDialog()
}

const deleteHandler = (pointing) => {
  loading.value = true
  pointingTransporterStore.removePointing(pointing.id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_pointing_transporter')
}

const checkboxChangeEvent = (e) => {
  selectedRows.value = e.records
}

const openPrintDialog = (pointings) => {
  selectedPointings.value = pointings
  useDialog.open('print_download_docs')
}

const deleteMultiPointing = () => {
  loading.value = true
  pointingTransporterStore.removePointing(selectedRows.value.map(({ id }) => id)).finally(() => {
    vxtable.value.refresh()
    selectedRows.value = []
    loading.value = false
  })
}
</script>
