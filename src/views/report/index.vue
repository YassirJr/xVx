<template>
  <div class="grid grid-cols-3 gap-5 select-none">
    <div
      v-for="(report, key) in reportList"
      :key="key"
      v-can="report.permission"
      class="flex align-center justify-center items-center border-2 rounded-xl cursor-pointer px-6 py-8 h-52 bg-white hover:bg-green-50 hover:border-emerald-400 transition duration-300 ease-in-out"
      @click="openDialog(report, key)"
    >
      <div class="text-center">
        <div class="text-xl text-primary font-bold">
          {{ $t(report.title) }}
        </div>
      </div>
    </div>
  </div>
  <report-dialog v-if="selectedReport" :key="selectedReport.title" :details="selectedReport"></report-dialog>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useDialog } from '@/helpers'
import ReportDialog from './components/ReportDialog'
import Reports from './modules'

const selectedReport = ref(null)

const reportList = computed(() => ({
  pointingTasks: Reports.pointingTasks(),
  packhouseYield: Reports.packhouseYield(),
  monthlyPayrollSection: Reports.monthlyPayrollSection(),
  payrollCashList: Reports.payrollCashList(),
  payrollBankStatementList: Reports.payrollBankStatementList(),
  monthlyPayroll: Reports.monthlyPayroll(),
  packhouseReception: Reports.packhouseReception(),
  confection: Reports.confection(),
  expedition: Reports.expedition(),
  salesOrder: Reports.salesOrder(),
}))

const openDialog = (report, key) => {
  selectedReport.value = { ...report, key }

  nextTick(() => useDialog.open(report.title))
}
</script>
