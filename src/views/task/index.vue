<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="task-edit"
      delete-permission="task-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'task-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-task') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :task="task" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { ref, computed, onMounted } from 'vue'
import CreateEdit from './components/CreateEdit'
import { useStadeStore } from '@/stores/stade'
import { useTaskStore } from '@/stores/task'
import { useVarietyStore } from '@/stores/variety'

const taskStore = useTaskStore()
const stadeStore = useStadeStore()
const varietyStore = useVarietyStore()

const loading = ref(false)
const task = ref(null)
const vxtable = ref(null)
const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      taskStore.fetchTasks(query).then(({ data, total }) => {
        resolve({
          page: {
            total: total,
          },
          result: data,
        })
      })
    })
  },
}))
const columns = computed(() => [
  { field: 'code', title: t('code') },
  { field: 'name', title: t('name') },
  {
    field: 'stade.name',
    title: t('stade'),
    filterMultiple: false,
    filters: stadeStore.stades.map(({ name }) => ({ label: name, value: name })) ?? [],
  },
  { field: 'task_bonus', title: t('task-bonus') },
  {
    field: 'varieties',
    title: t('varieties'),
    className: '[&>*]:text-[0.8rem]',
    formatter: ({ cellValue }) =>
      cellValue?.length ? cellValue.map(({ name }, index) => `${index ? ' ' : ''}${name}`) : null,
  },
  {
    field: 'is_direct',
    title: t('direct'),
    formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
  },
  {
    field: 'accept_hours_only',
    title: t('hours-only'),
    formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
  },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

onMounted(() => {
  stadeStore.fetchAllStades()
  varietyStore.fetchAllVarieties()
})

const addHandler = () => {
  task.value = {}
  openDialog()
}

const editHandler = (value) => {
  task.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  taskStore.removeTask(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_task')
}
</script>
