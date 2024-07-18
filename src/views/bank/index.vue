<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="bank-edit"
      delete-permission="bank-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'bank-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-bank') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :bank="bank" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { useBankStore } from '@/stores/bank'
import { ref, computed } from 'vue'
import CreateEdit from './components/CreateEdit'

const loading = ref(false)
const bank = ref(null)
const vxtable = ref(null)
const bankStore = useBankStore()

const columns = computed(() => [
  { field: 'id', title: t('code') },
  { field: 'label', title: t('label') },
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
      bankStore.fetchBanks(query).then((data) => {
        resolve({
          page: { total: data.length },
          result: data,
        })
      })
    })
  },
}))

const openDialog = () => {
  useDialog.open('create_edit_bank')
}

const addHandler = () => {
  bank.value = {}
  openDialog()
}

const editHandler = (value) => {
  bank.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  bankStore.removeBank(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}
</script>
