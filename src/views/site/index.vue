<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :columns="columns"
      :ajax="ajax"
      edit-permission="site-edit"
      delete-permission="site-delete"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button
          v-can="'site-type-create'"
          site-type-edit
          type="primary"
          @click="$dialog.open('create_edit_site_types')"
        >
          <i-el-list class="mr-2" />
          {{ $t('site-types') }}
        </el-button>
        <el-button v-can="'site-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-site') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <site-types></site-types>
  <create-edit :site="site" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import SiteTypes from '@/views/site/components/SiteTypes'
import CreateEdit from '@/views/site/components/CreateEdit'
import { ref, computed, onMounted } from 'vue'
import { useDialog, useQuery, InputFilter, SelectFilter } from '@/helpers/index'
import { t, dayjs } from '@/plugins'
import { useSiteStore } from '@/stores/site'
import { useVarietyStore } from '@/stores/variety'
import { useProductStore } from '@/stores/product'

const loading = ref(false)
const site = ref({})
const vxtable = ref(null)

const siteStore = useSiteStore()
const varietyStore = useVarietyStore()
const productStore = useProductStore()

onMounted(() => {
  varietyStore.fetchAllVarieties({ list: true })
  productStore.fetch({ list: true })
})

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      siteStore.fetchSites(query).then(({ data, total }) => {
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
  {
    field: 'code',
    title: t('code'),
  },
  {
    field: 'name',
    title: t('name'),
    ...InputFilter(),
  },
  {
    field: 'type.type',
    title: t('type'),
    ...SelectFilter({ filters: siteStore.types.map(({ type }) => ({ label: type, value: type })) ?? [] }),
  },
  {
    field: 'varieties',
    title: t('varieties'),
    className: '[&>*]:text-[0.8rem]',
    formatter: ({ cellValue }) => formatNames(cellValue),
  },
  { field: 'global_gap_number', title: 'GGN', visible: false },
  { field: 'green_gold_license', title: 'GGL/CoC', visible: false },
  {
    field: 'created_at',
    title: t('created-at'),
    sortable: true,
    formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
  },
  { title: t('actions'), width: 140, slots: { default: 'actions' } },
])

const addHandler = () => {
  site.value = {}
  openDialog()
}

const editHandler = (value) => {
  site.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  siteStore.removeSite(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_site')
}

function formatNames(cellValue) {
  return cellValue?.length ? cellValue.map(({ name }, index) => `${index ? ' ' : ''}${name}`) : null
}
</script>
