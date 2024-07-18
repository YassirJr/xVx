<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="packhouse-line-edit"
      delete-permission="packhouse-line-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'packhouse-line-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
    </vx-table>
  </div>

  <create-edit :packhouse-line="packhouseLine" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { t } from '@/plugins'
import CreateEdit from './components/CreateEdit'
import { useDialog, useQuery, InputFilter, SelectFilter } from '@/helpers'
import { usePackhouseLineStore } from '@/stores/packhouseLine'
import { useSiteStore } from '@/stores/site'

const vxtable = ref(null)
const loading = ref(false)
const packhouseLine = ref({})

const packhouseLineStore = usePackhouseLineStore()
const siteStore = useSiteStore()

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)
    return new Promise((resolve) => {
      packhouseLineStore.fetch(query).then(({ data, meta }) => {
        resolve({
          page: {
            total: meta.total,
          },
          result: data,
        })
      })
    })
  },
}))

onMounted(() => {
  siteStore.fetchAllSites({ list: true })
  packhouseLineStore.fetch({ list: true })
})

const columns = computed(() => [
  { title: t('code'), field: 'code', ...InputFilter({ type: 'number' }) },
  {
    title: t('label'),
    field: 'label',
    ...InputFilter(),
  },
  {
    title: t('station'),
    field: 'site.name',
    ...SelectFilter({
      filters: siteStore.getStationSites.map(({ name }) => ({ label: name, value: name })) ?? [],
    }),
  },
  {
    title: t('status'),
    field: 'is_active',
    formatter: ({ cellValue }) => (cellValue ? t('active') : t('inactive')),
    ...SelectFilter({
      filters: packhouseLineStore.lineStatus.map((el) => ({ label: t(el.label), value: el.value })),
    }),
  },
  { title: t('actions'), field: 'actions', width: 200, slots: { default: 'actions' } },
])

const addHandler = () => {
  packhouseLine.value = {}
  openDialog()
}

const editHandler = (conf) => {
  packhouseLine.value = conf
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  packhouseLineStore.remove(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_packhouse_line')
}
</script>
