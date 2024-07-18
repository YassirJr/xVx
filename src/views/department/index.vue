<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="department-edit"
      delete-permission="department-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'department-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-department') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :department="department" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { useDepartmentStore } from '@/stores/department'
import { ref, computed } from 'vue'
import CreateEdit from './components/CreateEdit'

const loading = ref(false)
const department = ref({})
const vxtable = ref(null)
const departmentStore = useDepartmentStore()

const columns = computed(() => [
  { field: 'label', title: t('label') },
  {
    field: 'created_at',
    title: t('created-at'),
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      departmentStore.fetchDepartments(query).then((data) => {
        resolve({
          page: { total: data.length },
          result: data,
        })
      })
    })
  },
}))

const openDialog = () => {
  useDialog.open('create_edit_department')
}

const addHandler = () => {
  department.value = {}
  openDialog()
}

const editHandler = (value) => {
  department.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  departmentStore.removeDepartment(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}
</script>
