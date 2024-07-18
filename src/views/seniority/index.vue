<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="seniority-edit"
      delete-permission="seniority-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'seniority-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-seniority-range') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :seniority="seniority" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { computed, ref } from 'vue'
import CreateEdit from './components/CreateEdit'
import { useSeniorityStore } from '@/stores/senioriy'
import { dayjs, t } from '@/plugins'

const loading = ref(false)
const seniority = ref({})
const vxtable = ref(null)
const seniorityStore = useSeniorityStore()

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      seniorityStore.fetchSeniorities(query).then(({ data, total }) => {
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
  { field: 'min_years', title: t('min-years') },
  { field: 'min_days', title: t('min-days') },
  { field: 'rate', title: t('rate') },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  seniority.value = null
  openDialog()
}

const editHandler = (value) => {
  seniority.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  seniorityStore.removeSeniority(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_seniority')
}
</script>
