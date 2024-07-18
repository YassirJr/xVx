<template>
  <el-dialog
    draggable
    :title="$t(purchaseOffer?.id ? 'update-purchase-offer' : 'add-new-purchase-offer')"
    :model-value="useDialog.visible('create_edit_purchase_offer')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="90%"
    @close="useDialog.close('create_edit_purchase_offer')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="grid grid-cols-4 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('request-nbr')" prop="request_nbr">
              <el-input v-model="form.request_nbr"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('added-at')" prop="added_at">
              <el-date-picker v-model="form.added_at" class="!w-full" :format="DATE_FORMAT"></el-date-picker>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('nature')" prop="is_nature">
              <el-radio-group v-model="form.is_nature" class="!w-full" @change="onNatureChange()">
                <el-radio-button
                  v-for="(nature, i) in purchaseOfferStore.natures"
                  :key="i"
                  class="!w-1/2"
                  :label="nature.value"
                >
                  <template #default>
                    {{ t(nature.label) }}
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('priority')" prop="priority">
              <el-select v-model="form.priority" clearable filterable class="w-full">
                <el-option
                  v-for="(priority, i) in purchaseOfferStore.priorities"
                  :key="i"
                  :label="$t(priority.label)"
                  :value="priority.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('department')" prop="department_id">
              <el-select
                v-model="form.department_id"
                clearable
                filterable
                class="w-full"
                @change="onDepartmentChange()"
              >
                <el-option
                  v-for="(el, i) in departmentStore.departments"
                  :key="i"
                  :label="el.label"
                  :value="el.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('applicant')" prop="applied_by">
              <el-select v-model="form.applied_by" clearable filterable class="w-full">
                <el-option
                  v-for="(el, i) in filteredPurchaseUsers"
                  :key="i"
                  :label="el.user.username"
                  :value="el.user_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('desired-delivery-date')" prop="desired_delivery_at">
              <el-date-picker
                v-model="form.desired_delivery_at"
                class="!w-full"
                :format="DATE_FORMAT"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('delivery-location')" prop="warehouse_id">
              <el-select v-model="form.warehouse_id" clearable filterable class="w-full">
                <el-option
                  v-for="warehouse in warehouseStore.warehouses"
                  :key="warehouse.id"
                  :label="warehouse.label"
                  :value="warehouse.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-4 ml-auto">
            <el-button plain type="primary" :loading="loading" @click="addNewRow()">
              <i-el-plus class="mr-2" />
              {{ $t('add') }}
            </el-button>
          </div>
          <el-divider class="col-span-4" />
          <div class="col-span-4">
            <vxe-table
              ref="xTable"
              class="w-full"
              :data="form.items"
              :loading="tableLoading"
              :show-footer="isFooterVisible"
              :row-config="{ keyField: 'id' }"
              :footer-method="footerMethod"
              :footer-cell-class-name="'font-bold bg-slate-50'"
              border
              round
              max-height="450"
            >
              <vxe-column field="item_id" :title="$t('item')" min-width="170" :class-name="rowClassName">
                <template #default="{ rowIndex }">
                  <el-select-v2
                    v-model="form.items[rowIndex].item_id"
                    filterable
                    :options="items"
                    value-key="id"
                    class="w-full"
                    @change="onItemChange(rowIndex)"
                  ></el-select-v2>
                </template>
              </vxe-column>
              <vxe-column field="family_id" :title="$t('family')" min-width="170" :class-name="rowClassName">
                <template #default="{ rowIndex }">
                  {{ form.items[rowIndex].family }}
                </template>
              </vxe-column>
              <vxe-column
                field="sub_family_id"
                :title="$t('sub-family')"
                min-width="170"
                :class-name="rowClassName"
              >
                <template #default="{ rowIndex }">
                  {{ form.items[rowIndex].sub_family }}
                </template>
              </vxe-column>
              <vxe-column field="unit_id" :title="$t('unit')" min-width="170" :class-name="rowClassName">
                <template #default="{ rowIndex }">
                  {{ form.items[rowIndex].unit && $t(form.items[rowIndex].unit) }}
                </template>
              </vxe-column>
              <vxe-column
                field="quantity"
                :title="$t('quantity-requested')"
                min-width="170"
                :class-name="rowClassName"
              >
                <template #default="{ rowIndex }">
                  <el-input-number
                    v-model="form.items[rowIndex].quantity"
                    class="!w-full"
                    :min="0"
                    @change="calculateAmount(rowIndex)"
                  ></el-input-number>
                </template>
              </vxe-column>
              <vxe-column
                field="unit_cost"
                :title="$t('estimated-unit-cost')"
                min-width="170"
                :class-name="rowClassName"
              >
                <template #default="{ rowIndex }">
                  <el-input-number
                    v-model="form.items[rowIndex].unit_cost"
                    class="!w-full"
                    :min="0"
                    @change="calculateAmount(rowIndex)"
                  ></el-input-number>
                </template>
              </vxe-column>
              <vxe-column field="amount" :title="$t('amount')" min-width="170" :class-name="rowClassName">
                <template #default="{ rowIndex }">
                  {{ form.items[rowIndex].amount }}
                </template>
              </vxe-column>
              <vxe-column field="file" :title="$t('import')" min-width="230" :class-name="rowClassName">
                <template #default="{ rowIndex }">
                  <upload-file
                    ref="uploadRef"
                    :is-uploaded-file="!form.items[rowIndex].media_uuid"
                    @on-file-uploaded="(e) => onFileUploaded(e, rowIndex)"
                    @on-file-deleted="onFileDeleted(rowIndex)"
                  />
                </template>
              </vxe-column>
              <vxe-column field="note" :title="$t('note')" min-width="280" :class-name="rowClassName">
                <template #default="{ rowIndex }">
                  <el-input v-model="form.items[rowIndex].note" class="!w-full"></el-input>
                </template>
              </vxe-column>
              <vxe-column
                field="actions"
                :title="$t('actions')"
                :class-name="rowClassName"
                width="100"
                align="center"
                fixed="right"
              >
                <template #default="{ rowIndex }">
                  <div class="flex items-center justify-center">
                    <el-popconfirm
                      v-if="form.items.length > 1"
                      :title="$t('are-you-sure-to-delete-this')"
                      @confirm="deleteRow(rowIndex)"
                    >
                      <template #reference>
                        <div class="ml-1">
                          <el-tooltip :content="$t('delete')">
                            <el-button plain type="danger" size="small">
                              <i-el-delete />
                            </el-button>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-popconfirm>
                  </div>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="purchaseOffer?.id ? 'warning' : 'primary'"
          :loading="loading"
          :disabled="isSaveDisabled"
          @click="save()"
        >
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="useDialog.close('create_edit_purchase_offer')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch, computed, onMounted } from 'vue'
import { useDialog, sum } from '@/helpers'
import { DATE_FORMAT } from '@/constants'
import { dayjs, t } from '@/plugins'
import { usePurchaseOfferStore } from '@/stores/purchaseOffer'
import { usePurchaseUserStore } from '@/stores/purchaseUser'
import { useWarehouseStore } from '@/stores/warehouse'
import { useDepartmentStore } from '@/stores/department'
import { useItemStore } from '@/stores/item'

const purchaseOfferStore = usePurchaseOfferStore()
const purchaseUserStore = usePurchaseUserStore()
const warehouseStore = useWarehouseStore()
const itemStore = useItemStore()
const departmentStore = useDepartmentStore()

const props = defineProps({
  purchaseOffer: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['reload'])

const initForm = reactive({
  request_nbr: null,
  is_nature: 1,
  priority: null,
  applied_by: null,
  warehouse_id: null,
  department_id: null,
  added_at: dayjs().format(),
  desired_delivery_at: null,
  items: [],
})

const formRef = ref()
const form = ref(initForm)
const loading = ref(false)
const tableLoading = ref(false)
const uploadRef = ref()
const xTable = ref()

const rules = reactive({
  request_nbr: [
    {
      required: true,
      message: t('please-input-request-nbr'),
      trigger: 'blur',
    },
  ],
  added_at: [
    {
      required: true,
      message: t('please-select-date'),
      trigger: 'blur',
    },
  ],
  is_nature: [
    {
      required: true,
      message: t('please-select-nature'),
      trigger: 'blur',
    },
  ],
  priority: [
    {
      required: true,
      message: t('please-select-priority'),
      trigger: 'blur',
    },
  ],
  applied_by: [
    {
      required: true,
      message: t('please-select-applicant'),
      trigger: 'blur',
    },
  ],
  desired_delivery_at: [
    {
      required: true,
      message: t('please-select-desired-delivery-date'),
      trigger: 'blur',
    },
  ],
  warehouse_id: [
    {
      required: true,
      message: t('please-select-warehouse'),
      trigger: 'blur',
    },
  ],
})

const filteredPurchaseUsers = computed(() =>
  purchaseUserStore.purchaseUsers.filter(
    ({ nature, departments }) =>
      (nature === purchaseUserStore.natures[0].value ||
        nature === purchaseOfferStore.natures.find(({ value }) => value == form.value.is_nature).label) &&
      (!form.value.department_id || departments.some(({ id }) => id == form.value.department_id)),
  ),
)

const isFooterVisible = computed(() => form.value.items.length > 1)

const isItemsInvalid = computed(
  () => !form.value.items.length || form.value.items.some((row) => isRowInvalid(row)),
)

const isSaveDisabled = computed(() => isItemsInvalid.value || loading.value)

const items = computed(() => itemStore.items.map((el) => ({ ...el, label: `${el.id}-${el.label}` })))

onMounted(() => {
  departmentStore.fetchDepartments({ list: true })
})

watch(
  () => props.purchaseOffer,
  (newVal) => {
    if (newVal?.id) {
      let {
        id,
        request_nbr,
        is_nature,
        priority,
        applied_by,
        warehouse_id,
        department_id,
        added_at,
        desired_delivery_at,
      } = newVal

      let items = newVal.purchase_items.map((el) => ({
        amount: el.amount,
        family: el.item.subfamily_item.family_item.label,
        sub_family: el.item.subfamily_item.label,
        item_id: el.item.id,
        label: `${el.item.id}-${el.item.label}`,
        note: el.note,
        quantity: el.quantity,
        status: el.status,
        unit: el.item.unit,
        unit_cost: el.unit_cost,
        id: `${form.value.items.length}-${Math.random()}`,
        media_uuid: el.media_uuid,
      }))

      form.value = Object.assign(
        {},
        {
          id,
          request_nbr,
          is_nature: +is_nature,
          priority,
          applied_by,
          warehouse_id,
          department_id,
          added_at,
          desired_delivery_at,
          items: items,
        },
      )
    } else {
      form.value = Object.assign(
        {},
        JSON.parse(
          JSON.stringify({ ...initForm, request_nbr: purchaseOfferStore.latestPurchaseOffer.toString() }),
        ),
      )
      addNewRow()
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const { added_at, desired_delivery_at } = form.value
      form.value = Object.assign(
        {},
        {
          ...form.value,
          added_at: dayjs(added_at).format(),
          desired_delivery_at: dayjs(desired_delivery_at).format(),
        },
      )

      loading.value = true

      if (form.value?.id) {
        purchaseOfferStore
          .updatePurchaseOffer(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        purchaseOfferStore
          .newPurchaseOffer(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_purchase_offer')
  loading.value = false
  form.value = Object.assign({}, JSON.parse(JSON.stringify(initForm)))
  emit('reload')
}

const addNewRow = () => {
  tableLoading.value = true

  const newItem = {
    id: `${form.value.items.length}-${Math.random()}`,
    item_id: null,
    quantity: 0,
    unit_cost: 0,
    amount: null,
    note: null,
    status: 'open',
  }

  form.value.items.push(newItem)

  reloadTable()
}

const deleteRow = (index) => {
  tableLoading.value = true

  form.value.items.splice(index, 1)

  reloadTable()
}

const reloadTable = () => {
  setTimeout(() => {
    xTable.value.loadData(form.value.items)
    tableLoading.value = false
  }, 100)
}

const rowClassName = ({ row }) => (isRowInvalid(row) ? 'bg-red-50' : null)

const isRowInvalid = ({ item_id, quantity, unit_cost }) =>
  !item_id ||
  !quantity ||
  unit_cost === null ||
  form.value.items.filter((el) => el.item_id == item_id).length > 1

const footerMethod = ({ columns }) => [
  columns.map((column) => {
    switch (column.field) {
      case 'item_id':
        return t('total')
      case 'amount':
        return sum(form.value.items.map(({ amount }) => +amount)).toFixed(2)
      case 'quantity':
        return sum(form.value.items.map(({ quantity }) => +quantity)).toFixed(2)
      case 'unit_cost':
        return sum(form.value.items.map(({ unit_cost }) => +unit_cost)).toFixed(2)
      default:
        return ''
    }
  }),
]

const onItemChange = (index) => {
  const item_id = form.value.items[index].item_id
  const item = itemStore.items.find((el) => el.id == item_id)

  Object.assign(form.value.items[index], {
    item_id: item.id,
    family: item.subfamily_item?.family_item.label,
    sub_family: item.subfamily_item?.label,
    unit: item.unit,
    unit_cost: item.unit_cost,
  })

  calculateAmount(index)
}

const calculateAmount = (index) => {
  const { quantity, unit_cost } = form.value?.items[index] || {}
  form.value.items[index].amount = (+quantity * +unit_cost).toFixed(2)
  reloadTable()
}

const onNatureChange = () => {
  form.value.applied_by = null
  form.value.department_id = null
}

const onDepartmentChange = () => (form.value.applied_by = null)

const onFileUploaded = (file, index) => (form.value.items[index].file = file)

const onFileDeleted = (index) => delete form.value.items[index].media_uuid
</script>
