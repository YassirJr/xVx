<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="permission-edit"
      delete-permission="permission-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-Permission') }}
        </el-button>
      </template>
    </vx-table>
  </div>

  <create-edit :permission="permission" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { usePermissionStore } from '@/stores/permission'
import { ref, computed } from 'vue'
import CreateEdit from './components/CreateEdit'

const loading = ref(false)
const permission = ref(null)
const vxtable = ref(null)
const permissionStore = usePermissionStore()

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

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      permissionStore.fetchPermissions(query).then(({ data, total }) => {
        resolve({
          page: { total: total },
          result: data,
        })
      })
    })
  },
}))

const openDialog = () => {
  useDialog.open('create_edit_permission')
}

const addHandler = () => {
  permission.value = null
  openDialog()
}

const editHandler = (data) => {
  permission.value = Object.assign({}, data)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true

  permissionStore.removePermission(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}
</script>
