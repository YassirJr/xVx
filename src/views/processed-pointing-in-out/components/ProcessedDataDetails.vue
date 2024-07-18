<template>
  <el-dialog
    draggable
    :model-value="useDialog.visible('processed_in_out_data_details')"
    :title="data ? `${data.employee.uid} - ${data.employee.firstname} ${data.employee.lastname}` : ''"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('processed_in_out_data_details')"
  >
    <div v-loading="loading">
      <el-button
        v-if="payClosure.status"
        v-can="'pointing-in-out-create'"
        class="mb-3"
        plain
        type="primary"
        @click="newProcessPointing()"
      >
        <i-el-plus class="mr-2" />
        {{ $t('new-pointing') }}
      </el-button>
      <vxe-grid v-bind="{ ...gridOptions, data: pointings }">
        <template #actions="{ column, row }">
          <template v-if="handleClassBtn({ column, row })">
            <el-button
              v-can="'pointing-in-out-edit'"
              plain
              size="small"
              type="warning"
              @click="editHandler({ column, row })"
            >
              <i-el-edit />
            </el-button>
            <el-popconfirm
              :title="$t('are-you-sure-to-delete-this')"
              @confirm="deleteHandler({ column, row })"
            >
              <template #reference>
                <el-button v-can="'pointing-in-out-delete'" plain size="small" type="danger">
                  <i-el-delete />
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </template>
      </vxe-grid>
    </div>
    <edit-pointing-in-out
      :key="pointing ? pointing.id : '--'"
      :pointing="pointing"
      @reload="emit('reload')"
    ></edit-pointing-in-out>
  </el-dialog>
</template>

<script setup>
import EditPointingInOut from './EditPointingInOut'
import { ref, computed, watch } from 'vue'
import { useDialog } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { DATE_FORMAT } from '@/constants'
import { usePointingInOutStore } from '@/stores/pointingInOut'

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  payClosure: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload', 'newProcessPointing'])

const loading = ref(false)
const pointing = ref(null)
const pointings = ref([])

const pointingInOutStore = usePointingInOutStore()

const gridOptions = computed(() => {
  return {
    border: true,
    round: true,
    stripe: true,
    maxHeight: window.innerHeight * 0.4,
    columnConfig: {
      resizable: true,
      useKey: `${Math.random()}-${Math.random()}`,
    },
    rowConfig: {
      keyField: `${Math.random()}-${Math.random()}`,
      useKey: `${Math.random()}-${Math.random()}`,
    },
    columns: [
      addedAtCol({ field: 'start_date', title: 'start-date' }),
      actionCol({ field: 'in_action', title: 'actions' }),
      addedAtCol({ field: 'end_date', title: 'end-date' }),
      actionCol({ field: 'out_action', title: 'actions' }),
    ],
  }
})

watch(
  () => props.data,
  (val) => {
    const newPointings = val?.pointings ?? []
    let result = []

    for (let i = 0; i < newPointings.length; i += 2) {
      const inPointing = newPointings[i] ?? null
      const outPointing = newPointings[i + 1] ?? null

      result.push({
        in_id: inPointing?.id ?? null,
        start_date: inPointing?.added_at ?? null,
        out_id: outPointing?.id ?? null,
        end_date: outPointing?.added_at ?? null,
      })
    }

    pointings.value = result
  },
  { deep: true },
)

const editHandler = ({ column, row }) => {
  const { in_id, start_date, out_id, end_date } = row
  let query = {}
  let newPointing = {}

  if (column.field == 'in_action') {
    query = { id: in_id, added_at: start_date }
  } else {
    query = { id: out_id, added_at: end_date }
  }

  newPointing = { ...query, employee_id: props.data.employee_id, pay_closure_id: props.payClosure.id }
  pointing.value = Object.assign({}, newPointing)

  useDialog.open('edit_processed_in_out')
}

const deleteHandler = ({ column, row }) => {
  let id = column.field == 'in_action' ? row.in_id : row.out_id

  loading.value = true

  pointingInOutStore
    .removePointingInOut(id)
    .then(() => reset())
    .finally(() => (loading.value = false))
}

const newProcessPointing = () => {
  let processPointing = props.data ? props.data : {}

  emit('newProcessPointing', processPointing)
  useDialog.open('create_process_pointing')
}

const reset = () => {
  emit('reload')
  useDialog.close('processed_in_out_data_details')
}

const addedAtCol = ({ field, title }) => {
  return {
    field,
    title: t(title),
    type: 'html',
    className: ({ column, row }) => (handleClassBtn({ column, row }) ? null : 'bg-red-50'),
    formatter: ({ cellValue }) =>
      cellValue
        ? `<div class="py-[13px]"><div class="absolute left-0 top-0 w-full h-full items-center grid grid-cols-2">
                <div class="col-span-1 border-r p-2">${dayjs(cellValue).format(DATE_FORMAT)}</div>
                <div class="col-span-1 p-2">${dayjs(cellValue).format('HH:mm')}</div>
              </div></div>`
        : null,
  }
}

const actionCol = ({ field, title }) => {
  return {
    field,
    title: t(title),
    width: 120,
    align: 'center',
    slots: { default: 'actions' },
    visible: props.payClosure.status,
    className: ({ column, row }) => (handleClassBtn({ column, row }) ? null : 'bg-red-50'),
  }
}

const handleClassBtn = ({ row, column }) => {
  const colField = column.field
  const inFields = ['start_date', 'in_action']
  const outFields = ['end_date', 'out_action']

  return row && ((inFields.includes(colField) && row?.in_id) || (outFields.includes(colField) && row?.out_id))
}
</script>
