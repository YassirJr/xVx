<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="[...columns, ...unityColumns]"
      :ajax="ajax"
      :tooltip-config="tableTooltipConfig"
    >
      <template #toolbar>
        <div class="flex justify-start items-center">
          <period-type @pay-closure-change="lunchProcessing" />
        </div>
      </template>
    </vx-table>
  </div>
</template>

<script setup>
import PeriodType from '@/components/PeriodType'
import { useQuery } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { useUnityStore } from '@/stores/unity'
import { usePayrollStore } from '@/stores/payroll'
import { computed, onMounted, ref } from 'vue'

const loading = ref(false)
const vxtable = ref(null)
const pay_closure_id = ref(null)

const payrollStore = usePayrollStore()

const columns = computed(() => [
  { field: 'uid', title: t('code'), sortable: true },
  { field: 'firstname', title: t('firstname') },
  { field: 'lastname', title: t('lastname') },
  { field: 'nbr_days', title: t('nbr-days') },
  { field: 'nbr_total_hours', title: t('total-hours') },
  { field: 'nbr_hours_normal', title: t('normal-hours') },
  { field: 'nbr_hours_25', title: t('hours-25'), width: 80 },
  { field: 'nbr_hours_50', title: t('hours-50'), width: 80 },
  { field: 'nbr_hours_100', title: t('hours-100'), width: 80 },
])

const unityStore = useUnityStore()
onMounted(() => unityStore.fetchUnities({ list: true }))

const unityColumns = computed(() => {
  return unityStore.unities.map(({ id, label }) => {
    return {
      field: `unity_${id}`,
      title: label,
      formatter: ({ cellValue }) => cellValue ?? 0,
    }
  })
})

const ajax = computed(() => ({
  query: (params) => {
    if (!pay_closure_id.value) {
      return { page: { total: 0 }, result: [] }
    }

    const query = useQuery(params)

    query.filter = { pay_closure_id: pay_closure_id.value ?? -1, ...query.filter }

    return new Promise((resolve) => {
      payrollStore.processPayroll(query).then(({ data, total }) => {
        resolve({
          page: {
            total: total,
          },
          result: data?.map((el) => {
            return {
              ...el,
              ...(el?.unities ?? {}),
            }
          }),
        })
      })
    })
  },
}))

const tableTooltipConfig = computed(() => {
  return {
    showAll: true,
    contentMethod: ({ column, row, type }) => {
      const cols = [
        'nbr_total_hours',
        'nbr_hours',
        'nbr_hours_normal',
        'nbr_hours_25',
        'nbr_hours_50',
        'nbr_hours_100',
      ]

      if (cols.includes(column.field) && type == 'body' && row[column.field]) {
        const minutes = dayjs.duration(row[column.field], 'hours').format('mm')

        return `${parseInt(row[column.field])}h ${minutes}min`
      } else return ''
    },
  }
})

const lunchProcessing = ({ id }) => {
  pay_closure_id.value = id
  vxtable.value.refresh()
}
</script>
