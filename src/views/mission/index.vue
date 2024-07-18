<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="mission-edit"
      delete-permission="mission-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'mission-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-mission') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create-edit :mission="mission" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { InputFilter, useDialog, useQuery } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { useMissionStore } from '@/stores/mission'
import { ref, computed } from 'vue'
import CreateEdit from './components/CreateEdit'

const loading = ref(false)
const mission = ref({})
const vxtable = ref(null)
const missionStore = useMissionStore()

const columns = computed(() => [
  { field: 'label', title: t('label'), ...InputFilter() },
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
      missionStore.fetchMissions(query).then(({ data, total }) => {
        resolve({ page: { total }, result: data })
      })
    })
  },
}))

const openDialog = () => {
  useDialog.open('create_edit_mission')
}

const addHandler = () => {
  mission.value = {}
  openDialog()
}

const editHandler = (value) => {
  mission.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  missionStore.removeMission(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}
</script>
