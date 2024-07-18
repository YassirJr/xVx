<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="box-type-edit"
      delete-permission="box-type-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'box-type-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :box-type="boxType" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { useDialog, useQuery } from '@/helpers'
import { ref, computed } from 'vue'
import { dayjs, t } from '@/plugins'
import { useBoxTypeStore } from '@/stores/boxType'
import CreateEdit from './components/CreateEdit'

const loading = ref(false)
const boxType = ref(null)
const boxTypeStore = useBoxTypeStore()

const vxtable = ref(null)

const columns = computed(() => [
  { field: 'code', title: t('code') },
  { field: 'label', title: t('label') },
  { field: 'tare_weight', title: t('tare-weight') },
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
      boxTypeStore.fetchBoxTypes(query).then(({ data, total }) => {
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

const addHandler = () => {
  boxType.value = {}
  openDialog()
}

const editHandler = (value) => {
  boxType.value = Object.assign({}, value)
  openDialog()
}
const deleteHandler = (boxType) => {
  loading.value = true
  boxTypeStore.removeBoxType(boxType.id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_box_type')
}
</script>
