<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table
      ref="vxtable"
      :key="columns.length"
      :columns="columns"
      :ajax="ajax"
      :hide-actions="hideActionsHandler"
      v-bind="{ pagerConfig }"
      edit-permission="payroll-section-edit"
      delete-permission="payroll-section-delete"
      @order-change="orderChanged"
      @edit="editHandler"
      @delete="deleteHandler"
    >
      <template #toolbar>
        <el-button v-can="'payroll-section-create'" plain type="primary" @click="addHandler()">
          <i-el-plus class="mr-2" />
          {{ $t('new-section') }}
        </el-button>
        <el-radio-group v-model="status" class="ml-2" @change="vxtable.refresh()">
          <el-radio-button v-for="(option, index) in isActiveOptions" :key="index" :label="option.value">
            <template #default>
              <div class="px-8">{{ $t(option.label) }}</div>
            </template>
          </el-radio-button>
        </el-radio-group>
      </template>
    </vx-table>
  </div>
  <create-edit :payroll-section="payrollSection" @reload="vxtable.refresh()"></create-edit>
</template>

<script setup>
import CreateEdit from './components/CreateEdit'
import { ElNotification } from 'element-plus'
import { ref, computed } from 'vue'
import { useQuery, isQFS, useDialog } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { usePayrollSectionStore } from '@/stores/payrollSection'

const loading = ref(false)
const payrollSection = ref({})
const vxtable = ref(null)
const isActiveOptions = ref([
  { value: true, label: 'active' },
  { value: false, label: 'inactive' },
])
const status = ref(true)

const payrollSectionStore = usePayrollSectionStore()

const ajax = computed(() => ({
  query: (params) => {
    params.filters.push({ property: 'is_active', values: [status.value] })

    const query = useQuery(params)

    return new Promise((resolve) => {
      payrollSectionStore.fetch(query).then((data) => {
        payrollSectionStore.fetch({ list: true })

        resolve({ page: { total: data.length }, result: data })
      })
    })
  },
}))

const columns = computed(() => {
  return [
    {
      className: 'drag-col',
      slots: { default: 'drag' },
      width: 50,
    },
    { field: 'code', title: t('code') },
    { field: 'label', title: t('label') },
    {
      field: 'section_type',
      title: t('section-type'),
      formatter: ({ cellValue }) => t(payrollSectionStore.getSectionType(cellValue)),
    },
    {
      field: 'mode',
      title: t('mode'),
      formatter: ({ cellValue }) => (cellValue ? t(payrollSectionStore.getMode(cellValue)) : cellValue),
    },
    {
      field: 'base',
      title: t('base'),
      visible: false,
      formatter: ({ cellValue, row }) => {
        if (cellValue?.label) {
          return cellValue.label
        } else if (row?.base_id) {
          return t(payrollSectionStore.getExtraValue(row.base_id))
        }
        return null
      },
    },
    { field: 'symbol', title: t('symbol'), visible: false },
    {
      field: 'rate',
      title: t('rate'),
      visible: false,
      formatter: ({ cellValue, row }) => {
        if (cellValue?.label) {
          return cellValue.label
        } else if (row?.rate_id) {
          return t(payrollSectionStore.getExtraValue(row.rate_id))
        }
        return null
      },
    },
    {
      field: 'nature',
      title: t('nature'),
      formatter: ({ cellValue }) => t(payrollSectionStore.getNature(cellValue)),
    },
    {
      field: 'main_payroll_sections',
      title: t('main-sections'),
      className: '[&>*]:text-[0.8rem]',
      formatter: ({ cellValue }) =>
        cellValue?.length ? cellValue.map(({ label }, index) => `${index ? ' ' : ''}${label}`) : null,
    },
    {
      field: 'cnss',
      title: t(isQFS ? 'css' : 'cnss'),
      formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
    },
    {
      field: 'income_tax',
      title: t('income-tax'),
      formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
    },
    {
      field: 'payroll_slip',
      title: t('payroll-slip'),
      formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
    },
    {
      field: 'payroll_book',
      title: t('payroll-book'),
      formatter: ({ cellValue }) => t(cellValue ? 'yes' : 'no'),
    },
    {
      field: 'created_at',
      title: t('created-at'),
      formatter: ({ cellValue }) => dayjs(cellValue).fromNow(),
    },
    {
      title: t('actions'),
      slots: { default: 'actions' },
    },
  ].filter((_, index) => index > (!status.value ? 0 : -1))
})

const pagerConfig = computed(() => {
  return {
    pageSize: -1,
    pageSizes: [{ label: t('all'), value: -1 }],
  }
})

const addHandler = () => {
  payrollSection.value = {}
  openDialog()
}

const editHandler = (value) => {
  payrollSection.value = Object.assign({}, value)
  openDialog()
}

const deleteHandler = ({ id }) => {
  loading.value = true
  payrollSectionStore.remove(id).finally(() => {
    vxtable.value.refresh()
    loading.value = false
  })
}

const openDialog = () => {
  useDialog.open('create_edit_payroll_section')
}

const orderChanged = ({ data }) => {
  if (status.value) {
    loading.value = true

    const list = data.map(({ id, order }) => ({ id, order }))

    payrollSectionStore.reorder(list).finally(() => {
      loading.value = false

      ElNotification.success({
        title: t('success'),
        message: t('changes-were-successfully-saved'),
        position: 'bottom-right',
        showClose: true,
        duration: 2000,
      })
    })
  }
}

const hideActionsHandler = computed(() => {
  return payrollSectionStore.payrollSections
    .filter(({ section_type }) => section_type === payrollSectionStore.sectionTypes[1].value)
    .map(({ id }) => id)
})
</script>
