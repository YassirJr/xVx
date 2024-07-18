<template>
  <el-dialog
    draggable
    :title="$t(priceList?.id ? 'update-price-list' : 'add-new-price-list')"
    :model-value="useDialog.visible('create_edit_price_list')"
    width="75%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_price_list')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="grid grid-cols-6 gap-x-5">
          <div class="col-span-2">
            <el-form-item :label="$t('type')" prop="type">
              <el-radio-group v-model="form.sell_purchase" class="!w-full">
                <el-radio-button
                  v-for="(priceType, i) in priceListStore.priceTypes"
                  :key="i"
                  class="!w-1/2"
                  :label="priceType.value"
                  @change="onPriceListChange()"
                >
                  <template #default>
                    {{ $t(priceType.label) }}
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item v-if="form.sell_purchase" :label="$t('supplier')" prop="supplier_id">
              <el-select-v2
                v-model="form.supplier_id"
                :options="supplierStore.suppliers.map((el) => ({ ...el, label: `${el.code}-${el.name}` }))"
                value-key="id"
                filterable
                :reserve-keyword="false"
                class="!w-full"
              ></el-select-v2>
            </el-form-item>
            <el-form-item v-else :label="$t('client')" prop="client_id">
              <el-select-v2
                v-model="form.client_id"
                :options="clientStore.clients.map((el) => ({ ...el, label: `${el.code}-${el.name}` }))"
                value-key="id"
                filterable
                :reserve-keyword="false"
                class="!w-full"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('period')" prop="daterange">
              <el-date-picker
                v-model="form.daterange"
                type="daterange"
                unlink-panels
                clearable
                :range-separator="$t('to')"
                :start-placeholder="$t('start-date')"
                :end-placeholder="$t('end-date')"
              />
            </el-form-item>
          </div>
        </div>
        <el-divider />
        <vxe-table
          ref="table"
          class="w-full"
          :data="form?.products"
          :loading="tableLoading"
          :row-config="{ keyField: 'id' }"
          border
          round
          max-height="450"
        >
          <vxe-column
            v-if="form.sell_purchase"
            field="item_id"
            :title="$t('item')"
            :min-width="200"
            :class-name="rowClassName"
          >
            <template #default="{ rowIndex }">
              <el-select-v2
                v-model="form.products[rowIndex].item_id"
                :options="itemStore.items.map((el) => ({ ...el, label: `${el.code}-${el.label}` }))"
                value-key="id"
                filterable
                :reserve-keyword="false"
                class="!w-full"
              ></el-select-v2>
            </template>
          </vxe-column>
          <vxe-column
            v-else
            field="final_product_id"
            :title="$t('product')"
            :min-width="200"
            :class-name="rowClassName"
          >
            <template #default="{ rowIndex }">
              <el-select-v2
                v-model="form.products[rowIndex].final_product_id"
                :options="productStore.products.map((el) => ({ ...el, label: `${el.code}-${el.name}` }))"
                value-key="id"
                filterable
                :reserve-keyword="false"
                class="!w-full"
              ></el-select-v2>
            </template>
          </vxe-column>
          <vxe-column
            field="unit_price"
            :title="$t('unit-price')"
            :min-width="200"
            :class-name="rowClassName"
          >
            <template #default="{ rowIndex }">
              <el-input-number
                v-model="form.products[rowIndex].unit_price"
                class="!w-full"
                :min="0"
                :precision="2"
              />
            </template>
          </vxe-column>
          <vxe-column field="discount" :title="$t('discount')" :min-width="200" :class-name="rowClassName">
            <template #default="{ rowIndex }">
              <el-input-number v-model="form.products[rowIndex].discount" class="!w-full" :min="0" />
            </template>
          </vxe-column>
          <vxe-column
            field="actions"
            :title="$t('actions')"
            width="100"
            align="center"
            fixed="right"
            :class-name="rowClassName"
          >
            <template #default="{ rowIndex }">
              <div class="flex items-center justify-center">
                <el-tooltip :content="$t('duplicate')">
                  <el-button plain type="info" size="small" @click="duplicateProduct(rowIndex)">
                    <i-el-document-copy />
                  </el-button>
                </el-tooltip>
                <el-popconfirm
                  v-if="form?.products.length > 1"
                  :title="$t('are-you-sure-to-delete-this')"
                  @confirm="deleteProduct(rowIndex)"
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
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="priceList?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_price_list')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { t, dayjs } from '@/plugins'
import { useDialog } from '@/helpers'
import { usePriceListStore } from '@/stores/priceList'
import { useSupplierStore } from '@/stores/supplier'
import { useClientStore } from '@/stores/client'
import { useItemStore } from '@/stores/item'
import { useProductStore } from '@/stores/product'

const props = defineProps({
  priceList: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['reload'])

const initForm = reactive({
  sell_purchase: 0,
  supplier_id: null,
  client_id: null,
  daterange: [],
  products: [{ unit_price: null, discount: null, item_id: null, final_product_id: null }],
})

const loading = ref(false)
const tableLoading = ref(false)
const formRef = ref(null)
const form = ref({ ...initForm })
const table = ref(null)

const productStore = useProductStore()
const priceListStore = usePriceListStore()
const supplierStore = useSupplierStore()
const clientStore = useClientStore()
const itemStore = useItemStore()

const rules = reactive({
  client_id: [{ required: true, message: t('please-select-client'), trigger: 'blur' }],
  supplier_id: [{ required: true, message: t('please-select-supplier'), trigger: 'blur' }],
  daterange: [{ required: true, message: t('please-select-period'), trigger: 'blur' }],
})

watch(
  () => props.priceList,
  (newVal) => {
    if (newVal?.id) {
      const { id, start_date, end_date, final_products, items, sell_purchase, client_id, supplier_id } =
        newVal
      const daterange = [start_date, end_date]

      Object.assign(form.value, {
        id,
        sell_purchase,
        client_id,
        supplier_id,
        daterange,
        products: sell_purchase
          ? items.map((el) => ({ ...el, item_id: el.id }))
          : final_products.map((el) => ({ ...el, final_product_id: el.id })),
      })
    } else {
      form.value = Object.assign({}, JSON.parse(JSON.stringify(initForm)))
    }
  },
)

const filteredForm = () => {
  return Object.entries(form.value)
    .filter(([key, value]) => value != null && key !== 'daterange')
    .reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {})
}

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      const { daterange } = form.value
      Object.assign(form.value, {
        ...form.value,
        start_date: dayjs(daterange[0]).format(),
        end_date: dayjs(daterange[1]).format(),
        products: form.value.products.map((product) => {
          const { discount, unit_price } = product
          return form.value.sell_purchase
            ? { discount, unit_price, item_id: product.item_id }
            : { discount, unit_price, final_product_id: product.final_product_id }
        }),
      })
      if (form.value?.id) {
        priceListStore
          .update(filteredForm())
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        priceListStore
          .create(filteredForm())
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_price_list')
  loading.value = false
  Object.assign(form.value, JSON.parse(JSON.stringify(initForm)))
  emit('reload')
}

const onPriceListChange = () => {
  Object.assign(form.value, {
    daterange: form.value.daterange,
    client_id: null,
    supplier_id: null,
    products: [{ unit_price: null, discount: null, item_id: null, final_product_id: null }],
  })
}

const reloadTable = () => {
  setTimeout(() => {
    table.value.loadData(form.value?.products)
    tableLoading.value = false
  }, 250)
}

const duplicateProduct = (index) => {
  const product = Object.assign({}, { ...form.value.products[index] })
  product.id = Math.random()
  tableLoading.value = true
  form.value.products.push(product)
  reloadTable()
}

const deleteProduct = (index) => {
  form.value.products.splice(index, 1)
  reloadTable()
}

const isRowInvalid = (row) => {
  const { final_product_id, item_id, discount, unit_price } = row
  let isValide = null

  if (item_id) {
    isValide = Boolean(!item_id || form.value?.products?.filter((el) => el.item_id == item_id).length > 1)
  } else {
    isValide = Boolean(
      !final_product_id ||
        form.value?.products?.filter((el) => el.final_product_id == final_product_id).length > 1,
    )
  }

  return !unit_price || isValide || typeof discount != 'number'
}

const rowClassName = ({ row }) => {
  return isRowInvalid(row) ? 'bg-red-50' : null
}

const isSaveDisabled = computed(() => {
  const { daterange, products } = form.value

  return loading.value || !daterange || !products?.length || products.some((row) => isRowInvalid(row))
})
</script>
