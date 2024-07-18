<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="table"
      :columns="columns"
      :ajax="ajax"
      edit-permission="day-index-edit"
      delete-permission="day-index-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'day-index-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add-day-index') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :day-index="dayIndex" @reload="table.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { ref, computed } from 'vue'
import { dayjs, t } from '@/plugins'
import CreateEdit from './components/CreateEdit'
import { useDayIndexStore } from '@/stores/dayIndex'

const dayIndexStore = useDayIndexStore()
const loading = ref(false)
const dayIndex = ref(null)
const table = ref(null)

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      dayIndexStore.fetchDayIndexes(query).then(({ data, total }) => {
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
  {
    field: 'index_date',
    title: t('index-date'),
    formatter: ({ cellValue }) => dayjs(cellValue).format('DD-MM-YYYY'),
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
  dayIndex.value = null
  openDialog()
}

const editHandler = (row) => {
  dayIndex.value = row
  openDialog()
}

const deleteHandler = (row) => {
  loading.value = true
  dayIndexStore.removeDayIndex(row.id).finally(() => {
    table.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_day_index')
}
</script>
