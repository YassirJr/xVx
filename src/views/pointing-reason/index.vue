<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="pointing-reason-edit"
      delete-permission="pointing-reason-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'pointing-reason-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-reason') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :reason="reason" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { computed, ref } from 'vue'
import CreateEdit from './components/CreateEdit'
import { usePointingReasonStore } from '@/stores/pointingReason'
import { dayjs, t } from '@/plugins'

const loading = ref(false)
const reason = ref({})
const vxtable = ref(null)
const pointingReasonStore = usePointingReasonStore()

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      pointingReasonStore.fetchPointingReasons(query).then(({ data, total }) => {
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
  { field: 'reason', title: t('reason') },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  reason.value = null
  openDialog()
}

const editHandler = (value) => {
  reason.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  pointingReasonStore.removePointingReason(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_reason')
}
</script>
