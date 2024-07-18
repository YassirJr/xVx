<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="purchase-user-edit"
      delete-permission="purchase-user-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'purchase-user-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :purchase-user="purchaseUser" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { computed, ref, onMounted } from 'vue'
import { t, dayjs } from '@/plugins'
import { usePurchaseUserStore } from '@/stores/purchaseUser'
import { useUserStore } from '@/stores/user'
import { useDepartmentStore } from '@/stores/department'
import CreateEdit from './components/CreateEdit'

const purchaseUsersStore = usePurchaseUserStore()
const userStore = useUserStore()
const departmentStore = useDepartmentStore()

const loading = ref(false)
const purchaseUser = ref(null)
const vxtable = ref(null)

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)
    return new Promise((resolve) => {
      purchaseUsersStore.fetchPurchaseUsers(query).then(({ data, total }) => {
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
  { field: 'nature', title: t('nature'), formatter: ({ cellValue }) => t(cellValue) },
  {
    field: 'user.username',
    title: t('user'),
  },
  {
    field: 'departments',
    title: t('departments'),
    className: '[&>*]:text-[0.8rem]',
    formatter: ({ cellValue }) =>
      cellValue?.length ? cellValue.map(({ label }, index) => `${index ? ' ' : ''}${label}`) : null,
  },
  {
    field: 'is_applicant',
    title: t('is-applicant'),
    formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
  },
  {
    field: 'is_validator',
    title: t('is-validator'),
    formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
  },
  {
    field: 'is_order_validator',
    title: t('is-order-validator'),
    formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
  },
  { field: 'min_price', title: t('min-price'), formatter: ({ cellValue }) => cellValue?.toFixed(2) },
  { field: 'max_price', title: t('min-price'), formatter: ({ cellValue }) => cellValue?.toFixed(2) },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

onMounted(() => {
  departmentStore.fetchDepartments({ list: true })
  userStore.fetchUsers({ list: true })
})

const addHandler = () => {
  purchaseUser.value = {}
  openDialog()
}

const editHandler = (value) => {
  purchaseUser.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  purchaseUsersStore.removePurchaseUser(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_purchase_user')
}
</script>
