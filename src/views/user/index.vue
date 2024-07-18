<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="user-edit"
      delete-permission="user-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'user-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-user') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :user="user" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { useUserStore } from '@/stores/user'
import { useRoleStore } from '@/stores/role'
import { ref, computed, onMounted } from 'vue'
import CreateEdit from './components/CreateEdit'

const loading = ref(false)
const user = ref(null)
const vxtable = ref(null)
const userStore = useUserStore()
const roleStore = useRoleStore()

const columns = computed(() => [
  { field: 'username', title: t('username') },
  { field: 'role.name', title: t('role') },
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
      userStore.fetchUsers(query).then(({ data, total }) => {
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

onMounted(() => roleStore.fetchRoles({ list: true }))

const openDialog = () => {
  useDialog.open('create_edit_user')
}

const addHandler = () => {
  user.value = {}
  openDialog()
}

const editHandler = (value) => {
  user.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = (user) => {
  loading.value = true
  userStore.removeUser(user.id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}
</script>
