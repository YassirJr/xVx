<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      :hide-edit="true"
      edit-permission="pay-closure-edit"
      delete-permission="pay-closure-delete"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'pay-closure-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-pay-period') }}
        </el-button>
      </template>
      <template #more_actions="row">
        <!-- lock -->
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t(row.status ? 'period-opened' : 'period-closed')"
          placement="left"
        >
          <el-button
            v-can="'pay-closure-toggle-lock'"
            plain
            :type="row.status ? 'primary' : 'info'"
            @click="handelClosureStatus(row)"
          >
            <i-el-unlock v-if="row.status" />
            <i-el-lock v-else />
          </el-button>
        </el-tooltip>
      </template>
    </vx-table>
  </div>
  <create-edit @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { toCapitalize, useQuery, useDialog } from '@/helpers'
import { ref, computed, onMounted } from 'vue'
import { t, dayjs } from '@/plugins'
import { usePayClosureStore } from '@/stores/payClosure'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { DATE_FORMAT } from '@/constants'

const loading = ref(false)
const payClosure = ref({})
const vxtable = ref(null)

const payClosureStore = usePayClosureStore()

const employeeTypeStore = useEmployeeTypeStore()
onMounted(() => employeeTypeStore.fetchEmployeeTypes({ list: true }))

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      payClosureStore.fetchPayClosures(query).then(({ data, total }) => {
        resolve({
          page: { total: total },
          result: data,
        })
      })
    })
  },
}))

const columns = computed(() => [
  { field: 'type.name', title: t('employee-type') },
  {
    field: 'month',
    title: t('month'),
    formatter: ({ cellValue }) =>
      cellValue &&
      toCapitalize(
        dayjs()
          .month(cellValue - 1)
          .format('MMMM'),
      ),
  },
  { field: 'year', title: t('year') },
  {
    field: 'start_date',
    title: t('start-date'),
    formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
  },
  {
    field: 'end_date',
    title: t('end-date'),
    formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
  },
  {
    field: 'is_second_period',
    title: t('period'),
    formatter: ({ cellValue }) => (cellValue ? t('2nd-period') : t('1st-period')),
  },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  payClosure.value = {}
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true

  payClosureStore.removePayClosure(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_pay_period')
}

const handelClosureStatus = (data) => {
  loading.value = true

  payClosureStore.toggleClosureStatus({ id: data.id, status: !data.status }).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}
</script>
