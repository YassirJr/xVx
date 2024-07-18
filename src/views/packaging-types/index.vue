<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="packhouse-unity-edit"
      delete-permission="packhouse-unity-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'packhouse-unity-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :packaging-type="packagingType" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { ref, computed } from 'vue'
import { dayjs, t } from '@/plugins'
import { useQuery, useDialog } from '@/helpers'
import { usePackagingTypesStore } from '@/stores/packagingTypes'

const loading = ref(false)
const packagingType = ref({})
const vxtable = ref(null)
const packagingTypesStore = usePackagingTypesStore()

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)
    return new Promise((resolve) => {
      packagingTypesStore.fetch(query).then(({ data, total }) => {
        resolve({ page: { total: total }, result: data })
      })
    })
  },
}))

const columns = computed(() => [
  { title: t('code'), field: 'code' },
  { title: t('label'), field: 'label' },
  { title: t('weight'), field: 'weight' },
  {
    title: t('created-at'),
    field: 'created_at',
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), field: 'actions', width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  packagingType.value = {}
  openDialog()
}

const editHandler = (packUnity) => {
  packagingType.value = packUnity
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = false
  packagingTypesStore.remove(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_packhouse_unity')
}
</script>
