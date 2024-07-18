<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="role-edit"
      delete-permission="role-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-role') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :role="role" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { computed, ref } from 'vue'
import CreateEdit from './components/CreateEdit'
import { useRoleStore } from '@/stores/role'
import { dayjs, t } from '@/plugins'

const loading = ref(false)
const role = ref(null)
const vxtable = ref(null)
const roleStore = useRoleStore()

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      roleStore.fetchRoles(query).then(({ data, total }) => {
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
  { field: 'name', title: t('name') },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },

  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  role.value = null
  openDialog()
}
const editHandler = (value) => {
  role.value = Object.assign({}, value)
  openDialog()
}
const deleteHandler = ({ id }) => {
  loading.value = true
  roleStore.removeRole(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}
const openDialog = () => {
  useDialog.open('create_edit_role')
}
</script>
