<template>
  <vxe-table
    ref="xTable"
    class="w-full mt-3"
    :data="form"
    show-footer
    :row-config="{ keyField: 'id' }"
    :row-class-name="rowStyle"
    footer-cell-class-name="font-bold bg-slate-50"
    border
    round
    max-height="450"
    :loading="loading"
    :footer-method="receptionFooterMethod"
  >
    <vxe-column :title="$t('order')" type="seq" :min-width="65"></vxe-column>
    <vxe-column field="delivery_nbr" :title="$t('delivery-code')" :min-width="200">
      <template #default="{ rowIndex }">
        <el-input
          v-model="form[rowIndex].delivery_nbr"
          :disabled="isUnavailableRow(rowIndex)"
          class="w-full"
        ></el-input>
      </template>
    </vxe-column>
    <vxe-column field="pallet_id" :title="$t('pallet-code')" :min-width="120">
      <template #default="{ rowIndex }">{{ form[rowIndex].pallet_id }}</template>
    </vxe-column>
    <vxe-column field="site" :title="$t('farm')" :min-width="200">
      <template #default="{ rowIndex }">
        <el-select-v2
          v-model="form[rowIndex].site_id"
          :disabled="isUnavailableRow(rowIndex)"
          filterable
          :reserve-keyword="false"
          :options="farms.map((el) => ({ ...el, label: el.name }))"
          value-key="id"
          class="w-full"
          @change="resetInputValues(rowIndex, ['unity_id', 'cultivation_id', 'variety_id'])"
        ></el-select-v2>
      </template>
    </vxe-column>
    <vxe-column field="variety_id" :title="$t('variety')" :min-width="200">
      <template #default="{ rowIndex }">
        <el-select-v2
          v-model="form[rowIndex].variety_id"
          :disabled="!form[rowIndex].site_id || isUnavailableRow(rowIndex)"
          filterable
          :reserve-keyword="false"
          :options="
            farms
              .find(({ id }) => id == form[rowIndex].site_id)
              ?.varieties.map((el) => ({ ...el, label: el.name })) ?? []
          "
          value-key="id"
          class="w-full"
          @change="resetInputValues(rowIndex, ['unity_id', 'cultivation_id'])"
        ></el-select-v2>
      </template>
    </vxe-column>
    <vxe-column field="cultivation_id" :title="$t('drilling-code')" :min-width="250">
      <template #default="{ rowIndex }">
        <el-select-v2
          v-model="form[rowIndex].cultivation_id"
          :disabled="!form[rowIndex].site_id || !form[rowIndex].variety_id || isUnavailableRow(rowIndex)"
          filterable
          :reserve-keyword="false"
          :options="
            cultivationStore.cultivations
              .filter(
                ({ variety_id: id, parcel }) =>
                  id == form[rowIndex].variety_id && parcel.site_id == form[rowIndex].site_id,
              )
              .map((el) => ({
                ...el,
                label: `${el.parcel.name}_${el.parcel.site.name}_DC${el.code} (${el.code})`,
              }))
          "
          value-key="id"
          class="w-full"
          @change="resetInputValues(rowIndex, ['unity_id'])"
        ></el-select-v2>
      </template>
    </vxe-column>
    <vxe-column field="unity_id" :title="$t('unity')" :min-width="200">
      <template #default="{ rowIndex }">
        <el-select-v2
          v-model="form[rowIndex].unity_id"
          :disabled="!form[rowIndex].variety_id || isUnavailableRow(rowIndex)"
          filterable
          :reserve-keyword="false"
          :options="
            unityStore.unities
              .filter(({ variety_id: id }) => id == form[rowIndex].variety_id)
              .map((el) => ({ ...el, label: el.label }))
          "
          value-key="id"
          class="w-full"
          @change="calcGrossNetAvgPerBox({ index: rowIndex })"
        ></el-select-v2>
      </template>
    </vxe-column>
    <vxe-column field="box_type_id" :title="$t('box-type')" :min-width="200">
      <template #default="{ rowIndex }">
        <el-select-v2
          v-model="form[rowIndex].box_type_id"
          :disabled="!form[rowIndex].unity_id || isUnavailableRow(rowIndex)"
          filterable
          :reserve-keyword="false"
          :options="boxTypeStore.boxTypes.map((el) => ({ ...el, label: el.label }))"
          value-key="id"
          class="w-full"
          @change="calcGrossNetAvgPerBox({ index: rowIndex })"
        ></el-select-v2>
      </template>
    </vxe-column>
    <vxe-column field="pallet_type_id" :title="$t('pallet-type')" :min-width="200">
      <template #default="{ rowIndex }">
        <el-select-v2
          v-model="form[rowIndex].pallet_type_id"
          :disabled="!form[rowIndex].box_type_id || isUnavailableRow(rowIndex)"
          filterable
          :reserve-keyword="false"
          :options="palletTypeStore.palletTypes.map((el) => ({ ...el, label: el.label }))"
          value-key="id"
          class="w-full"
          @change="calcGrossNetAvgPerBox({ index: rowIndex })"
        ></el-select-v2>
      </template>
    </vxe-column>
    <vxe-column field="nbr_boxes" :title="$t('nbr-boxes')" :min-width="200">
      <template #default="{ rowIndex }">
        <el-input-number
          v-model="form[rowIndex].nbr_boxes"
          :disabled="!form[rowIndex].pallet_type_id || isUnavailableRow(rowIndex)"
          class="!w-full"
          :precision="0"
          :step="1"
          :min="1"
          value-on-clear="min"
          @change="calcGrossNetAvgPerBox({ index: rowIndex })"
        ></el-input-number>
      </template>
    </vxe-column>
    <vxe-column field="gross_weight" :title="$t('gross-weight')" :min-width="200">
      <template #default="{ rowIndex }">
        <el-input-number
          v-model="form[rowIndex].gross_weight"
          :disabled="!form[rowIndex].pallet_type_id || isUnavailableRow(rowIndex)"
          class="!w-full"
          :min="0"
          value-on-clear="min"
          @change="calcGrossNetAvgPerBox({ index: rowIndex, calcGross: false })"
        ></el-input-number>
      </template>
    </vxe-column>
    <vxe-column field="net_weight" :title="$t('net-weight')" :width="150">
      <template #default="{ rowIndex }">
        <el-input-number
          v-if="receptionStore.type.external == form[rowIndex].type && !isUnavailableRow(rowIndex)"
          v-model="form[rowIndex].net_weight"
          class="!w-full"
          :min="0"
          value-on-clear="min"
          @change="calcGrossNetAvgPerBox({ index: rowIndex })"
        ></el-input-number>
        <strong v-else>
          {{ form[rowIndex].net_weight.toFixed(2) }}
        </strong>
      </template>
    </vxe-column>
    <vxe-column field="avg_per_box" :title="$t('average-case')" :width="150">
      <template #default="{ rowIndex }">
        <strong>
          {{ form[rowIndex].avg_per_box.toFixed(2) }}
        </strong>
      </template>
    </vxe-column>
    <vxe-column field="actions" :title="$t('actions')" :width="140" align="center" fixed="right">
      <template #default="{ rowIndex, row }">
        <div class="flex items-center justify-center">
          <el-button plain type="info" size="small" @click="addDuplicateRow(row)">
            <i-el-document-copy />
          </el-button>
          <div v-if="!isUnavailableRow(rowIndex)">
            <el-popconfirm :title="$t('are-you-sure-to-delete-this')" @confirm="deleteRow(rowIndex)">
              <template #reference>
                <div class="ml-2">
                  <el-tooltip :content="$t('delete')">
                    <el-button plain type="danger" size="small">
                      <i-el-delete />
                    </el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </vxe-column>
  </vxe-table>
</template>

<script setup>
import { receptionFooterMethod } from '../helpers/receptionFooterMethod'
import { useBoxTypeStore } from '@/stores/boxType'
import { useCultivationStore } from '@/stores/cultivation'
import { usePalletTypeStore } from '@/stores/palletType'
import { useReceptionStore } from '@/stores/reception'
import { useSiteStore } from '@/stores/site'
import { useUnityStore } from '@/stores/unity'
import { computed, ref, nextTick } from 'vue'
import { sum } from '@/helpers'

const palletTypeStore = usePalletTypeStore()
const siteStore = useSiteStore()
const boxTypeStore = useBoxTypeStore()
const cultivationStore = useCultivationStore()
const unityStore = useUnityStore()
const receptionStore = useReceptionStore()

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  type: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update'])

const form = ref(props.data.map((el) => ({ ...el, variety_id: el?.unity?.variety_id })))
const xTable = ref(null)
const loading = ref(false)

const farms = computed(() => {
  return siteStore.sites.filter(({ group }) => group != siteStore.groups[2].value)
})

const rowStyle = ({ rowIndex }) => {
  const isRowValid = isValidRow(form.value[rowIndex])
  const total = sum(form.value.map(({ net_weight }) => net_weight))

  form.value[rowIndex].is_valid = isRowValid

  let is_valid = !form.value.filter(({ is_valid }) => !is_valid).length > 0

  if (is_valid && props.type == receptionStore.type.internal) {
    is_valid = form.value.length > 0
  }

  emit('update', { type: props.type, is_valid, total })

  if (!isRowValid) {
    return 'bg-red-50'
  }
}

const isValidRow = ({
  delivery_nbr,
  pallet_id,
  variety_id,
  cultivation_id,
  unity_id,
  box_type_id,
  pallet_type_id,
  nbr_boxes,
  gross_weight,
  net_weight,
  avg_per_box,
}) => {
  return !(
    !delivery_nbr ||
    !pallet_id ||
    !variety_id ||
    !cultivation_id ||
    !unity_id ||
    !box_type_id ||
    !pallet_type_id ||
    !nbr_boxes ||
    !gross_weight ||
    net_weight < 0 ||
    avg_per_box < 0
  )
}

const addDuplicateRow = (row = {}) => {
  const palletCode = receptionStore.latestReception.palletCode

  form.value.unshift({
    type: props.type,
    delivery_nbr: null,
    site_id: null,
    variety_id: null,
    cultivation_id: null,
    unity_id: null,
    box_type_id: null,
    pallet_type_id: null,
    nbr_boxes: 1,
    gross_weight: 1,
    net_weight: 0,
    avg_per_box: 0,
    is_valid: false,
    ...row,
    id: undefined,
    status: undefined,
    reception_id: undefined,
    pallet_id: palletCode,
  })

  receptionStore.increasePalletCode()
}

const deleteRow = (index) => {
  form.value.splice(index, 1)
}

const resetInputValues = (index, items) => {
  items.forEach((item) => {
    if (form.value[index][item] != null) {
      form.value[index] = Object.assign({}, { ...form.value[index], [item]: null })
    }
  })
}

const calcGrossNetAvgPerBox = ({ index, calcGross = true }) => {
  const { nbr_boxes, unity_id, box_type_id, pallet_type_id, type } = form.value[index]

  if (type == receptionStore.type.internal) {
    const unity = unityStore.unities.find(({ id }) => id == unity_id)

    if (calcGross) {
      const grossWeight = (unity?.weight ?? 0) * nbr_boxes

      form.value[index].gross_weight = grossWeight
    }

    nextTick(() => {
      const grossWeight = form.value[index].gross_weight
      const isUnityByKilogram = unity?.by_kilogram ?? false
      const palletTypeTareWeight =
        palletTypeStore.palletTypes.find(({ id }) => id == pallet_type_id)?.tare_weight ?? 0
      const boxTypeTareWeight = boxTypeStore.boxTypes.find(({ id }) => id == box_type_id)?.tare_weight ?? 0
      const netWeight = isUnityByKilogram
        ? grossWeight - (nbr_boxes * boxTypeTareWeight + palletTypeTareWeight)
        : grossWeight

      form.value[index].net_weight = netWeight
      form.value[index].avg_per_box = form.value[index].net_weight / nbr_boxes

      xTable.value.updateFooter()
    })
  }

  form.value[index].avg_per_box = form.value[index].net_weight / nbr_boxes

  xTable.value.updateFooter()
}

const isUnavailableRow = (index) => {
  const { status } = form.value[index]

  return typeof status == 'number' && status != receptionStore.status[0].value
}

const getData = () => {
  return form.value
}

const reset = () => {
  form.value = []
}

defineExpose({ addDuplicateRow, getData, reset })
</script>
