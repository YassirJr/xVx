<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="table"
      :columns="columns"
      :ajax="ajax"
      edit-permission="packhouse-task-edit"
      delete-permission="packhouse-task-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'packhouse-task-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :packhouse-task="packhouseTask" @reload="table.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery, InputFilter, SelectFilter } from '@/helpers'
import { ref, computed, onMounted } from 'vue'
import { t } from '@/plugins'
import CreateEdit from './components/CreateEdit'
import { usePackhouseTaskStore } from '@/stores/packhouseTask'
import { useDepartmentStore } from '@/stores/department'

const packhouseTaskStore = usePackhouseTaskStore()
const departmentStore = useDepartmentStore()

const loading = ref(false)
const packhouseTask = ref({})
const table = ref(null)

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      packhouseTaskStore.fetchPackhouseTasks(query).then(({ data, total }) => {
        resolve({ page: { total: total }, result: data })
      })
    })
  },
}))

onMounted(() => {
  departmentStore.fetchDepartments({ list: true })
})

const columns = computed(() => [
  { title: t('code'), field: 'code', ...InputFilter({ type: 'number' }) },
  { title: t('name'), field: 'name', ...InputFilter() },
  {
    title: t('department'),
    field: 'department.label',
    ...SelectFilter({
      filters: departmentStore.departments.map(({ label }) => ({ label: label, value: label })) ?? [],
    }),
  },
  { title: t('task-bonus'), field: 'task_bonus' },
  {
    title: t('direct'),
    field: 'is_direct',
    formatter: ({ cellValue }) => (cellValue ? t('yes') : t('no')),
    ...SelectFilter({
      filters: packhouseTaskStore.isDirect.map((el) => ({ label: t(el.label), value: el.value })),
    }),
  },
  {
    title: t('hours-only'),
    field: 'accept_hours_only',
    formatter: ({ cellValue }) => (cellValue ? t('yes') : t('no')),
    ...SelectFilter({
      filters: packhouseTaskStore.hoursOnly.map((el) => ({ label: t(el.label), value: el.value })),
    }),
  },
  { title: t('actions'), field: 'actions', width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  packhouseTask.value = {}
  openDialog()
}

const editHandler = (value) => {
  packhouseTask.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  packhouseTaskStore.removePackhouseTask(id).then(() => {
    table.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_packhouse_task')
}
</script>
