<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vx-table"
      :columns="columns"
      :ajax="ajax"
      edit-permission="employee-edit"
      delete-permission="employee-delete"
      :custom-pagination-size="[2000, 3000, 4000, 6000, 8000]"
      @edit="editHandler"
      @delete="deleteHandler"
      @checkbox-change="checkboxChangeEvent"
    >
      <template #toolbar>
        <el-button v-can="'employee-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-employee') }}
        </el-button>
        <el-select v-model="employeeSelectedDoc" class="m-2">
          <el-option v-for="(doc, index) in getEmployeeDocs" :key="index" :label="$t(doc)" :value="doc" />
        </el-select>
        <div class="ml-3">
          <el-button
            v-if="selectedRows?.length && employeeSelectedDoc"
            plain
            type="primary"
            @click="downloadFile(selectedRows)"
          >
            <i-tabler-download class="mr-2" />
            {{ $t('download') }}
          </el-button>
        </div>
      </template>
      <template #custom_tools>
        <vxe-button class="mr-3" circle @click="$dialog.open('import_employee')">
          <vxe-icon name="upload" />
        </vxe-button>
      </template>
      <template #more_actions="row">
        <el-button :disabled="!employeeSelectedDoc" plain type="info" @click="downloadFile([row])">
          <i-tabler-id />
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :employee="employee" @reload="table.refresh()"></create-edit>
  <import-employee></import-employee>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateEdit from './components/CreateEdit'
import ImportEmployee from './components/ImportEmployee'
import { downloadDocs } from '@/helpers/docs'
import { loadFont } from '@/assets/fonts/Amiri-Regular'
import profileImg from '@/assets/images/profileCard.webp'
import logoCard from '@/assets/images/logoCard.webp'
import logoQFS from '@/assets/images/logoQFS.webp'
import { dateLabelFormat, datetimeValueFormat, isQFS, InputFilter, useQuery } from '@/helpers'

export default {
  components: {
    CreateEdit,
    ImportEmployee,
  },
  data() {
    return {
      loading: false,
      employee: {},
      selectedRows: [],
      employeeSelectedDoc: null,
      ajax: {
        query: (params) => {
          const query = useQuery(params)

          return new Promise((resolve) => {
            this.fetchEmployees(query).then(({ data, total }) => {
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
    ...mapGetters('departure', ['departures']),
    ...mapGetters('mission', ['missions']),
    ...mapGetters('employee', [
      'getFamilyStatus',
      'getSocialCategory',
      'getEmployeeDocs',
      'getContractTypes',
      'socialCategories',
    ]),
    ...mapGetters('employeeTypes', [
      'types',
      'getTypeDayOff',
      'getDayOff',
      'getNbrHours',
      'getCalcSeniority',
      'getPayBasis',
    ]),
    ...mapGetters('company', ['companies']),
    ...mapGetters('department', ['departments']),

    table() {
      return this.$refs['vx-table']
    },
    columns() {
      const columns = [
        { type: 'checkbox', width: 45, align: 'center' },
        {
          field: 'uid',
          title: this.$t('code'),
          showHeaderOverflow: 'tooltip',
          sortable: true,
          filters: [{ data: '' }],
          filterRender: {
            name: '$input',
            props: {
              type: 'number',
              className: 'h-12 p-2',
              clearable: false,
            },
          },
        },
        {
          field: 'firstname',
          title: this.$t('firstname'),
          showHeaderOverflow: 'tooltip',
          formatter: ({ cellValue }) => cellValue.toUpperCase(),
          filters: [{ data: '' }],
          filterRender: {
            name: '$input',
            props: {
              className: 'h-12 p-2',
              clearable: true,
            },
          },
        },
        {
          field: 'lastname',
          title: this.$t('lastname'),
          showHeaderOverflow: 'tooltip',
          formatter: ({ cellValue }) => cellValue.toUpperCase(),
          filters: [{ data: '' }],
          filterRender: {
            name: '$input',
            props: {
              className: 'h-12 p-2',
              clearable: true,
            },
          },
        },
        {
          field: 'gender',
          title: this.$t('gender'),
          showHeaderOverflow: 'tooltip',
          formatter: ({ cellValue }) => this.$t(cellValue),
          visible: false,
        },
        {
          field: 'cin',
          title: this.$t('cin'),
          showHeaderOverflow: 'tooltip',
          filters: [{ data: '' }],
          filterRender: {
            name: '$input',
            props: {
              placeholder: 'AB123',
              className: 'h-12 p-2',
              clearable: false,
            },
          },
        },
        {
          field: 'phone_number',
          title: this.$t('phone-number'),
          visible: false,
        },
        {
          field: 'birth_date',
          title: this.$t('date-of-birth'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          formatter: ({ cellValue }) => this.$dayjs(cellValue).format('DD-MM-YYYY'),
        },
        {
          field: 'birth_place',
          title: this.$t('place-of-birth'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          qfs: true,
        },
        {
          field: 'family_status',
          title: this.$t('family-status'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          formatter: ({ cellValue }) => this.$t(this.getFamilyStatus(cellValue)),
        },
        {
          field: 'nbr_children',
          title: this.$t('number-of-children'),
          showHeaderOverflow: 'tooltip',
          visible: false,
        },
        {
          field: 'nbr_wives',
          title: this.$t('number-of-wives'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          qfs: true,
        },
        {
          field: 'base_salary',
          title: this.$t('base-salary'),
          showHeaderOverflow: 'tooltip',
          formatter: ({ cellValue, row }) =>
            isQFS ? this.getSocialCategory(row.social_category)?.minSalary : cellValue,
        },
        {
          field: 'upon_salary',
          title: this.$t('upon-salary'),
          showHeaderOverflow: 'tooltip',
          formatter: ({ row }) => row.base_salary - this.getSocialCategory(row.social_category)?.minSalary,
          qfs: true,
        },
        {
          field: 'address',
          title: this.$t('address'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          formatter: ({ cellValue }) => cellValue.toUpperCase(),
        },
        {
          field: 'social_category',
          title: this.$t('social-category'),
          showHeaderOverflow: 'tooltip',
          formatter: ({ cellValue }) => {
            const label = this.getSocialCategory(cellValue)?.label
            return !label ? null : this.$t(label)
          },
          visible: false,
          filterMultiple: false,
          filters: this.socialCategories.map(({ label, value }) => ({ label: this.$t(label), value })),
        },
        {
          field: 'hiring_date',
          title: this.$t('hiring-date'),
          showHeaderOverflow: 'tooltip',
          formatter: ({ cellValue }) => this.$dayjs(cellValue).format('DD-MM-YYYY'),
          filters: [{ data: '' }],
          filterRender: {
            name: '$input',
            props: {
              type: 'date',
              className: 'h-10 p-0.5',
              clearable: true,
              labelFormat: dateLabelFormat(),
              valueFormat: datetimeValueFormat,
            },
          },
        },
        {
          field: 'contract_date',
          title: this.$t('contract-date'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          formatter: ({ cellValue }) => this.$dayjs(cellValue).format('DD-MM-YYYY'),
          filters: [{ data: '' }],
          filterRender: {
            name: '$input',
            props: {
              type: 'date',
              className: 'h-10 p-0.5',
              clearable: true,
              labelFormat: dateLabelFormat(),
              valueFormat: datetimeValueFormat,
            },
          },
        },
        {
          field: 'end_contract_date',
          title: this.$t('end-contract-date'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          formatter: ({ cellValue }) => this.$dayjs(cellValue).format('DD-MM-YYYY'),
          qfs: true,
          filters: [{ data: '' }],
          filterRender: {
            name: '$input',
            props: {
              type: 'date',
              className: 'h-10 p-0.5',
              clearable: true,
              labelFormat: dateLabelFormat(),
              valueFormat: datetimeValueFormat,
            },
          },
        },
        {
          field: 'contract_type',
          title: this.$t('contract-type'),
          visible: false,
          formatter: ({ cellValue }) => (cellValue ? this.$t(cellValue) : null),
          qfs: true,
          filterMultiple: false,
          filters: this.getContractTypes.map(({ label }) => ({ label: this.$t(label), value: label })),
        },
        {
          field: 'cnss_nbr',
          title: this.$t(isQFS ? 'css-nbr' : 'cnss-nbr'),
          showHeaderOverflow: 'tooltip',
          filters: [{ data: '' }],
          filterRender: {
            name: '$input',
            props: {
              placeholder: null,
              type: 'number',
              className: 'h-12 p-2',
              clearable: false,
            },
          },
        },
        {
          field: 'cimr_nbr',
          title: this.$t(isQFS ? 'ipres-nbr' : 'cimr-nbr'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          filters: [{ data: '' }],
          filterRender: {
            name: '$input',
            props: {
              placeholder: null,
              type: 'number',
              className: 'h-12 p-2',
              clearable: false,
            },
          },
        },
        {
          field: 'cimr_rate_id',
          title: this.$t(isQFS ? 'ipres-rc-rate' : 'cimr-rate'),
          showHeaderOverflow: 'tooltip',
          visible: false,
        },
        {
          field: 'complementary_insurance',
          title: this.$t('complementary-insurance'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          filters: [{ data: '' }],
          filterRender: {
            name: '$input',
            props: {
              placeholder: null,
              type: 'number',
              className: 'h-12 p-2',
              clearable: false,
            },
          },
        },
        {
          field: 'template->card',
          title: this.$t('template-card-number'),
          visible: false,
          ...InputFilter({ type: 'number' }),
          formatter: ({ row }) => row.template?.card,
        },
        {
          field: 'insurance_rate',
          title: this.$t('insurance-rate'),
          showHeaderOverflow: 'tooltip',
          visible: false,
        },
        {
          field: 'type.name',
          title: this.$t('type'),
          filterMultiple: false,
          filters: this.types?.length ? this.types.map(({ name }) => ({ label: name, value: name })) : [],
        },
        {
          field: 'leader',
          title: this.$t('leader'),
          formatter: ({ cellValue, row }) =>
            cellValue
              ? `${cellValue.firstname} ${cellValue.lastname} (${cellValue.uid})`.toUpperCase()
              : `${row.firstname} ${row.lastname} (${row.uid})`.toUpperCase(),
          filters: [{ data: '' }],
          filterRender: {
            name: '$input',
            props: {
              className: 'h-12 p-2',
              clearable: true,
            },
          },
        },
        {
          field: 'departure.label',
          title: this.$t('departure'),
          filterMultiple: false,
          filters:
            this.departures.map(({ label }) => ({
              label: label,
              value: label,
            })) ?? [],
          visible: false,
        },
        {
          field: 'mission.label',
          title: this.$t('mission'),
          visible: false,
          filterMultiple: false,
          filters:
            this.missions.map(({ label }) => ({
              label: label,
              value: label,
            })) ?? [],
        },
        {
          field: 'bank.label',
          title: this.$t('bank'),
          visible: false,
        },
        {
          field: 'bank_statement',
          title: this.$t('bank-statement'),
          visible: false,
          filters: [{ data: '' }],
          filterRender: {
            name: '$input',
            props: {
              placeholder: null,
              className: 'h-12 p-2',
              clearable: false,
            },
          },
        },
        {
          field: 'department.label',
          title: this.$t('department'),
          visible: false,
          filterMultiple: false,
          filters: this.departments.map(({ label }) => ({ label: label, value: label })),
        },
        {
          field: 'nbr_hours',
          title: this.$t('number-of-normal-hours'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          formatter: ({ cellValue }) => this.getNbrHours(cellValue),
        },
        {
          field: 'calc_seniority',
          title: this.$t('calc-seniority'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          formatter: ({ cellValue }) => this.$t(this.getCalcSeniority(cellValue)),
        },
        {
          field: 'pay_basis',
          title: this.$t('pay-basis'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          formatter: ({ cellValue }) => this.$t(this.getPayBasis(cellValue)),
        },
        {
          field: 'auto_pause',
          title: this.$t('auto-pause'),
          showHeaderOverflow: 'tooltip',
          visible: false,
        },
        {
          field: 'fixed_time',
          title: this.$t('fixed-time'),
          showHeaderOverflow: 'tooltip',
          visible: false,
        },
        {
          field: 'day_off',
          title: this.$t('day-off'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          formatter: ({ cellValue }) => this.$t(this.getDayOff(cellValue)),
        },
        {
          field: 'type_day_off',
          title: this.$t('type-day-off'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          formatter: ({ cellValue }) => this.$t(this.getTypeDayOff(cellValue)),
        },
        {
          field: 'calc_day_off',
          title: this.$t('calculate-extra-hours-day-off'),
          showHeaderOverflow: 'tooltip',
          visible: false,
          formatter: ({ cellValue }) => this.$t(cellValue ? 'yes' : 'no'),
        },
        {
          field: 'status',
          title: this.$t('status'),
          filters: [
            { label: this.$t('active'), value: true },
            { label: this.$t('inactive'), value: false },
          ],
          filterMultiple: false,
          formatter: ({ cellValue }) => (cellValue ? this.$t('active') : this.$t('inactive')),
          className: ({ row }) => (row.status ? 'text-green-500' : 'text-red-500'),
        },
        {
          field: 'created_at',
          title: this.$t('created-at'),
          sortable: true,
          showHeaderOverflow: 'tooltip',
          formatter: ({ cellValue }) => this.$dayjs(cellValue).fromNow(),
        },
        {
          title: this.$t('actions'),
          width: 200,
          align: 'center',
          slots: { default: 'actions' },
        },
      ]
      return isQFS ? columns : columns.filter((column) => column?.qfs != true)
    },
  },
  created() {
    this.fetchEmployeeTypes({ list: true })
    this.fetchAllDepartures()
    this.fetchDepartments()
    this.fetchAllMissions()
    this.fetchAllEmployees({ leaders_only: true, get: ['id,firstname,lastname,uid'] })
    this.fetchBanks()
    this.fetchSocialFunds({ list: true })
    this.fetchCompanies({ list: true })
  },
  methods: {
    ...mapActions('bank', ['fetchBanks']),
    ...mapActions('departure', ['fetchAllDepartures']),
    ...mapActions('mission', ['fetchAllMissions']),
    ...mapActions('department', ['fetchDepartments']),
    ...mapActions('employee', ['fetchEmployees', 'removeEmployee', 'fetchAllEmployees']),
    ...mapActions('employeeTypes', ['fetchEmployeeTypes']),
    ...mapActions('socialFund', ['fetchSocialFunds']),
    ...mapActions('company', ['fetchCompanies']),

    addHandler() {
      this.employee = {}
      this.openDialog()
    },
    editHandler(employee) {
      const minSalary = this.getSocialCategory(employee.social_category)?.minSalary

      employee = isQFS
        ? {
            ...employee,
            base_salary: minSalary,
            upon_salary: employee.base_salary - minSalary,
          }
        : employee

      this.employee = Object.assign({}, employee)
      this.openDialog()
    },
    deleteHandler(employee) {
      this.loading = true
      this.removeEmployee(employee.id).finally(() => {
        this.table.refresh()
        this.loading = false
      })
    },
    openDialog() {
      this.$dialog.open('create_edit_employee')
    },
    checkboxChangeEvent(e) {
      this.selectedRows = e.records
    },
    async downloadFile(employees) {
      this.loading = true
      if (this.employeeSelectedDoc === 'contract') {
        await loadFont()
      }
      downloadDocs({
        employees: employees.map((el) => ({
          ...el,
          birth_date: this.$dayjs(el.birth_date).format('DD-MM-YYYY'),
          hiring_date: this.$dayjs(el.hiring_date).format('DD-MM-YYYY'),
          contract_date: this.$dayjs(el.contract_date).format('DD-MM-YYYY'),
          end_contract_date: el.end_contract_date
            ? this.$dayjs(el.end_contract_date).format('DD-MM-YYYY')
            : null,
        })),
        company: this.companies[0],
        docType: this.employeeSelectedDoc,
        logo: isQFS ? logoQFS : logoCard,
        profileImg,
      }).finally(() => (this.loading = false))
    },
  },
}
</script>
