<template>
  <el-dialog
    draggable
    :title="$t(salesOrder?.id ? 'update-sales-order' : 'add-new-sales-order')"
    :model-value="useDialog.visible('create_edit_sales_order')"
    width="75%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_sales_order')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="grid grid-cols-12 gap-x-5">
          <div class="col-span-4">
            <el-form-item :label="$t('added-at')" prop="added_at">
              <el-date-picker
                v-model="form.added_at"
                class="!w-full"
                :format="DATE_FORMAT"
                @change="onDateChange()"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item :label="$t('invoice-nbr')" prop="invoice_nbr">
              <el-input
                v-model="form.invoice_nbr"
                v-maska:[invoiceNbrOptions]
                @change="formatInvoiceNumber"
              ></el-input>
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item :label="$t('station')" prop="site_id">
              <el-select-v2
                v-model="form.site_id"
                filterable
                :reserve-keyword="false"
                :options="siteStore.getStationSites.map(({ id, name }) => ({ id, label: name }))"
                value-key="id"
                class="w-full"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div :class="isInternational && isGanFruits ? 'col-span-3' : 'col-span-4'">
            <el-form-item :label="$t('client')" prop="client_id">
              <el-select-v2
                v-model="form.client_id"
                filterable
                :reserve-keyword="false"
                :options="clientStore.clients.map(({ id, name }) => ({ id, label: name }))"
                value-key="id"
                class="w-full"
                @change="onClientChange()"
              ></el-select-v2>
            </el-form-item>
          </div>
          <template v-if="form.client_id">
            <div v-if="isInternational && isGanFruits" class="col-span-3">
              <el-form-item :label="$t('company')" prop="company">
                <el-select-v2
                  v-model="form.company"
                  filterable
                  :reserve-keyword="false"
                  :options="ganFruitsCompanies"
                  value-key="id"
                  class="w-full"
                  @change="resetInputValues(['expedition_id', { key: 'final_products', value: [] }])"
                ></el-select-v2>
              </el-form-item>
            </div>
            <div v-if="!isInternational" class="col-span-4">
              <el-form-item :label="$t('delivery-note-nbr')" prop="delivery_nbr">
                <el-input v-model="form.delivery_nbr"></el-input>
              </el-form-item>
            </div>
            <div v-else :class="isGanFruits ? 'col-span-3' : 'col-span-4'">
              <el-form-item :label="$t('expedition')" prop="expedition_id">
                <el-select-v2
                  v-model="form.expedition_id"
                  :disabled="!form.company && isGanFruits"
                  filterable
                  :reserve-keyword="false"
                  :options="filteredExpeditions"
                  value-key="id"
                  class="w-full"
                  @change="onExpeditionCompanyChange()"
                ></el-select-v2>
              </el-form-item>
            </div>
            <div v-if="isInternational" :class="isGanFruits ? 'col-span-3' : 'col-span-4'">
              <el-form-item :label="$t('incoterm')">
                <el-select-v2
                  v-model="form.incoterm"
                  filterable
                  :reserve-keyword="false"
                  :options="
                    salesOrderStore.incoterms.map(({ label, value }) => ({ label: $t(label), value }))
                  "
                  class="w-full"
                ></el-select-v2>
              </el-form-item>
            </div>
          </template>
        </div>
        <el-divider class="!my-2"></el-divider>
        <div class="col-span-6 flex justify-end my-4">
          <el-button v-if="!isInternational && form.client_id" plain type="primary" @click="newProductRow()">
            <i-el-plus class="mr-2" />
            {{ $t('add') }}
          </el-button>
        </div>
        <vxe-table
          :key="form.final_products.length"
          ref="table"
          class="w-full"
          :data="form.final_products"
          :row-config="{ keyField: 'id' }"
          :row-class-name="isProductRowInvalid"
          :show-footer="form.final_products.length > 1"
          :footer-method="footerMethod"
          :footer-cell-class-name="'bg-gray-100 font-semibold'"
          border
          round
          max-height="350"
        >
          <vxe-column field="final_product_id" :title="$t('product')" :min-width="350">
            <template #default="{ rowIndex }">
              <el-select-v2
                v-if="!isInternational"
                v-model="form.final_products[rowIndex].final_product_id"
                filterable
                :reserve-keyword="false"
                :options="filteredProduct"
                value-key="id"
                class="w-full"
                @change="onProductChange(rowIndex)"
              ></el-select-v2>
              <span v-else>{{ form.final_products[rowIndex].final_product_name }}</span>
            </template>
          </vxe-column>
          <vxe-column field="unity" :title="$t('unity-measure')" :min-width="150">
            <template #default="{ rowIndex }">
              <span>{{ getUnityMeasure(rowIndex) ? $t(getUnityMeasure(rowIndex)) : null }}</span>
            </template>
          </vxe-column>
          <vxe-column field="sales_unit" :title="$t('sales-unit')" :min-width="150">
            <template #default="{ rowIndex }">
              <span>{{ getSalesUnit(rowIndex) }}</span>
            </template>
          </vxe-column>
          <vxe-column
            :visible="!isInternational"
            field="confection_id"
            :title="$t('pallet-code')"
            :min-width="200"
          >
            <template #default="{ rowIndex }">
              <el-select-v2
                v-model="form.final_products[rowIndex].confection_id"
                filterable
                clearable
                :reserve-keyword="false"
                :options="filteredConfections(rowIndex)"
                value-key="id"
                class="w-full"
                @change="onPalletChange(rowIndex)"
              ></el-select-v2>
            </template>
          </vxe-column>
          <vxe-column field="pallet_nbr" :title="$t('pallet-nbr')" :min-width="170">
            <template #default="{ rowIndex }">
              <el-input-number
                v-if="!isInternational"
                v-model="form.final_products[rowIndex].pallet_nbr"
                :disabled="Boolean(form.final_products[rowIndex].confection_id)"
                :min="0"
              ></el-input-number>
              <span v-else>{{ form.final_products[rowIndex].pallet_nbr }}</span>
            </template>
          </vxe-column>
          <vxe-column field="quantity" :title="$t('quantity')" :min-width="170">
            <template #default="{ rowIndex }">
              <el-input-number
                v-if="!isInternational"
                v-model="form.final_products[rowIndex].quantity"
                :disabled="Boolean(form.final_products[rowIndex].confection_id)"
                :min="0"
                @change="calcGrossWeight(rowIndex)"
              ></el-input-number>
              <span v-else>{{ form.final_products[rowIndex].quantity }}</span>
            </template>
          </vxe-column>
          <vxe-column field="nbr_unities" :title="$t('number-of-unities')" :min-width="120">
            <template #default="{ rowIndex }">
              <span>{{ getNbrUnities(rowIndex) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="gross_weight" :title="$t('gross-weight')" :min-width="170">
            <template #default="{ rowIndex }">
              <span v-if="!isInternational">
                <el-input-number
                  v-if="!isInternational"
                  v-model="form.final_products[rowIndex].gross_weight"
                  :disabled="Boolean(form.final_products[rowIndex].confection_id)"
                  :min="0"
                ></el-input-number>
              </span>
              <span v-else>{{ form.final_products[rowIndex].gross_weight }}</span>
            </template>
          </vxe-column>
          <vxe-column field="net_weight" :title="$t('net-weight')" :min-width="110">
            <template #default="{ rowIndex }">
              <span>{{ calcNetWeight(rowIndex) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="unit_price" :title="$t('unit-price')" :min-width="170">
            <template #default="{ rowIndex }">
              <el-input-number
                v-model="form.final_products[rowIndex].unit_price"
                :min="0"
                :precision="2"
                :step="0.1"
              ></el-input-number>
            </template>
          </vxe-column>
          <vxe-column field="discount " :title="$t('discount')" :min-width="170">
            <template #default="{ rowIndex }">
              <el-input-number
                v-model="form.final_products[rowIndex].discount"
                :min="0"
                :max="100"
              ></el-input-number>
            </template>
          </vxe-column>
          <vxe-column field="advance " :title="$t('advance')" :min-width="170">
            <template #default="{ rowIndex }">
              <el-input-number
                v-model="form.final_products[rowIndex].advance"
                :precision="2"
              ></el-input-number>
            </template>
          </vxe-column>
          <vxe-column field="transport_cost " :title="$t('transport')" :min-width="170">
            <template #default="{ rowIndex }">
              <el-input-number
                v-model="form.final_products[rowIndex].transport_cost"
                :precision="2"
              ></el-input-number>
            </template>
          </vxe-column>
          <vxe-column field="amount" :title="$t('amount')" :min-width="150">
            <template #default="{ rowIndex }">
              {{ calcTotal(rowIndex) }}
            </template>
          </vxe-column>
          <vxe-column
            v-if="!isInternational && form.final_products?.length > 1"
            field="actions"
            :title="$t('actions')"
            width="100"
            align="center"
            fixed="right"
          >
            <template #default="{ rowIndex }">
              <div class="flex items-center justify-center">
                <el-popconfirm :title="$t('are-you-sure-to-delete-this')" @confirm="deleteProduct(rowIndex)">
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
          :type="salesOrder?.id ? 'warning' : 'primary'"
          :loading="loading"
          :disabled="loading || isSaveDisabled"
          @click="save()"
        >
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="useDialog.close('create_edit_sales_order')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { DATE_FORMAT, GAN_FRUITS_COMPANIES_LIST } from '@/constants'
import { ref, computed, watch, reactive, nextTick } from 'vue'
import { t, dayjs } from '@/plugins'
import { useClientStore } from '@/stores/client'
import { useDialog, sum, isGanFruits } from '@/helpers'
import { useExpeditionStore } from '@/stores/expedition'
import { usePriceListStore } from '@/stores/priceList'
import { useProductStore } from '@/stores/product'
import { useSalesOrderStore } from '@/stores/salesOrder'
import { useSiteStore } from '@/stores/site'
import { useConfectionStore } from '@/stores/confection'

const clientStore = useClientStore()
const confectionStore = useConfectionStore()
const expeditionStore = useExpeditionStore()
const priceListStore = usePriceListStore()
const productStore = useProductStore()
const salesOrderStore = useSalesOrderStore()
const siteStore = useSiteStore()

const props = defineProps({
  salesOrder: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['reload'])

const initForm = {
  added_at: dayjs().format(),
  invoice_nbr: null,
  site_id: null,
  delivery_nbr: null,
  expedition_id: null,
  client_id: null,
  company: null,
  incoterm: null,
  final_products: [],
}
const initProductForm = {
  final_product_id: null,
  confection_id: null,
  quantity: 0,
  nbr_unities: 0,
  pallet_nbr: 0,
  gross_weight: 0,
  unit_price: 0,
  discount: 0,
  advance: 0,
  transport_cost: 0,
}

const loading = ref(false)
const formRef = ref(null)
const form = ref(initForm)
const table = ref(null)
const expedition = ref({})
const ganFruitsCompanies = GAN_FRUITS_COMPANIES_LIST

const invoiceNbrOptions = reactive({
  mask: `${dayjs().format('YYYY')}/####`,
})

const formatInvoiceNumber = () => {
  const [year, number] = form.value.invoice_nbr.split('/')

  form.value.invoice_nbr = `${year}/${number?.padStart(4, '0')}`

  return form.value.invoice_nbr
}

const rules = reactive({
  added_at: [
    {
      required: true,
      message: t('please-select-date'),
      trigger: 'blur',
    },
  ],
  invoice_nbr: [
    {
      required: true,
      message: t('please-input-invoice-nbr'),
      trigger: 'blur',
    },
  ],
  site_id: [
    {
      required: true,
      message: t('please-select-site'),
      trigger: 'blur',
    },
  ],
  client_id: [
    {
      required: true,
      message: t('please-select-client'),
      trigger: 'blur',
    },
  ],
  expedition_id: [
    {
      required: true,
      message: t('please-select-expedition'),
      trigger: 'blur',
    },
  ],
  company: [
    {
      required: true,
      message: t('please-select-expedition'),
      trigger: 'blur',
    },
  ],
  delivery_nbr: [
    {
      required: true,
      message: t('please-input-delivery-nbr'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.salesOrder,
  (newVal) => {
    if (newVal?.id) {
      const { final_products, expedition } = newVal

      nextTick()
      form.value = Object.assign(
        {},
        {
          ...newVal,
          company: expedition?.confections[0]?.company,
          final_products: final_products.map((el) => ({ ...el, final_product_name: el.name })),
        },
      )
    } else {
      form.value = Object.assign({}, { ...initForm, invoice_nbr: salesOrderStore.getLatestinvoice })
    }
  },
)

const newProductRow = () => {
  form.value.final_products.unshift(Object.assign({}, initProductForm))
}

const isInternational = computed(() => {
  return clientStore.clients.find(({ id }) => id == form.value.client_id)?.is_international
})

const filteredProduct = computed(() => {
  return productStore.products
    .filter(({ destination }) => destination == productStore.destinations[2].value)
    .map(({ id, name }) => ({ id, label: name }))
})

const filteredExpeditions = computed(() => {
  return expeditionStore.expeditions
    .filter(({ client_id, confections }) => {
      return (
        client_id == form.value.client_id &&
        (isGanFruits ? confections[0].company == form.value.company : true)
      )
    })
    .map(({ id, code }) => ({ id, label: code }))
})

const filteredConfections = (rowIndex) => {
  return confectionStore.confections
    .filter(({ final_product_id, status }) => {
      return (
        final_product_id == form.value.final_products[rowIndex].final_product_id &&
        status == confectionStore.statusOptions[0].value
      )
    })
    .map(({ id, pallet_code, pallet_code_suffix }) => ({ id, label: `${pallet_code}-${pallet_code_suffix}` }))
}

const onProductChange = (index) => {
  const { final_products } = form.value

  Object.assign(final_products[index], {
    ...initProductForm,
    final_product_id: final_products[index].final_product_id,
  })
}

const getPriceList = (product_id, client_id, added_at) => {
  const product = priceListStore.priceLists
    .flatMap((el) => el.final_products.map((item) => ({ ...el, ...item })))
    .find(
      ({ id, client_id: client, start_date, end_date }) =>
        id === product_id &&
        client == client_id &&
        dayjs(added_at).isBetween(start_date, end_date, 'day', '[]'),
    )

  return { unit_price: product?.unit_price ?? 0, discount: product?.discount ?? 0 }
}

const getProduct = (product_id) => {
  return productStore.products.find(({ id }) => id == product_id)
}

const getUnityMeasure = (rowIndex) => {
  const { final_product_id } = form.value.final_products[rowIndex]

  return getProduct(final_product_id)?.unity_measure ?? null
}

const calcGrossWeight = (index) => {
  const { quantity, final_product_id } = form.value.final_products[index]
  const gross_weight = getProduct(final_product_id)?.commercial_weight * quantity ?? 0

  form.value.final_products[index].gross_weight = gross_weight ? +gross_weight.toFixed(2) : 0

  updateFooter()
}

const calcNetWeight = (index) => {
  const product = form.value.final_products[index]

  if (product.quantity && getProduct(product.final_product_id)) {
    product.net_weight = getProduct(product.final_product_id).net_weight * product.quantity
  } else {
    product.net_weight = 0
  }
  updateFooter()

  return product.net_weight.toFixed(2)
}

const calcTotal = (index) => {
  let value = 0
  const { unit_price, net_weight, quantity, nbr_unities, discount, advance, transport_cost } =
    form.value.final_products[index]
  const sales_unit = getProduct(form.value?.final_products[index]?.final_product_id)?.sales_unit

  switch (sales_unit) {
    case 0:
      value = quantity
      break
    case 1:
      value = nbr_unities
      break
    case 2:
      value = net_weight
      break
  }

  const total = value * unit_price * (1 - discount / 100) + advance + transport_cost ?? 0

  form.value.final_products[index].total = +total.toFixed(2)
  updateFooter()

  return total.toFixed(2)
}

const onClientChange = () => {
  const product = Object.assign({}, initProductForm)

  resetInputValues([
    'delivery_nbr',
    'company',
    'expedition_id',
    { key: 'final_products', value: !isInternational.value ? [product] : [] },
  ])
}

const onExpeditionCompanyChange = () => {
  resetInputValues([{ key: 'final_products', value: [] }])

  expedition.value = expeditionStore.expeditions.find(({ id }) => id == form.value.expedition_id)

  const groupedConfections = expedition.value?.confections.reduce((product, confection) => {
    const id = confection.final_product.id
    if (!product[id]) {
      product[id] = []
    }
    product[id].push(confection)

    return product
  }, [])

  const { client_id, added_at } = form.value

  groupedConfections?.map((el, index) => {
    const priceList = getPriceList(el[0].final_product.id, client_id, added_at)
    const product = {
      ...initProductForm,
      id: index,
      final_product_id: el[0].final_product.id,
      final_product_name: el[0].final_product.name,
      pallet_nbr: [...new Set(el.map(({ pallet_code }) => pallet_code))].length,
      quantity: sum(el.map(({ nbr_boxes }) => nbr_boxes)),
      gross_weight: sum(el.map(({ gross_weight }) => gross_weight)),
      unit_price: priceList?.unit_price,
      discount: priceList?.discount,
    }

    form.value.final_products.unshift(product)
  })

  updateFooter()
}

const onPalletChange = (index) => {
  const row = form.value.final_products[index]
  const palletConfection = confectionStore.confections.find(({ id }) => id == row.confection_id)

  Object.assign(form.value.final_products[index], {
    ...row,
    pallet_nbr: 1,
    quantity: palletConfection?.nbr_boxes ?? 0,
    gross_weight: palletConfection?.gross_weight ?? 0,
  })

  updateFooter()
}

const onDateChange = () => {
  form.value = Object.assign({}, { ...form.value, expedition_id: null, client_id: null, final_products: [] })
}

const isProductRowInvalid = ({ rowIndex }) => {
  const {
    final_product_id,
    pallet_nbr,
    quantity,
    gross_weight,
    unit_price,
    discount,
    advance,
    transport_cost,
    confection_id,
  } = form.value.final_products[rowIndex]
  const productIds = form.value.final_products.filter((el) => {
    return (
      JSON.stringify(`${final_product_id}-${confection_id}`) ===
      JSON.stringify(`${el.final_product_id}-${el.confection_id}`)
    )
  })

  const isInvalid =
    !final_product_id ||
    !pallet_nbr ||
    !quantity ||
    typeof gross_weight != 'number' ||
    typeof unit_price != 'number' ||
    typeof discount != 'number' ||
    typeof advance != 'number' ||
    typeof transport_cost != 'number' ||
    productIds.length > 1

  form.value.final_products[rowIndex].is_valid = !isInvalid

  return isInvalid ? 'bg-red-50' : null
}

const isSaveDisabled = computed(() => {
  const products = form.value.final_products

  return !products.length || products.filter(({ is_valid }) => !is_valid).length > 0
})

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      if (form.value?.id) {
        salesOrderStore
          .update(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        salesOrderStore
          .create(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_sales_order')

  loading.value = false
  form.value = Object.assign({}, initForm)

  emit('reload')
}

const deleteProduct = (index) => {
  form.value.final_products.splice(index, 1)
}

const footerMethod = ({ columns, data }) => [
  columns.map((column) => {
    switch (column.field) {
      case 'final_product_id':
        return t('total')
      case 'pallet_nbr':
        return sum(data.map(({ pallet_nbr }) => pallet_nbr))
      case 'quantity':
        return sum(data.map(({ quantity }) => quantity))
      case 'gross_weight':
        return sum(data.map(({ gross_weight }) => +gross_weight)).toFixed(2)
      case 'net_weight':
        return sum(data.map(({ net_weight }) => net_weight)).toFixed(2)
      case 'amount':
        return sum(data.map(({ total }) => total)).toFixed(2)
      default:
        return ''
    }
  }),
]

const updateFooter = () => {
  if (table.value) {
    const timeout = setTimeout(() => {
      table.value.updateFooter()

      clearTimeout(timeout)
    }, 100)
  }
}

const resetInputValues = (items) => {
  items.forEach((item) => {
    const key = item?.key ? item.key : item
    const value = item?.value ? item.value : null

    form.value[key] = value
  })
}

const getNbrUnities = (index) => {
  const { quantity, final_product_id, confection_id } = form.value.final_products[index]
  let nbrUnities = 0

  if (isInternational.value) {
    const expedition = expeditionStore.expeditions.find(({ id }) => id == form.value.expedition_id)
    const palletConfection =
      expedition?.confections.filter((el) =>
        confection_id ? el.id == confection_id : el.final_product_id == final_product_id,
      ) ?? []

    nbrUnities = sum(palletConfection.map(({ nbr_unities }) => nbr_unities))
  } else if (confection_id) {
    const palletConfection = confectionStore.confections.find(({ id }) => id == confection_id)

    nbrUnities = palletConfection?.nbr_unities ?? 0
  } else {
    const productNbrUnities = productStore.products.find(({ id }) => id == final_product_id)?.nbr_unities ?? 0
    nbrUnities = productNbrUnities * quantity
  }

  form.value.final_products[index].nbr_unities = nbrUnities

  return nbrUnities
}

const getSalesUnit = (index) => {
  const product = getProduct(form.value?.final_products[index]?.final_product_id)
  const salesUnit = productStore.salesUnit.find(({ value }) => value == product?.sales_unit)?.label

  return salesUnit ? t(salesUnit) : null
}
</script>
