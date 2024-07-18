<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="income-tax-edit"
      delete-permission="income-tax-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'income-tax-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-income-tax-brackets') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :income-tax="incomeTax" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { useIncomeTaxStore } from '@/stores/incomeTax'
import { ref, computed } from 'vue'
import CreateEdit from './components/CreateEdit'

const loading = ref(false)
const incomeTax = ref(null)
const vxtable = ref(null)
const incomeTaxStore = useIncomeTaxStore()

const columns = computed(() => [
  { field: 'code', title: t('code') },
  { field: 'min', title: t('min') },
  { field: 'max', title: t('max') },
  { field: 'rate', title: t('rate') },
  { field: 'abatement', title: t('abatement') },
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
      incomeTaxStore.fetchIncomeTaxBrackets(query).then(({ data }) => {
        resolve({
          page: { total: data.length },
          result: data,
        })
      })
    })
  },
}))

const openDialog = () => {
  useDialog.open('create_edit_income_tax_bracket')
}

const addHandler = () => {
  incomeTax.value = {}
  openDialog()
}

const editHandler = (value) => {
  incomeTax.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  incomeTaxStore.removeIncomeTaxBracket(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}
</script>
