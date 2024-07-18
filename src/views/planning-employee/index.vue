<template>
  <div class="p-5 bg-white rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      :hide-actions="true"
      delete-permission="planning-employee-delete"
      @checkbox-change="checkboxChangeEvent"
    >
      <template #toolbar>
        <el-button
          v-can="'planning-employee-create'"
          plain
          type="primary"
          @click="$dialog.open('create_planning_employee')"
        >
          <i-el-plus class="mr-2" />
          {{ $t('new-planning') }}
        </el-button>
        <div v-if="selectedRows?.length" class="ml-3">
          <el-popconfirm :title="$t('are-you-sure-to-delete-this')" @confirm="deleteMultiPlannings()">
            <template #reference>
              <el-button v-can="'planning-employee-delete'" class="w-full" plain type="danger">
                <i-el-delete class="mr-2" />
                {{ $t('delete') }}
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
      <template #more_actions="row">
        <el-popconfirm :title="$t('are-you-sure-to-delete-this')" @confirm="deleteHandler(row)">
          <template #reference>
            <el-button plain type="danger"><i-el-delete /></el-button>
          </template>
        </el-popconfirm>
      </template>
    </vx-table>

    <create-planning @reload="vxtable.refresh()"></create-planning>
  </div>
</template>

<script setup>
import CreatePlanning from '@/views/planning-employee/components/Create'
import { ref, computed, onMounted } from 'vue'
import { t, dayjs } from '@/plugins'
import { useQuery } from '@/helpers'
import { usePlanningEmployeeStore } from '@/stores/planningEmployee'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { useEmployeeStore } from '@/stores/employee'

const loading = ref(false)
const vxtable = ref(null)
const selectedRows = ref([])

const planningEmployeeStore = usePlanningEmployeeStore()
const employeeTypeStore = useEmployeeTypeStore()
const employeeStore = useEmployeeStore()

onMounted(() => {
  employeeStore.fetchAllEmployees({ get: ['id,uid,firstname,lastname,type_id'] })
  employeeTypeStore.fetchEmployeeTypes({ list: true })
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)
    return new Promise((resolve) => {
      planningEmployeeStore.fetch(query).then(({ data, total }) => {
        resolve({
          page: { total: total },
          result: data,
        })
      })
    })
  },
}))

const columns = computed(() => [
  { type: 'checkbox', width: 45, align: 'center' },
  {
    field: 'employee.uid',
    title: t('employee-code'),
    formatter: ({ row }) => row.employee.uid,
    filters: [{ data: '' }],
    filterRender: {
      name: '$input',
      props: {
        type: 'number',
        className: 'h-12 p-2',
        clearable: true,
      },
    },
  },
  {
    field: 'employee',
    title: t('employee'),
    formatter: ({ row }) => `${row.employee.firstname} ${row.employee.lastname}`,
  },
  {
    field: 'start_date',
    title: t('start-date'),
    formatter: ({ cellValue }) => dayjs(cellValue).format('DD-MM-YYYY'),
  },
  {
    field: 'end_date',
    title: t('end-date'),
    formatter: ({ cellValue }) => dayjs(cellValue).format('DD-MM-YYYY'),
  },
  {
    field: 'max_time',
    title: t('max-time'),
    formatter: ({ cellValue }) => dayjs(cellValue).format('HH:mm'),
  },
  { title: t('actions'), width: 90, slots: { default: 'actions' } },
])

const deleteHandler = ({ id }) => {
  loading.value = true
  planningEmployeeStore.remove(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const checkboxChangeEvent = (e) => {
  selectedRows.value = e.records
}

const refreshTable = () => {
  vxtable.value.refresh()
  selectedRows.value = []
}

const deleteMultiPlannings = () => {
  loading.value = true
  const selectedPlannings = selectedRows.value.map(({ id }) => id)

  planningEmployeeStore.remove(selectedPlannings).finally(() => {
    refreshTable()
    selectedRows.value = []
    loading.value = false
  })
}
</script>
