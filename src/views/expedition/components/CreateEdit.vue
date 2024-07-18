<template>
  <el-dialog
    draggable
    :title="$t(expedition?.id ? 'update-expedition' : 'add-new-expedition')"
    :model-value="$dialog.visible('create_edit_expedition')"
    width="95%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_expedition')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="grid grid-cols-5 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('expedition-code')" prop="code">
              <el-input-number
                v-model="form.code"
                class="!w-full"
                :controls="false"
                :disabled="Boolean(expedition?.id)"
              />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('added-at')" prop="added_at">
              <el-date-picker v-model="form.added_at" class="!w-full" :format="DATE_FORMAT"></el-date-picker>
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
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('client')" prop="client_id">
              <el-select-v2
                v-model="form.client_id"
                filterable
                :reserve-keyword="false"
                :options="internationalClients"
                value-key="id"
                class="w-full"
              ></el-select-v2>
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
                @change="onCompanyChange()"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('tracking-nbr')" prop="tracking_nbr">
              <el-select-v2
                v-model="form.tracking_nbr"
                filterable
                clearable
                :reserve-keyword="false"
                :options="getTrackingNbrOptions"
                class="w-full"
                @change="form.confections = [{}]"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('vehicle')" prop="vehicle_id">
              <el-select-v2
                v-model="form.vehicle_id"
                filterable
                :reserve-keyword="false"
                :options="vehicleOptions"
                value-key="id"
                class="w-full"
                @change="onVehicleChanged()"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('vehicle-type')">
              <label class="font-bold">{{ form.vehicle_id && vehicleType.name }}</label>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('transporter')">
              <label class="font-bold">{{ form.vehicle_id && `${transporter?.name}` }}</label>
            </el-form-item>
          </div>
        </div>
        <el-divider />
        <vxe-table
          ref="xTable"
          class="w-full"
          :data="form?.confections"
          :loading="tableLoading"
          :row-config="{ keyField: 'id' }"
          :show-footer="Boolean(form?.confections?.length > 1)"
          :footer-method="footerMethod"
          footer-row-class-name="bg-zinc-50 font-bold"
          border
          round
          max-height="450"
        >
          <vxe-column :title="$t('order')" type="seq" :min-width="65" :class-name="rowClassName"></vxe-column>
          <vxe-column
            field="final_product_id"
            :title="$t('product')"
            :min-width="200"
            :class-name="rowClassName"
          >
            <template #default="{ rowIndex }">
              <el-select-v2
                v-model="form.confections[rowIndex].final_product_id"
                filterable
                :reserve-keyword="false"
                :options="filteredProducts.map((el) => ({ ...el, label: el.name }))"
                value-key="id"
                class="w-full"
                @change="setConfectionOptions(rowIndex)"
              ></el-select-v2>
            </template>
          </vxe-column>
          <vxe-column
            field="confection_id"
            :title="$t('pallet-code')"
            min-width="150"
            :class-name="rowClassName"
          >
            <template #default="{ rowIndex }">
              <el-select-v2
                v-model="form.confections[rowIndex].confection_id"
                :disabled="confectionDisabled(rowIndex)"
                filterable
                :reserve-keyword="false"
                :options="confectionOptions(rowIndex)"
                value-key="id"
                class="w-full"
                @change="onPalletChanged(rowIndex)"
              ></el-select-v2>
            </template>
          </vxe-column>
          <vxe-column field="nbr_boxes" :title="$t('nbr-boxes')" :min-width="200" :class-name="rowClassName">
            <template #default="{ rowIndex }">
              {{ form?.confections[rowIndex].nbr_boxes }}
            </template>
          </vxe-column>
          <vxe-column
            field="gross_weight"
            :title="$t('gross-weight')"
            :min-width="200"
            :class-name="rowClassName"
          >
            <template #default="{ rowIndex }">
              {{ form?.confections[rowIndex].gross_weight }}
            </template>
          </vxe-column>
          <vxe-column field="net_weight" :title="$t('net-weight')" :width="150" :class-name="rowClassName">
            <template #default="{ rowIndex }">{{ form?.confections[rowIndex].net_weight }}</template>
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
                <el-tooltip :content="$t('duplicate')">
                  <el-button plain type="info" size="small" @click="duplicateConfection(rowIndex)">
                    <i-el-document-copy />
                  </el-button>
                </el-tooltip>
                <el-popconfirm
                  v-if="form?.confections.length > 1"
                  :title="$t('are-you-sure-to-delete-this')"
                  @confirm="deleteConfection(rowIndex)"
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
          :type="expedition?.id ? 'warning' : 'primary'"
          :loading="loading"
          :disabled="loading || isConfectionsInvalid"
          @click="save()"
        >
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="$dialog.close('create_edit_expedition')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useDialog, sum, isGanFruits, groupBy } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { DATE_FORMAT, GAN_FRUITS_COMPANIES_LIST } from '@/constants'

import { useExpeditionStore } from '@/stores/expedition'
import { useSiteStore } from '@/stores/site'
import { useVehicleTypeStore } from '@/stores/vehicleTypes'
import { useVehicleStore } from '@/stores/vehicle'
import { useClientStore } from '@/stores/client'
import { useConfectionStore } from '@/stores/confection'
import { useProductStore } from '@/stores/product'
import { useTransporterStore } from '@/stores/transporter'

const expeditionStore = useExpeditionStore()
const siteStore = useSiteStore()
const vehicleStore = useVehicleStore()
const vehicleTypeStore = useVehicleTypeStore()
const transporterStore = useTransporterStore()
const productStore = useProductStore()
const confectionStore = useConfectionStore()
const clientStore = useClientStore()

const props = defineProps({
  expedition: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['reload'])

const initForm = {
  code: null,
  added_at: dayjs().toString(),
  client_id: null,
  vehicle_id: null,
  site_id: null,
  is_shipped: false,
  gross_weight: null,
  net_weight: null,
  nbr_pallets: null,
  company: null,
  tracking_nbr: null,
  confections: [{ id: Math.random() }],
}

const rules = reactive({
  code: [
    {
      required: true,
      message: t('please-input-code'),
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
  client_id: [
    {
      required: true,
      message: t('please-select-client'),
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
  site_id: [
    {
      required: true,
      message: t('please-select-station'),
      trigger: 'blur',
    },
  ],
  vehicle_id: [
    {
      required: true,
      message: t('please-select-vehicle'),
      trigger: 'blur',
    },
  ],
})

const xTable = ref()
const formRef = ref()
const form = ref(initForm)
const loading = ref(false)
const tableLoading = ref(false)
const transporter = ref(null)
const vehicleType = ref(null)
const ganFruitsCompanies = GAN_FRUITS_COMPANIES_LIST

const isConfectionsInvalid = computed(
  () => !form.value?.confections?.length || form.value?.confections?.some((row) => isRowInvalid(row)),
)

const getSumPallets = computed(() => {
  return [...new Set(form.value?.confections?.map(({ pallet_code }) => pallet_code))].length
})

const sumNbrBoxes = computed(() => {
  return sum(form.value?.confections?.map(({ nbr_boxes }) => nbr_boxes))
})

const sumGrossWeight = computed(() => {
  return +sum(form.value?.confections?.map(({ gross_weight }) => gross_weight)).toFixed(2)
})

const sumNetWeight = computed(() => {
  return +sum(form.value?.confections?.map(({ net_weight }) => net_weight)).toFixed(2)
})

const vehicleOptions = computed(() => {
  const exportGroup = vehicleTypeStore.vehicleTypeGroups.find(
    ({ value }) => value === vehicleTypeStore.vehicleTypeGroups[4].value,
  )
  const typeIds = vehicleTypeStore.vehicleTypes
    .filter(({ group }) => group === exportGroup.value)
    .map(({ id }) => id)

  return vehicleStore.vehicles
    .filter(({ type_id }) => typeIds.includes(type_id))
    .map((el) => ({ ...el, label: el.registration_nbr }))
})

watch(
  () => props.expedition,
  (newVal) => {
    if (newVal?.id) {
      const { id, code, added_at, client_id, vehicle_id, confections, is_shipped } = newVal

      form.value = Object.assign(
        {},
        {
          id,
          code,
          added_at,
          site_id: confections[0].site_id,
          client_id,
          vehicle_id,
          company: confections[0].company,
          tracking_nbr: confections[0].tracking_nbr,
          confections: confections.map((el) => {
            const { final_product_id, pallet_code, nbr_boxes, gross_weight, net_weight } =
              confectionStore.confections.find(({ id }) => id == el.id)

            return {
              ...el,
              final_product_id,
              pallet_code,
              nbr_boxes,
              gross_weight,
              net_weight,
              confection_id: el.id,
              temperature: el.temperature || 0,
            }
          }),
          is_shipped,
        },
      )
      onVehicleChanged()
    } else {
      form.value = Object.assign({}, { ...initForm, code: expeditionStore.latestExpeditionsCode })
    }
  },
)

watch(
  () => form.value?.confections,
  () => {
    xTable.value?.updateFooter()
  },
  { deep: true },
)

const onVehicleChanged = () => {
  const { transporter_id, type_id } = vehicleStore.vehicles.find(({ id }) => id == form.value.vehicle_id)

  transporter.value = transporterStore.transporters.find(({ id }) => id == transporter_id)
  vehicleType.value = vehicleTypeStore.vehicleTypes.find(({ id }) => id == type_id)
}

const duplicateConfection = (index) => {
  const confection = Object.assign(
    {},
    {
      ...form.value.confections[index],
      id: `${index}-${Math.random()}`,
      is_shipped: false,
      temperature: null,
    },
  )

  tableLoading.value = true

  form.value.confections.unshift(confection)

  reloadTable()
}

const confectionOptions = (index) => {
  const { company, confections, tracking_nbr } = form.value
  const { final_product_id } = confections[index]

  const expeditionPallets = props.expedition?.id
    ? props.expedition.confections.map(({ pallet_code }) => pallet_code)
    : []

  return confectionStore.confections
    ?.filter((el) => {
      return (
        el.final_product_id == final_product_id &&
        (el.status == confectionStore.statusOptions[0].value || expeditionPallets.includes(el.pallet_code)) &&
        (isGanFruits ? el.company == company : true) &&
        (tracking_nbr ? el.tracking_nbr == tracking_nbr : true)
      )
    })
    ?.map((el) => ({ ...el, label: `${el.pallet_code}-${el.pallet_code_suffix}` }))
}

const deleteConfection = (index) => {
  form.value.confections.splice(index, 1)
  reloadTable()
}

const reloadTable = () => {
  setTimeout(() => {
    xTable.value.loadData(form.value?.confections)
    tableLoading.value = false
  }, 250)
}

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      const { code, added_at, client_id, site_id, vehicle_id, confections, is_shipped } = form.value
      const data = {
        code,
        added_at: dayjs(added_at).format(),
        client_id,
        site_id,
        vehicle_id,
        gross_weight: sumGrossWeight.value,
        net_weight: sumNetWeight.value,
        nbr_pallets: getSumPallets.value,
        confections,
        is_shipped,
      }

      if (form.value?.id) {
        expeditionStore
          .update({ id: form.value.id, ...data })
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        expeditionStore
          .create(data)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_expedition')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}

const isRowInvalid = ({ final_product_id, confection_id }) => {
  return (
    !final_product_id ||
    !confection_id ||
    form.value?.confections?.filter((el) => el.confection_id == confection_id).length > 1
  )
}

const rowClassName = ({ row }) => (isRowInvalid(row) ? 'bg-red-50' : null)

const footerMethod = ({ columns }) => [
  columns.map((column) => {
    switch (column.field) {
      case 'final_product_id':
        return t('total')
      case 'confection_id':
        return getSumPallets.value
      case 'nbr_boxes':
        return sumNbrBoxes.value
      case 'gross_weight':
        return sumGrossWeight.value
      case 'net_weight':
        return sumNetWeight.value
      default:
        return ''
    }
  }),
]

const confectionDisabled = (index) => !form.value?.confections[index].final_product_id

const setConfectionOptions = (index) => {
  Object.assign(form.value.confections[index], {
    confection_id: null,
    nbr_boxes: null,
    gross_weight: null,
    net_weight: null,
  })
}

const onPalletChanged = (index) => {
  const confection_id = form.value?.confections[index].confection_id
  const { pallet_code, nbr_boxes, gross_weight, net_weight } = confectionStore.confections.find(
    ({ id }) => id == confection_id,
  )
  Object.assign(form.value.confections[index], { pallet_code, nbr_boxes, gross_weight, net_weight })
}

const onCompanyChange = () => {
  form.value.tracking_nbr = null
  form.value.confections = [{}]
}

const filteredProducts = computed(() => {
  return productStore.products.filter(
    ({ destination, id }) =>
      destination == productStore.destinations[0].value &&
      confectionStore.getConfectionsInStock.map(({ final_product_id }) => final_product_id).includes(id),
  )
})

const internationalClients = computed(() => {
  return clientStore.clients
    .filter(({ is_international }) => is_international)
    .map((el) => ({ ...el, label: el.name }))
})

const getTrackingNbrOptions = computed(() => {
  const groupedConfections = groupBy(confectionStore.getConfectionsInStock, 'tracking_nbr')

  return Object.keys(groupedConfections)
    .filter((el) => el !== 'null')
    .map((el) => ({ value: el, label: el }))
})
</script>
