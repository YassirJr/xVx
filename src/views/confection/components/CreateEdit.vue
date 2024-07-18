<template>
  <el-dialog
    draggable
    :title="getDialogTitle"
    :model-value="useDialog.visible('create_edit_confection')"
    top="5vh"
    width="90%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_confection')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div :class="`grid gap-x-5 ${isGanFruits ? 'grid-cols-4' : 'grid-cols-3'}`">
          <div class="col-span-1">
            <el-form-item :label="$t('added-at')" prop="added_at" validate-status="error">
              <el-date-picker
                v-model="form.added_at"
                class="!w-full"
                :format="DATE_FORMAT"
                :disabled-date="isDisabledDate"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div v-if="isGanFruits" class="col-span-1">
            <el-form-item :label="$t('company')" prop="company">
              <el-select-v2
                v-model="form.company"
                filterable
                :reserve-keyword="false"
                :options="ganFruitsCompanies"
                value-key="id"
                class="w-full"
                :disabled="isFieldDisabled"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('station')" prop="site_id">
              <el-select-v2
                v-model="form.site_id"
                filterable
                :reserve-keyword="false"
                :options="siteStore.getStationSites.map((el) => ({ ...el, label: el.name }))"
                value-key="id"
                class="w-full"
                :disabled="isFieldDisabled"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('tracking-nbr')" prop="tracking_nbr">
              <el-input
                v-model="form.tracking_nbr"
                v-maska:[trackingNbrMask]
                :disabled="isFieldDisabled"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <el-divider />
        <div v-if="!confection?.id && !confection?.pallet_code" class="flex justify-end mb-4">
          <el-button plain type="primary" :loading="loading" @click="initInstalmentRow()">
            <i-el-plus class="mr-2" />
            {{ $t('add') }}
          </el-button>
        </div>
        <vxe-table
          ref="xTable"
          :max-height="windowHeight"
          class="w-full"
          border
          round
          show-header-overflow
          resizable
          :data="form.installments"
          :loading="tableLoading"
          :show-footer="form.installments?.length > 1"
          :row-config="{ keyField: 'id' }"
          :row-class-name="rowClassName"
          :footer-cell-class-name="'bg-gray-100 font-semibold'"
          :footer-method="footerMethod"
        >
          <vxe-column field="pallet_code" :title="$t('pallet-code')" :min-width="100">
            <template #default="{ rowIndex }">
              {{ getPalletCode(rowIndex) }}
            </template>
          </vxe-column>
          <vxe-column field="lot_installment" :title="$t('lot-installment-nbr')" :min-width="150">
            <template #default="{ rowIndex }">
              <el-select-v2
                v-model="form.installments[rowIndex].lot_installment_id"
                class="w-full"
                clearable
                filterable
                :reserve-keyword="false"
                :options="getLotInstallmentOptions()"
                @change="
                  resetInputsValue(xTable, rowIndex, [
                    'final_product_id',
                    { key: 'nbr_boxes', value: 0 },
                    { key: 'gross_weight', value: 0 },
                  ])
                "
              ></el-select-v2>
            </template>
          </vxe-column>
          <vxe-column field="site_id" :title="$t('farm')" :min-width="200">
            <template #default="{ rowIndex }">
              <span>{{ getInstallmentSite(rowIndex) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="variety_id" :title="$t('variety')" :min-width="200">
            <template #default="{ rowIndex }">
              <span>{{ getInstallmentVariety(rowIndex) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="cultivation_code" :title="$t('cultivation-code')" :min-width="140">
            <template #default="{ rowIndex }">
              <span>{{ getInstallmentCultivationCode(rowIndex) }}</span>
            </template>
          </vxe-column>
          <vxe-column field="final_product_id" :title="$t('product')" :min-width="350">
            <template #default="{ rowIndex }">
              <el-select-v2
                v-model="form.installments[rowIndex].final_product_id"
                filterable
                :reserve-keyword="false"
                :options="filteredProducts(rowIndex)"
                class="w-full"
                :disabled="!form.installments[rowIndex].lot_installment_id"
                @change="
                  resetInputsValue(xTable, rowIndex, [
                    { key: 'nbr_boxes', value: 0 },
                    { key: 'gross_weight', value: 0 },
                  ])
                "
              ></el-select-v2>
            </template>
          </vxe-column>
          <vxe-column field="nbr_boxes" :title="$t('nbr-boxes')" :min-width="170">
            <template #default="{ rowIndex }">
              <el-input-number
                v-model="form.installments[rowIndex].nbr_boxes"
                class="!w-full"
                :precision="0"
                :step="1"
                :min="0"
                :max="getMaxNbrBoxByIndex(rowIndex)"
                value-on-clear="min"
                :disabled="!form.installments[rowIndex].final_product_id"
                @change="onNbrBoxesChange(rowIndex)"
              ></el-input-number>
            </template>
          </vxe-column>
          <vxe-column field="nbr_unities" :title="$t('number-of-unities')" :min-width="120">
            <template #default="{ rowIndex }">{{ getNbrUnitiesByIndex(rowIndex) }}</template>
          </vxe-column>
          <vxe-column field="gross_weight" :title="$t('gross-weight')" :min-width="170">
            <template #default="{ rowIndex }">
              <el-input-number
                v-model="form.installments[rowIndex].gross_weight"
                class="!w-full"
                :precision="2"
                :step="1"
                :min="0"
                value-on-clear="min"
                :disabled="!form.installments[rowIndex].final_product_id"
              ></el-input-number>
            </template>
          </vxe-column>
          <vxe-column field="net_weight" :title="$t('net-weight')" :min-width="120">
            <template #default="{ rowIndex }">
              {{ getNetWeightByIndex(rowIndex) }}
            </template>
          </vxe-column>
          <vxe-column
            field="actions"
            :title="$t('actions')"
            width="100"
            align="center"
            fixed="right"
            :visible="!confection?.id"
          >
            <template #default="{ rowIndex }">
              <div class="flex items-center justify-center">
                <el-tooltip :content="$t('duplicate')">
                  <el-button plain type="info" size="small" @click="initInstalmentRow(rowIndex)">
                    <i-el-document-copy />
                  </el-button>
                </el-tooltip>
                <el-popconfirm
                  v-if="form.installments.length > 1"
                  :title="$t('are-you-sure-to-delete-this')"
                  @confirm="deleteInstalment(rowIndex)"
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
          :type="confection?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_confection')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { DATE_FORMAT, DATE_FORMAT_API, GAN_FRUITS_COMPANIES_LIST } from '@/constants'
import { groupBy, isGanFruits, sum, resetInputsValue, useDialog } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { useConfectionStore } from '@/stores/confection'
import { useDayIndexStore } from '@/stores/dayIndex'
import { useLotInstallmentStore } from '@/stores/lotInstallment'
import { usePalletTypeStore } from '@/stores/palletType'
import { useProductStore } from '@/stores/product'
import { useSiteStore } from '@/stores/site'
import { ElNotification } from 'element-plus'
import { computed, ref, watch, reactive } from 'vue'

const windowHeight = window.innerHeight / 2.2 ?? 500
const initForm = {
  code: null,
  added_at: null,
  day_index_id: null,
  site_id: null,
  status: 0,
  company: null,
  tracking_nbr: null,
  installments: [],
}
const initTable = {
  pallet_code: null,
  pallet_code_suffix: null,
  nbr_boxes: 0,
  nbr_unities: 0,
  gross_weight: 0,
  net_weight: 0,
}

const props = defineProps({
  confection: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const tableLoading = ref(false)
const form = ref(initForm)
const formRef = ref(null)
const xTable = ref(null)
const ganFruitsCompanies = GAN_FRUITS_COMPANIES_LIST

const siteStore = useSiteStore()
const palletTypeStore = usePalletTypeStore()
const confectionStore = useConfectionStore()
const productStore = useProductStore()
const lotInstallmentStore = useLotInstallmentStore()
const dayIndexStore = useDayIndexStore()

const rules = computed(() => {
  return {
    added_at: [
      {
        required: true,
        message: t('please-select-date'),
        trigger: 'blur',
      },
      {
        validator: () => form.value.day_index_id !== null,
        message: t('the-index-date-non-exist'),
        trigger: 'change',
      },
    ],
    site_id: [
      {
        required: true,
        message: t('please-select-station'),
        trigger: 'blur',
      },
    ],
    company: [
      {
        required: true,
        message: t('please-select-company'),
        trigger: 'blur',
      },
    ],
  }
})

watch(
  () => props.confection,
  (newVal) => {
    if (newVal?.id || newVal?.pallet_code) {
      const {
        added_at,
        company,
        site_id,
        day_index_id,
        tracking_nbr,
        pallet_code,
        pallet_code_suffix,
        lot_installment_id,
        final_product_id,
      } = newVal
      const instalmentData = [
        {
          pallet_code,
          pallet_code_suffix:
            !newVal?.id && newVal?.pallet_code ? pallet_code_suffix + 1 : pallet_code_suffix,
          lot_installment_id,
          final_product_id,
          nbr_boxes: newVal?.nbr_boxes ?? 0,
          nbr_unities: newVal?.nbr_unities ?? 0,
          gross_weight: newVal?.gross_weight ?? 0,
          net_weight: newVal?.net_weight ?? 0,
        },
      ]
      const confection = {
        added_at,
        company,
        site_id,
        day_index_id,
        tracking_nbr,
        status: 0,
        installments: instalmentData,
      }

      form.value = Object.assign({}, confection)
    } else {
      form.value = Object.assign({}, { ...initForm, installments: [] })
    }
  },
)

watch(
  () => form.value.installments,
  () => xTable?.value?.updateFooter(),
  { deep: true },
)

watch(
  () => form.value.added_at,
  (newVal) => {
    const day = dayIndexStore.dayIndex.find(
      ({ index_date }) => dayjs(index_date).format(DATE_FORMAT) == dayjs(newVal).format(DATE_FORMAT),
    )

    form.value.day_index_id = day ? day.id : null
  },
)

const getLotInstallments = computed(() => Array.from(lotInstallmentStore.lotInstallments))

const getLotInstallmentOptions = () => {
  const installments = [...lotInstallmentStore.getLotInstallments]

  if (props.confection?.id) {
    const { lot_installment_id, lot_installment } = props.confection

    if (!installments.some((el) => el.value == lot_installment_id)) {
      const { id, code, pallets } = lot_installment

      pallets[0].unity.variety = pallets[0].cultivation.variety

      installments.unshift({ value: id, label: code })
      getLotInstallments.value.unshift(lot_installment)
    }
  }

  return installments
}

const getDialogTitle = computed(() => {
  const title = props.confection?.id
    ? 'update-confection'
    : props.confection?.pallet_code
    ? 'add-new-sub-pallet'
    : 'add-new-confection'

  return t(title)
})

const isRowInvalid = (row, index) => {
  const { lot_installment_id, final_product_id, nbr_boxes } = row

  form.value.installments[index]['is_invalid'] = !lot_installment_id || !final_product_id || !nbr_boxes

  return form.value.installments[index]['is_invalid']
}

const rowClassName = ({ row, rowIndex }) => {
  return isRowInvalid(row, rowIndex) ? 'bg-red-50' : null
}

const isDisabledDate = (date) => {
  return !dayIndexStore.dayIndex
    .map(({ index_date }) => dayjs(index_date).format(DATE_FORMAT))
    .includes(dayjs(date).format(DATE_FORMAT))
}

const getPalletCode = (index) => {
  return `${form.value.installments[index].pallet_code}-${form.value.installments[index].pallet_code_suffix}`
}

const initInstalmentRow = (index) => {
  const { lot_installment_id, final_product_id } = form.value.installments.at(index > 0 ? index : 0) ?? {}
  const palletCode = form.value.installments?.length
    ? form.value.installments.at(0).pallet_code
    : confectionStore.latestPalletCode

  const palletCodeSuffix = form.value.installments?.length
    ? form.value.installments.at(0).pallet_code_suffix
    : 0

  const installment = Object.assign(
    {},
    {
      ...initTable,
      lot_installment_id: lot_installment_id ?? null,
      final_product_id: final_product_id ?? null,
      pallet_code: index >= 0 ? palletCode : palletCode + 1,
      pallet_code_suffix: index >= 0 ? palletCodeSuffix + 1 : 1,
    },
  )

  form.value.installments.unshift(installment)
}

const getLotInstallmentByIndex = (index) => {
  return getLotInstallments.value.find(({ id }) => id == form.value.installments.at(index).lot_installment_id)
}

const getInstallmentSite = (index) => {
  const lotInstallment = getLotInstallmentByIndex(index)

  return lotInstallment?.pallets[0]?.site?.name ?? null
}

const getInstallmentVariety = (index, key = 'name') => {
  const lotInstallment = getLotInstallmentByIndex(index)

  return lotInstallment?.pallets[0]?.unity?.variety[key] ?? null
}

const getInstallmentCultivationCode = (index) => {
  const lotInstallment = getLotInstallmentByIndex(index)

  return lotInstallment?.pallets[0]?.cultivation.code ?? null
}

const filteredProducts = (index) => {
  return productStore.products
    .filter(({ variety_id }) => variety_id == getInstallmentVariety(index, 'id'))
    .map(({ id, name }) => ({ value: id, label: name }))
}

const getProductById = (productId) => {
  return productStore.products.find(({ id }) => id == productId) ?? {}
}

const getNbrUnitiesByIndex = (index) => {
  const { final_product_id, nbr_boxes } = form.value.installments[index]
  const { nbr_unities } = getProductById(final_product_id)
  const nbrUnities = (nbr_boxes ?? 0) * (nbr_unities ?? 0)

  form.value.installments[index].nbr_unities = nbrUnities

  return nbrUnities
}

const getNetWeightByIndex = (index) => {
  const { final_product_id, nbr_boxes, gross_weight } = form.value.installments[index]
  const { commercial_weight, packhouse_unity, nbr_box_per_pallet, pallet_type_id } =
    getProductById(final_product_id)
  const palletType = palletTypeStore.palletTypes.find(({ id }) => id == pallet_type_id)
  let netWeight =
    gross_weight -
    nbr_boxes *
      ((commercial_weight ?? 0) +
        (packhouse_unity?.weight ?? 0) +
        (palletType?.tare_weight ?? 0) / (nbr_box_per_pallet ?? 1))

  netWeight = netWeight > 0 ? +netWeight.toFixed(2) : 0

  form.value.installments[index].net_weight = netWeight

  return netWeight
}

const deleteInstalment = (index) => {
  const installment = Object.assign({}, form.value.installments[index])

  form.value.installments = form.value.installments.filter(({ id }) => id !== installment.id)
}

const getMaxNbrBoxByIndex = (index) => {
  const { final_product_id, lot_installment_id } = form.value.installments[index]
  const { net_weight } = getProductById(final_product_id)
  const leftNetWeight =
    lotInstallmentStore.limiters?.find(({ id }) => id == lot_installment_id)?.left_net_weight ?? 0
  let maxNbrBoxes = props.confection?.id ? props.confection.nbr_boxes : 0

  if (leftNetWeight && (net_weight ?? 0) > 0) {
    const sumNbrBoxes = sum(
      form.value.installments
        .filter((el, i) => i != index && el.lot_installment_id == lot_installment_id)
        .map(({ nbr_boxes }) => nbr_boxes),
    )

    maxNbrBoxes += (net_weight > 0 ? parseInt(leftNetWeight / net_weight) : 0) - sumNbrBoxes
  }

  return maxNbrBoxes > 0 ? maxNbrBoxes : 0
}

const onNbrBoxesChange = (index) => {
  const { final_product_id, nbr_boxes } = form.value.installments[index]
  const { net_weight, commercial_weight, packhouse_unity, nbr_box_per_pallet, pallet_type_id } =
    getProductById(final_product_id)
  const palletType = palletTypeStore.palletTypes.find(({ id }) => id == pallet_type_id)
  const grossWeight =
    nbr_boxes *
    ((net_weight || 0) +
      (commercial_weight || 0) +
      (packhouse_unity?.weight || 0) +
      (palletType?.tare_weight || 0) / (nbr_box_per_pallet || 1))

  form.value.installments[index].gross_weight = grossWeight
}

const footerMethod = ({ columns, data }) => {
  return [
    columns.map((column) => {
      switch (column.field) {
        case 'pallet_code':
          return t('total')
        case 'nbr_boxes':
          return sum(data.map(({ nbr_boxes }) => nbr_boxes ?? 0))
        case 'nbr_unities':
          return sum(data.map(({ nbr_unities }) => nbr_unities ?? 0))
        case 'gross_weight':
          return sum(data.map(({ gross_weight }) => (gross_weight ? parseFloat(gross_weight) : 0))).toFixed(2)
        case 'net_weight':
          return sum(data.map(({ net_weight }) => (net_weight ? parseFloat(net_weight) : 0))).toFixed(2)
        default:
          return ''
      }
    }),
  ]
}

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const errors = []

      loading.value = true

      lotInstallmentStore
        .fetchLimiters()
        .then(async () => {
          await Object.values(groupBy(form.value.installments, 'lot_installment_id')).forEach(
            async (items) => {
              const key = items[0].lot_installment_id
              const leftNetWeight =
                lotInstallmentStore.limiters?.find(({ id }) => id == key)?.left_net_weight ?? 0
              const lotInstalmentTotals = {}
              const currentNbrBoxes = props.confection?.id ? props.confection.nbr_boxes : 0
              const currentNetWeight =
                (getProductById(items[0].final_product_id)?.net_weight ?? 0) * currentNbrBoxes
              const sumNetWeight = sum(items.map(({ net_weight }) => net_weight))
              const sumLeftNetWeight = leftNetWeight + currentNetWeight

              await Object.values(groupBy(items, 'final_product_id')).forEach((item) => {
                const { net_weight } = getProductById(item[0].final_product_id)

                if (lotInstalmentTotals[key] == undefined) {
                  lotInstalmentTotals[key] = 0
                }

                lotInstalmentTotals[key] += sum(item.map(({ nbr_boxes }) => nbr_boxes)) * net_weight
              })

              if (lotInstalmentTotals[key] > sumLeftNetWeight || sumNetWeight > sumLeftNetWeight) {
                const palletKey = `${items[0].pallet_code}-${items[0].pallet_code_suffix}`

                errors.unshift(
                  t('confection-limiter-message', {
                    palletKey,
                    leftNetWeight: leftNetWeight.toFixed(2),
                    netWeight: sumNetWeight.toFixed(2),
                  }),
                )
              }
            },
          )

          if (errors?.length) {
            loading.value = false

            errors.forEach((error) => {
              ElNotification.error({
                title: t('error'),
                message: error,
                showClose: true,
                duration: 5000,
                position: 'bottom-right',
              })
            })
          } else {
            const data = prepareData()
            const id = props.confection?.id

            if (id) {
              confectionStore
                .update({ ...data[0], id })
                .then(() => reset())
                .finally(() => (loading.value = false))
            } else {
              confectionStore
                .create(data)
                .then(() => reset())
                .finally(() => (loading.value = false))
            }
          }
        })
        .catch(() => (loading.value = false))
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_confection')
  loading.value = false
  form.value = initForm
  emit('reload')
}

const prepareData = () => {
  const { added_at, day_index_id, site_id, status, installments, company, tracking_nbr } = form.value

  return installments.map((pallet) => {
    const {
      pallet_code,
      pallet_code_suffix,
      lot_installment_id,
      final_product_id,
      nbr_boxes,
      nbr_unities,
      gross_weight,
      net_weight,
    } = pallet

    return {
      added_at: dayjs(added_at).format(DATE_FORMAT_API),
      day_index_id,
      site_id,
      tracking_nbr,
      status,
      pallet_code,
      pallet_code_suffix,
      lot_installment_id,
      final_product_id,
      nbr_boxes,
      nbr_unities,
      gross_weight,
      net_weight,
      company,
    }
  })
}

const isFieldDisabled = computed(() => Boolean(!props.confection?.id && props.confection?.pallet_code))

const isSaveDisabled = computed(() => {
  return Boolean(
    loading.value ||
      !form.value.day_index_id ||
      form.value.installments.length == 0 ||
      form.value.installments.filter(({ is_invalid }) => is_invalid).length > 0,
  )
})

const trackingNbrMask = reactive({
  mask: '@',
  tokens: {
    '@': { pattern: /[a-zA-Z0-9- ]/, repeated: true },
  },
})
</script>
