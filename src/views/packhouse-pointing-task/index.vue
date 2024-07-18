<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vx-table"
      :columns="columns"
      :ajax="ajax"
      edit-permission="packhouse-pointing-task-edit"
      delete-permission="packhouse-pointing-task-delete"
      @edit="editHandler"
      @delete="deleteHandler"
      @checkbox-change="checkboxChangeEvent"
    >
      <template #toolbar>
        <div class="flex justify-start items-center">
          <div v-if="payClosure.status" class="mr-3">
            <el-button v-can="'packhouse-pointing-task-create'" plain type="primary" @click="addHandler()">
              <i-el-plus class="mr-2" />
              {{ $t('add') }}
            </el-button>
          </div>
          <period-type
            :add-processing="true"
            :add-date-picker="true"
            process-permission="packhouse-pointing-task-process"
            @launch-processing="launchProcessing"
            @pay-closure-change="payClosureChange"
          />
          <div v-if="payClosure.status && selectedRows?.length" class="ml-3">
            <el-popover :width="495" trigger="click">
              <template #reference>
                <el-button>
                  <i-el-more-filled />
                </el-button>
              </template>
              <template #default>
                <div class="flex items-center justify-between">
                  <el-popconfirm
                    :title="$t('are-you-sure-to-delete-this')"
                    @confirm="deleteMultiPackhousePointingTasks()"
                  >
                    <template #reference>
                      <el-button v-can="'packhouse-pointing-task-delete'" class="w-36" plain type="danger">
                        <i-el-delete class="mr-2" />
                        {{ $t('delete') }}
                      </el-button>
                    </template>
                  </el-popconfirm>
                  <el-button
                    v-can="'packhouse-pointing-task-create'"
                    class="w-36"
                    plain
                    type="primary"
                    @click="$dialog.open('create_multiple_packhouse_pointing_tasks')"
                  >
                    <i-el-plus class="mr-2" />
                    {{ $t('add') }}
                  </el-button>
                  <el-button
                    v-if="selectedPrintRows?.length"
                    class="w-36"
                    plain
                    type="success"
                    @click="openPrintDialog(selectedPrintRows)"
                  >
                    <i-tabler-download class="mr-2" />
                    {{ $t('download') }}
                  </el-button>
                </div>
              </template>
            </el-popover>
          </div>
        </div>
      </template>
      <template #more_actions="row">
        <el-button plain type="info" @click="openPrintDialog([row])">
          <i-tabler-barcode />
        </el-button>
      </template>
    </vx-table>
  </div>

  <create-edit :pointing="pointing" @reload="table.refresh()"></create-edit>
  <create-multiple
    :key="payClosure.id"
    :selected-employees="selectedRows"
    :pay-closure="payClosure"
    @reload="table.refresh()"
  ></create-multiple>

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

<script>
import { InputFilter, SelectFilter, useQuery } from '@/helpers'
import { mapActions, mapGetters } from 'vuex'
import CreateEdit from './components/CreateEdit'
import CreateMultiple from './components/CreateMultiple'
import PrintDownloadDocs from '@/components/PrintDownloadDocs.vue'
import BarcodeCopies from '@/components/BarcodeCopies'
import { TIME_FORMAT, DATE_FORMAT } from '@/constants'

export default {
  components: { CreateEdit, CreateMultiple, PrintDownloadDocs, BarcodeCopies },
  data() {
    return {
      payClosure: {
        id: null,
        status: false,
        start_date: null,
        end_date: null,
      },
      selectedRows: [],
      selectedPrintRows: [],
      loading: false,
      printDisabled: true,
      barcodeOptions: { key: null },
      dataToPrint: [],
      pointing: {},
      selectedPointings: [],
      ajax: {
        query: (params) => {
          if (!this.payClosure.id) {
            return { page: { total: 0 }, result: [] }
          }
          const query = useQuery(params)

          query.filter['pay_closure_id'] = this.payClosure.id
          query.filter['added_at'] = query.filter['added_at'] ?? this.payClosure.added_at

          return new Promise((resolve) => {
            this.fetchPackhousePointingTasks(query).then(({ data, total }) => {
              resolve({
                page: {
                  total: total,
                },
                result: data,
              })
            })
          })
        },
      },
    }
  },
  computed: {
    ...mapGetters('variety', ['varieties']),
    ...mapGetters('packhouseLine', ['packhouseLines']),

    table() {
      return this.$refs['vx-table']
    },
    columns() {
      return [
        { type: 'checkbox', width: 42, align: 'center', visible: this.payClosure.status },
        {
          field: 'added_at',
          title: this.$t('date'),
          formatter: ({ cellValue }) => this.$dayjs(cellValue).format(DATE_FORMAT),
          ...InputFilter({
            type: 'date',
            className: 'h-10 p-0.5',
            clearable: true,
            payClosure: this.payClosure,
            data: this.payClosure.start_date,
          }),
          sortable: true,
        },
        { title: this.$t('time'), formatter: ({ row }) => this.$dayjs(row.added_at).format(TIME_FORMAT) },
        {
          field: 'vehicle.registration_nbr',
          title: this.$t('vehicle'),
          formatter: ({ cellValue }) => cellValue || '',
          ...InputFilter(),
          visible: false,
        },
        { field: 'employee.uid', title: this.$t('employee-code'), ...InputFilter({ type: 'number' }) },
        {
          field: 'employee',
          title: this.$t('employee'),
          formatter: ({ cellValue: { firstname, lastname } }) => `${firstname} ${lastname}`,
        },
        { field: 'site.name', title: this.$t('station'), ...InputFilter() },
        {
          field: 'packhouse_line.label',
          title: this.$t('line'),
          ...SelectFilter({
            filterMultiple: true,
            filters: this.packhouseLines.map(({ label }) => ({ label: label, value: label })),
          }),
        },
        {
          field: 'lot_installment.code',
          title: this.$t('lot-installment-nbr'),
          formatter: ({ cellValue }) => cellValue || '',
          ...InputFilter({ type: 'number' }),
        },
        {
          field: 'lot_installment.receptions.cultivation.code',
          title: this.$t('drilling-code'),
          formatter: ({ row }) => row.lot_installment?.pallets[0]?.cultivation?.code || '',
          ...InputFilter({ type: 'number' }),
          visible: false,
        },
        {
          field: 'lot_installment.receptions.cultivation.variety.name',
          title: this.$t('variety'),
          formatter: ({ row }) => row.lot_installment?.pallets[0]?.cultivation?.variety?.name || '',
          filterMultiple: false,
          filters: this.varieties.map(({ name }) => ({ label: name, value: name })) ?? [],
        },
        { field: 'packhouse_task.department.label', title: this.$t('department'), ...InputFilter() },
        { field: 'packhouse_task.name', title: this.$t('task'), ...InputFilter() },
        {
          field: 'final_product.name',
          title: this.$t('unity'),
          formatter: ({ cellValue }) => cellValue || this.$t('hour'),
          ...InputFilter(),
        },
        { field: 'number', title: this.$t('number') },
        { field: 'hours_bonus', title: this.$t('hours-bonus') },
        { field: 'task_bonus', title: this.$t('task-bonus') },
        { field: 'calc_base', title: this.$t('calc-base'), visible: false },
        { field: 'analytic_salary', title: this.$t('analytic-salary'), visible: false },
        { field: 'employer_share', title: this.$t('employer-share'), visible: false },
        { field: 'total_cost', title: this.$t('total-cost') },
        {
          field: 'is_nature',
          title: this.$t('is-nature'),
          formatter: ({ cellValue }) => this.$t(cellValue ? 'auto' : 'manual'),
          visible: false,
        },
        { field: 'user.username', title: this.$t('added-by'), visible: false },
        { field: 'reason.reason', title: this.$t('reason'), visible: false },
        {
          title: this.$t('actions'),
          slots: { default: 'actions' },
          visible: this.payClosure.status,
        },
      ]
    },
  },
  created() {
    this.fetchAllSites()
    this.fetchProducts({ list: true })
    this.fetchAllReasons()
    this.fetchLotInstallments({ list: true })
    this.fetchPackhouseTasks({ list: true })
    this.fetchAllVehicles()
    this.fetchAllEmployees({ get: ['id,uid,firstname,lastname,type_id'] })
    this.fetchAllVarieties()
    this.fetchPackhouseLines({ list: true })
  },
  methods: {
    ...mapActions('packhousePointingTask', [
      'fetchPackhousePointingTasks',
      'removePackhousePointingTask',
      'prossecPackhousePointingTask',
    ]),
    ...mapActions('site', ['fetchAllSites']),
    ...mapActions('product', ['fetchProducts']),
    ...mapActions('vehicle', ['fetchAllVehicles']),
    ...mapActions('packhouseTask', ['fetchPackhouseTasks']),
    ...mapActions('packhouseLine', ['fetchPackhouseLines']),
    ...mapActions('pointingReason', ['fetchAllReasons']),
    ...mapActions('lotInstallment', ['fetchLotInstallments']),
    ...mapActions('employee', ['fetchAllEmployees']),
    ...mapActions('variety', ['fetchAllVarieties']),

    checkboxChangeEvent(e) {
      this.selectedRows = e.records.map(({ id, employee_id }) => ({ id, employee_id }))
      this.selectedPrintRows = e.records
    },
    payClosureChange(payClosure) {
      this.payClosure = payClosure
      this.table.refresh()
    },
    addHandler() {
      this.pointing = { payClosure: this.payClosure }
      this.openDialog()
    },
    editHandler(pointing) {
      this.pointing = Object.assign(
        {},
        {
          ...pointing,
          payClosure: this.payClosure,
        },
      )
      this.openDialog()
    },
    deleteHandler(pointing) {
      this.loading = true
      this.removePackhousePointingTask(pointing.id).finally(() => {
        this.table.refresh()
        this.loading = false
      })
    },
    openDialog() {
      this.$dialog.open('create_edit_packhouse_pointing_task')
    },
    refreshTable() {
      this.table.refresh()
      this.selectedRows = []
    },
    deleteMultiPackhousePointingTasks() {
      this.loading = true
      this.removePackhousePointingTask(this.selectedRows.map(({ id }) => id)).finally(() => {
        this.refreshTable()
        this.loading = false
      })
    },
    launchProcessing({ added_at, status, id }) {
      this.loading = true
      this.payClosure = Object.assign({}, { ...this.payClosure, id, status, added_at })

      this.prossecPackhousePointingTask({
        pay_closure_id: id,
        added_at,
      }).finally(() => {
        this.loading = false
        this.table.refresh()
      })
    },
    openPrintDialog(pointings) {
      this.selectedPointings = pointings
      this.$dialog.open('print_download_docs')
    },
    onBarcodeChange({ format, copies }) {
      if (copies && format) {
        this.printDisabled = false
        this.barcodeOptions = { ...this.barcodeOptions, format, copies, docType: 'transport-barcode' }

        this.dataToPrint = this.$refs.barcodePrint.getDataToPrint(this.selectedPointings, { format, copies })
      } else {
        this.printDisabled = true
      }
    },
  },
}
</script>
