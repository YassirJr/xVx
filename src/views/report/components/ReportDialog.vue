<template>
  <el-dialog
    :title="$t(details.title)"
    :model-value="useDialog.visible(details.title)"
    top="5vh"
    width="90%"
    :z-index="1000"
    @close="useDialog.close(details.title)"
    @open="openDialog()"
  >
    <vx-table
      ref="vxtable"
      v-loading="loading"
      :columns="columns"
      :ajax="ajax"
      v-bind="vxTableBind"
      :footer-method="footerMethod"
      :show-footer="showFooter"
      :footer-cell-class-name="'bg-gray-100 font-semibold'"
    >
      <template #toolbar>
        <div v-if="details.isPayClosure">
          <el-select v-model="selectedEmployeeType" clearable @change="onTypeChange()">
            <el-option
              v-for="(type, i) in employeeTypeStore.types"
              :key="i"
              :label="type.name"
              :value="type.id"
            />
          </el-select>
          <el-select
            v-model="selectedPayClosure"
            class="ml-3"
            :disabled="!selectedEmployeeType"
            clearable
            @change="reset()"
          >
            <el-option
              v-for="(payClosure, i) in payClosureStore.payClosuresByEmployeeType(selectedEmployeeType)"
              :key="i"
              :label="`${payClosure.start_date} > ${payClosure.end_date}`"
              :value="payClosure.id"
            />
          </el-select>
        </div>
        <el-date-picker
          v-else
          v-model="selectedDateRange"
          class="w-full max-w-[350px]"
          type="daterange"
          :clearable="false"
          :start-placeholder="t('start-date')"
          :end-placeholder="t('end-date')"
          :range-separator="$t('to')"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          @calendar-change="handleSelectedDateRange"
          @visible-change="handleDatePickerFocus"
          @change="vxtable.refresh()"
        />
      </template>
    </vx-table>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDialog, useQuery } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { useReportStore } from '@/stores/report'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { usePayClosureStore } from '@/stores/payClosure'
import Reports from '../modules'

const reportStore = useReportStore()
const employeeTypeStore = useEmployeeTypeStore()
const payClosureStore = usePayClosureStore()

const props = defineProps({
  details: {
    type: Object,
    required: true,
  },
})

const selectedDateRange = ref([])
const startSelectedDate = ref(null)
const footerData = ref(null)
const showFooter = ref(false)
const vxtable = ref(null)
const selectedEmployeeType = ref(null)
const selectedPayClosure = ref(null)
const columns = ref([])
const loading = ref(false)

const ajax = computed(() => ({
  query: (params) => {
    const isEmpty = props.details.isPayClosure ? !selectedPayClosure.value : !selectedDateRange.value.length

    if (isEmpty) {
      return { page: { total: 0 }, result: [] }
    }

    let query = useQuery(params)

    const endpoint = props.details.endpoint

    if (props.details.isPayClosure) {
      query['pay_closure_id'] = selectedPayClosure.value
    } else {
      query['date_range'] = {
        ...[dayjs(selectedDateRange.value[0]).format(), dayjs(selectedDateRange.value[1]).format()],
      }
    }

    return new Promise((resolve) => {
      reportStore.fetch({ ...query, endpoint }).then((response) => {
        const resFooter = response[props.details.footer]
        const footerRes = typeof resFooter == 'object' ? resFooter : { footer: resFooter }

        if (props.details.footer) {
          footerData.value = Object.assign({}, footerRes)
          showFooter.value = Boolean(response.total > 1)
        }

        resolve({
          page: {
            total: response.total,
          },
          result: response.data,
        })
      })
    })
  },
}))

const shortcuts = computed(() => {
  const today = dayjs()
  return [
    {
      text: t('last-day'),
      value: () => [today.add(-1, 'days'), today],
    },
    {
      text: t('last-week'),
      value: () => [today.add(-1, 'weeks'), today],
    },
    {
      text: t('last-month'),
      value: () => [today.add(-1, 'months'), today],
    },
    {
      text: t('last-tree-months'),
      value: () => [today.add(-3, 'months'), today],
    },
  ]
})

const footerMethod = ({ columns }) => [
  columns.map(({ field }) => props.details.footerCondition(field, footerData.value)),
]

const disabledDate = (date) => {
  if (!startSelectedDate.value) return false

  const threeMonthsLater = startSelectedDate.value.month(startSelectedDate.value.month() + 3)

  return date > threeMonthsLater || date < startSelectedDate.value
}

const handleSelectedDateRange = (date) => {
  if (date[0]) startSelectedDate.value = dayjs(date[0])
}

const handleDatePickerFocus = () => {
  if (startSelectedDate.value) startSelectedDate.value = null
}

const onTypeChange = () => {
  selectedPayClosure.value = null
  reset()
}

const vxTableBind = computed(() => {
  const pagerConfig = props.details.pagerConfig

  return pagerConfig ? { pagerConfig } : {}
})

const reset = () => {
  showFooter.value = false
  vxtable.value.refresh()
}

const openDialog = () => {
  reportStore.dataFetchingDelay(props.details).then(async () => {
    loading.value = true
    await props.details.fetchData()
    columns.value = Reports[props.details.key]().columns
    loading.value = false
  })
}
</script>
