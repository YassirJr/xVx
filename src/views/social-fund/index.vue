<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="social-fund-edit"
      delete-permission="social-fund-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'social-fund-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-social-fund') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :social-fund="socialFund" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { ref, computed } from 'vue'
import { useQuery, useDialog } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { useSocialFundStore } from '@/stores/socialFund'

const loading = ref(false)
const socialFund = ref({})
const vxtable = ref(null)

const socialFundStore = useSocialFundStore()

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      socialFundStore.fetchSocialFunds(query).then(({ data, total }) => {
        resolve({
          page: { total: total },
          result: data,
        })
      })
    })
  },
}))

const columns = computed(() => [
  { field: 'code', title: t('code') },
  {
    field: 'fund',
    title: t('fund'),
    formatter: ({ cellValue }) => t(socialFundStore.getFund(cellValue)),
  },
  { field: 'label', title: t('label') },
  { field: 'ceiling', title: t('ceiling') },
  {
    field: 'salary_rate',
    title: t('salary-rate'),
    formatter: ({ row, cellValue }) => (row.salary_rate_percent ? `${cellValue}%` : cellValue),
  },
  {
    field: 'employer_rate',
    title: t('employer-rate'),
    formatter: ({ row, cellValue }) => (row.employer_rate_percent ? `${cellValue}%` : cellValue),
  },
  {
    field: 'frequency_declaration',
    title: t('frequency_declaration'),
    formatter: ({ cellValue }) => t(socialFundStore.getFrequencyDeclaration(cellValue)),
  },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  socialFund.value = {}
  openDialog()
}

const editHandler = (value) => {
  socialFund.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  socialFundStore.removeSocialFund(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_social_fund')
}
</script>
