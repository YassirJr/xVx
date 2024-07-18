<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="getColumns"
      :ajax="ajax"
      :hide-actions="true"
      @checkbox-change="checkboxChangeEvent"
    >
      <template #toolbar>
        <div class="flex justify-start items-center">
          <period-type
            :add-processing="true"
            process-permission="processed-payroll-process"
            @pay-closure-change="payClosureChange"
            @launch-processing="launchProcessing"
          />
          <div class="ml-3">
            <el-button
              v-if="selectedRows?.length"
              plain
              type="primary"
              @click="useDialog.open('orientation_type')"
            >
              <i-tabler-download />
              <span class="inline-block ml-2">{{ $t('download-selected') }}</span>
            </el-button>
          </div>
        </div>
      </template>
      <template #more_actions="row">
        <el-tooltip v-if="isQFS" class="box-item" effect="dark" :content="$t('Payslip')" placement="left">
          <el-button
            plain
            type="success"
            @click="downloadPayrollCheck({ employees: [row], orientation: 'landscape' })"
          >
            <span class="inline-block -rotate-90">
              <i-tabler-file-text />
            </span>
          </el-button>
        </el-tooltip>
        <el-tooltip v-if="isQFS" class="box-item" effect="dark" :content="$t('Payslip')" placement="left">
          <el-button
            plain
            type="primary"
            @click="downloadPayrollCheck({ employees: [row], orientation: 'portrait' })"
          >
            <span class="inline-block">
              <i-tabler-file-text />
            </span>
          </el-button>
        </el-tooltip>
        <el-tooltip
          v-if="!isQFS"
          class="box-item"
          effect="dark"
          :content="$t('landscape-duplicated')"
          placement="left"
        >
          <el-button
            plain
            type="success"
            @click="downloadPayrollCheck({ employees: [row], orientation: 'landscape-duplicated' })"
          >
            <span class="inline-block -rotate-90">
              <i-tabler-file-text />
            </span>
          </el-button>
        </el-tooltip>
        <el-tooltip v-if="!isQFS" class="box-item" effect="dark" :content="$t('landscape')" placement="left">
          <el-button
            plain
            type="success"
            @click="downloadPayrollCheck({ employees: [row], orientation: 'landscape' })"
          >
            <span class="inline-block -rotate-90">
              <i-tabler-file-text />
            </span>
          </el-button>
        </el-tooltip>
        <el-tooltip v-if="!isQFS" class="box-item" effect="dark" :content="$t('portrait')" placement="right">
          <el-button
            plain
            type="primary"
            @click="downloadPayrollCheck({ employees: [row], orientation: 'portrait' })"
          >
            <i-tabler-file-text />
          </el-button>
        </el-tooltip>
      </template>
    </vx-table>
  </div>
  <orientation-type
    :loading="loading"
    @download-payroll-check="(orientation) => downloadPayrollCheck({ employees: selectedRows, orientation })"
  ></orientation-type>
</template>

<script setup>
import { downloadDocs } from '@/helpers/docs'
import OrientationType from './components/OrientationType'
import PeriodType from '@/components/PeriodType'
import { ref, computed, onMounted } from 'vue'
import { DATE_FORMAT } from '@/constants'
import { getCompanyLogo, isQFS, uniqueArray, useDialog, useQuery, InputFilter } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { useProcessedPayrollStore } from '@/stores/processedPayroll'
import { useEmployeeStore } from '@/stores/employee'
import { useCompanyStore } from '@/stores/company'

const loading = ref(false)
const selectedRows = ref([])
const payroll = ref({ pay_closure_id: null })
const payClosure = ref(null)
const sectionColumns = ref([])
const vxtable = ref(null)

const processedPayrollStore = useProcessedPayrollStore()
const employeeStore = useEmployeeStore()
const companyStore = useCompanyStore()

onMounted(() => {
  companyStore.fetchCompanies({ list: true })
})

const ajax = computed(() => {
  return {
    query: (params) => {
      if (!payroll.value?.pay_closure_id) {
        return { page: { total: 0 }, result: [] }
      }

      const query = useQuery(params)

      query.filter['pay_closure_id'] = payroll.value.pay_closure_id

      return new Promise((resolve) => {
        processedPayrollStore.fetch(query).then(({ data, total }) => {
          sectionColumns.value = uniqueArray(data.map((payroll) => payroll.sections))
            .filter(({ payroll_book }) => payroll_book)
            .map((section) => {
              return {
                ...section,
                field: `section_${section.id}`,
                title: section.label,
              }
            })

          resolve({
            page: {
              total: total,
            },
            result: data?.map((el) => ({ ...el, ...(el?.payroll_data ?? []) })),
          })
        })
      })
    },
  }
})

const columns = computed(() => [
  { type: 'checkbox', width: 45, align: 'center' },
  {
    field: 'employee.uid',
    title: t('code'),
    sortable: true,
    ...InputFilter(),
  },
  { field: 'employee.firstname', title: t('firstname') },
  { field: 'employee.lastname', title: t('lastname') },
  {
    field: 'employee.hiring_date',
    title: t('hiring-date'),
    formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
  },
  { field: 'nbr_days', title: t('nbr-working-days') },
  { field: 'nbr_declared_days', title: t('nbr-declared-days') },
  {
    field: 'family_status',
    title: t('family-status'),
    formatter: ({ cellValue }) => t(employeeStore.getFamilyStatus(cellValue)),
  },
  {
    field: 'nbr_children',
    title: t('number-of-children'),
  },
  { field: 'employee.cin', title: t('cin'), visible: false },
  { field: 'employee.cnss_nbr', title: t(isQFS ? 'css-nbr' : 'cnss-nbr') },
  { field: 'bank.label', title: t('bank') },
  { field: 'bank_statement', title: t('bank-statement') },
  { field: 'mission.label', title: t('mission') },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const getColumns = computed(() => {
  const cols = columns.value.filter(({ slots }) => slots?.default != 'actions')
  const actionCol = columns.value.filter(({ slots }) => slots?.default == 'actions')

  return [...cols, ...sectionColumns.value, ...actionCol]
})

const payClosureChange = (val) => {
  payClosure.value = val
  payroll.value = { pay_closure_id: val.id }
  vxtable.value.refresh()
}

const launchProcessing = ({ id }) => {
  loading.value = true
  payroll.value = { pay_closure_id: id }

  processedPayrollStore.launchProcessing({ pay_closure_id: id }).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const checkboxChangeEvent = (e) => {
  selectedRows.value = e.records
}

const downloadPayrollCheck = ({ employees, orientation }) => {
  loading.value = true
  downloadDocs({
    employees: employees.map((el) => ({
      ...el,
      employee: {
        ...el.employee,
        nbr_days: el.nbr_days,
        hiring_date: dayjs(el.employee.hiring_date).format(DATE_FORMAT),
      },
    })),
    orientation,
    company: companyStore.companies[0],
    docType: 'payroll-check',
    logo: getCompanyLogo(),
    payClosure: payClosure.value,
  }).then(() => {
    loading.value = false
    useDialog.close('orientation_type')
  })
}
</script>
