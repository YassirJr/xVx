<template>
  <el-dialog
    draggable
    :title="$t(lotInstallment?.id ? 'update-lot-installment' : 'create-new-lot-installment')"
    :model-value="$dialog.visible('create_edit_lot_installment')"
    width="70%"
    top="5vh"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_lot_installment')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="grid grid-cols-4 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('lot-installment-nbr')" prop="code">
              <el-input v-model="form.code" class="!w-full" :disabled="Boolean(lotInstallment?.id)" />
            </el-form-item>
          </div>
          <div class="col-span-3 grid place-content-end">
            <el-form-item>
              <el-button plain type="primary" @click="addTimeLine()">
                <i-el-plus class="mr-2" />
                {{ $t('add-timeline') }}
              </el-button>
            </el-form-item>
          </div>
          <div class="col-span-4">
            <vxe-table
              class="w-full"
              :row-class-name="isTimelineRowInvalid"
              :data="form.timeline"
              max-height="400"
              :row-config="{ keyField: 'id' }"
            >
              <vxe-column field="added_at" :title="$t('added-at')" :min-width="200">
                <template #default="{ rowIndex }">
                  <el-date-picker
                    v-model="form.timeline[rowIndex].added_at"
                    class="!w-full"
                    :format="DATE_FORMAT"
                  />
                </template>
              </vxe-column>
              <vxe-column field="start_time" :title="$t('start-hour')" :min-width="200">
                <template #default="{ rowIndex }">
                  <el-time-picker
                    v-model="form.timeline[rowIndex].start_time"
                    class="!w-full"
                    format="HH:mm"
                  />
                </template>
              </vxe-column>
              <vxe-column field="break_time" :title="$t('pause')" :min-width="200">
                <template #default="{ rowIndex }">
                  <el-time-picker
                    v-model="form.timeline[rowIndex].break_time"
                    class="!w-full"
                    format="HH:mm"
                  />
                </template>
              </vxe-column>
              <vxe-column field="end_time" :title="$t('end-hour')" :min-width="200">
                <template #default="{ rowIndex }">
                  <el-time-picker v-model="form.timeline[rowIndex].end_time" class="!w-full" format="HH:mm" />
                </template>
              </vxe-column>
              <vxe-column :min-width="200" width="100" align="center" fixed="right">
                <template #default="{ rowIndex }">
                  <div class="flex items-center justify-center">
                    <el-popconfirm :title="$t('are-you-sure-to-delete-this')" @confirm="deleteTime(rowIndex)">
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
          <el-divider class="col-span-4" />
          <div class="col-span-1">
            <el-form-item :label="$t('farm')">
              <el-select-v2
                v-model="form.site_id"
                :disabled="Boolean(lotInstallment?.id)"
                class="w-full"
                clearable
                filterable
                :options="siteStore.getSites"
                value-key="id"
                @change="resetCols(['variety_id', 'cultivation_id', 'unity_ids'])"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('variety')">
              <el-select-v2
                v-model="form.variety_id"
                :disabled="Boolean(lotInstallment?.id)"
                class="w-full"
                clearable
                filterable
                :options="filteredVarieties.map((el) => ({ ...el, label: el.name }))"
                value-key="id"
                @change="resetCols(['cultivation_id', 'unity_ids'])"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('drilling-code')">
              <el-select-v2
                v-model="form.cultivation_id"
                :disabled="Boolean(!form.site_id || !form.variety_id || hasPalletData)"
                class="w-full"
                clearable
                filterable
                :options="filteredCultivations.map((el) => ({ ...el, label: el.code }))"
                value-key="id"
                @change="resetCols(['unity_ids'])"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('unity')">
              <el-select-v2
                v-model="form.unity_ids"
                :disabled="Boolean(!form.cultivation_id || hasPalletData)"
                class="w-full"
                filterable
                clearable
                multiple
                :multiple-limit="3"
                :options="filteredUnities.map((el) => ({ ...el, label: el.label }))"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
        </div>
        <div v-if="lotInstallment.id || form.unity_ids?.length > 0">
          <el-divider class="mt-0" />
          <div class="text-right mb-5">
            <el-button plain type="primary" @click="newPallet()">
              <i-el-plus class="mr-2" />
              {{ $t('add') }}
            </el-button>
          </div>
          <vxe-table
            ref="xTable"
            class="w-full"
            :row-class-name="isPalletRowInvalid"
            :data="form.pallets"
            :loading="tableLoading"
            border
            round
            max-height="450"
            :row-config="{ keyField: 'id' }"
          >
            <vxe-column :title="$t('order')" type="seq" :min-width="55"></vxe-column>
            <vxe-column field="pallet_id" :title="$t('code')" :min-width="200">
              <template #default="{ rowIndex }">
                <el-select-v2
                  v-model="form.pallets[rowIndex].pallet_id"
                  filterable
                  :reserve-keyword="false"
                  :options="filteredPallets.map(({ pallet_id }) => ({ id: pallet_id, label: pallet_id }))"
                  value-key="id"
                  class="w-full"
                  @change="onPalletChange(rowIndex)"
                ></el-select-v2>
              </template>
            </vxe-column>
            <vxe-column field="arrival_hour" :title="$t('reception-date')" :min-width="240">
              <template #default="{ rowIndex }">
                {{ form.pallets[rowIndex].arrival_hour }}
              </template>
            </vxe-column>
            <vxe-column field="by_kilogram" :title="$t('unity')" :min-width="100">
              <template #default="{ rowIndex }">
                {{
                  typeof form.pallets[rowIndex]?.by_kilogram == 'boolean'
                    ? $t(form.pallets[rowIndex].by_kilogram ? 'kg' : 'pieces')
                    : null
                }}
              </template>
            </vxe-column>
            <vxe-column field="nbr_boxes" :title="$t('nbr-boxes')" :min-width="200">
              <template #default="{ rowIndex }">
                <el-input-number
                  v-model="form.pallets[rowIndex].nbr_boxes"
                  class="!w-full"
                  :precision="0"
                  :step="1"
                  :min="0"
                  :max="form.pallets[rowIndex].max_boxes_nbr"
                  value-on-clear="min"
                  @change="onNbrBoxesChanged(rowIndex)"
                ></el-input-number>
              </template>
            </vxe-column>
            <vxe-column field="net_weight" :title="$t('net-weight')" :min-width="200">
              <template #default="{ rowIndex }">{{ form.pallets[rowIndex].net_weight }}</template>
            </vxe-column>
            <vxe-column field="avg_per_box" :title="$t('avg-per-box')" :min-width="200">
              <template #default="{ rowIndex }">{{ form.pallets[rowIndex].avg_per_box }}</template>
            </vxe-column>
            <vxe-column field="actions" :title="$t('actions')" :width="80" align="center" fixed="right">
              <template #default="{ rowIndex }">
                <div class="flex items-center justify-center">
                  <el-popconfirm
                    v-if="form.pallets.length > 1"
                    :title="$t('are-you-sure-to-delete-this')"
                    @confirm="deletePallet(rowIndex)"
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
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="lotInstallment?.id ? 'warning' : 'primary'"
          :loading="loading"
          :disabled="Boolean(loading || isLotInstallmentInvalid)"
          @click="save()"
        >
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="$dialog.close('create_edit_lot_installment')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { timeToFloat, floatToTime, isQFS, useDialog } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { DATE_FORMAT, DATE_FORMAT_API } from '@/constants'
import { useReceptionStore } from '@/stores/reception'
import { useCultivationStore } from '@/stores/cultivation'
import { useSiteStore } from '@/stores/site'
import { useLotInstallmentStore } from '@/stores/lotInstallment'
import { useUnityStore } from '@/stores/unity'

const receptionStore = useReceptionStore()
const cultivationStore = useCultivationStore()
const siteStore = useSiteStore()
const lotInstallmentStore = useLotInstallmentStore()
const unityStore = useUnityStore()

const initForm = {
  code: null,
  site_id: null,
  variety_id: null,
  cultivation_id: null,
  unity_ids: [],
  timeline: [],
  pallets: [],
}

const props = defineProps({
  lotInstallment: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const xTable = ref(null)
const formRef = ref(null)
const form = ref(initForm)
const loading = ref(false)
const tableLoading = ref(false)

watch(
  () => props.lotInstallment,
  (newVal) => {
    if (newVal?.id) {
      const { id, code, timeline, pivot_pallets } = newVal
      const unity_ids = []
      const timelineData = timeline.map((time) => ({
        ...time,
        break_time: dayjs().format(`${DATE_FORMAT_API} ${floatToTime(time.break_time)}`),
      }))

      const pallets = pivot_pallets.map((el) => {
        const pallet = receptionStore.getPallets.find((el) => el.pallet_id === el.pallet_id)

        if (!unity_ids.includes(el.pallet.unity_id)) {
          unity_ids.push(el.pallet.unity_id)
        }

        return {
          ...el,
          arrival_hour: `${dayjs(pallet.arrival_hour).format(DATE_FORMAT)} ${dayjs(
            pallet.arrival_hour,
          ).format('HH:mm')}`,
          by_kilogram: el.pallet.unity.by_kilogram,
          max_boxes_nbr: el.nbr_boxes + getPalletNbrBoxesLeft(el.pallet_id),
        }
      })

      const pallet = {
        id,
        code: isQFS ? code : +code,
        cultivation_id: pivot_pallets[0].pallet.cultivation_id,
        site_id: pivot_pallets[0].pallet.site_id,
        unity_ids,
        variety_id: pivot_pallets[0].pallet.unity.variety_id,
        timeline: timelineData,
        pallets,
      }

      form.value = Object.assign({}, pallet)
    } else {
      form.value = {
        ...initForm,
        code: lotInstallmentStore.latestLotInstallment,
        pallets: [{}],
        timeline: [{}],
      }
    }
  },
)

watch(
  () => form.value.code,
  (newVal, oldVal) => {
    if (isQFS) {
      form.value.code = /^[0-9a-zA-Z_-]*$/.test(newVal) ? newVal : oldVal
    } else {
      form.value.code = /^\d*$/.test(newVal) ? newVal : oldVal
    }
  },
)

const rules = ref({
  code: [
    {
      required: true,
      message: t('please-input-lot-installment-nbr'),
      trigger: 'blur',
    },
  ],
})

const filteredPallets = computed(() => {
  const { cultivation_id, unity_ids, pallets } = form.value

  return receptionStore.getPallets.filter(
    (el) =>
      el.cultivation_id == cultivation_id &&
      unity_ids?.includes(el.unity_id) &&
      el.status != receptionStore.status[2].value &&
      !pallets.map(({ pallet_id }) => pallet_id).includes(el.pallet_id),
  )
})

const filteredVarieties = computed(() => {
  const { site_id } = form.value

  return site_id ? siteStore.sites.find((el) => el.id == site_id)?.varieties : []
})

const filteredCultivations = computed(() => {
  const { site_id, variety_id } = form.value

  const cultivations = cultivationStore.cultivations.filter(
    (el) => (!site_id || el.parcel.site_id === site_id) && (!variety_id || el.variety_id === variety_id),
  )

  if (props.lotInstallment?.id) {
    const { cultivation } = props.lotInstallment.pivot_pallets[0].pallet

    if (!cultivations.some((el) => el.id == cultivation.id)) {
      cultivations.unshift(cultivation)
    }
  }

  return cultivations
})

const filteredUnities = computed(() => {
  const { variety_id } = form.value

  return unityStore.unities.filter((el) => el.variety_id == variety_id)
})

const isLotInstallmentInvalid = computed(() => {
  return (
    !form.value.code ||
    !form.value.timeline.length ||
    form.value.timeline.filter(({ invalid }) => invalid).length ||
    !form.value.pallets.length ||
    form.value.pallets.filter(({ invalid }) => invalid).length
  )
})

const isPalletRowInvalid = ({ rowIndex }) => {
  const row = form.value.pallets[rowIndex]

  if (!row?.pallet_id || !row?.nbr_boxes) {
    form.value.pallets[rowIndex].invalid = true
    return 'bg-red-50'
  }

  form.value.pallets[rowIndex].invalid = false
}

const onPalletChange = (index) => {
  const pallet = receptionStore.getPallets.find(
    ({ pallet_id }) => pallet_id == form.value.pallets[index].pallet_id,
  )
  const { avg_per_box, nbr_boxes, net_weight, arrival_hour, unity_id, pallet_id } = pallet

  form.value.pallets[index] = {
    pallet_id,
    nbr_boxes,
    avg_per_box,
    net_weight,
    arrival_hour: `${dayjs(arrival_hour).format(DATE_FORMAT)} ${dayjs(arrival_hour).format('HH:mm')}`,
    by_kilogram: unityStore.unities.find(({ id }) => id == unity_id)?.by_kilogram,
    max_boxes_nbr: getPalletNbrBoxesLeft(pallet_id),
  }
}

const onNbrBoxesChanged = (index) => {
  form.value.pallets[index].net_weight = (
    form.value.pallets[index].nbr_boxes * form.value.pallets[index].avg_per_box
  ).toFixed(2)
}

const newPallet = () => {
  tableLoading.value = true

  form.value.pallets.unshift({ id: +new Date() })

  reloadTable()
}

const deletePallet = (index) => {
  form.value.pallets.splice(index, 1)

  reloadTable()
}

const reloadTable = () => {
  setTimeout(() => {
    xTable.value.loadData(form.value.pallets)
    tableLoading.value = false
  }, 250)
}

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      const timeline = form.value.timeline.map((el) => ({
        added_at: dayjs(el.added_at).format(),
        start_time: dayjs(el.start_time).format(),
        break_time: timeToFloat(el.break_time),
        end_time: dayjs(el.end_time).format(),
      }))

      const { code, pallets } = form.value
      if (form.value?.id) {
        lotInstallmentStore
          .update({ id: form.value.id, code, timeline, pallets })
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        lotInstallmentStore
          .create({ code, timeline, pallets })
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_lot_installment')

  loading.value = false
  form.value = initForm

  emit('reload')
}

const addTimeLine = () => {
  const time = { id: +new Date() }
  form.value.timeline = [time, ...form.value.timeline]
}

const deleteTime = (index) => {
  const time = Object.assign({}, form.value.timeline[index])

  form.value.timeline = form.value.timeline.filter(({ id }) => id !== time.id)
}

const isTimelineRowInvalid = ({ rowIndex }) => {
  const row = form.value.timeline[rowIndex]

  if (!row?.added_at || !row?.start_time || !row?.break_time || !row?.end_time) {
    form.value.timeline[rowIndex].invalid = true

    return 'bg-red-50'
  }

  form.value.timeline[rowIndex].invalid = false
}

const hasPalletData = computed(() => {
  return form.value.pallets.filter(({ pallet_id }) => pallet_id)?.length
})

const resetCols = (cols = []) => {
  form.value.pallets = [{ id: +new Date() }]

  cols.forEach((col) => (form.value[col] = Array.isArray(form.value[col]) ? [] : null))
}

const getPalletNbrBoxesLeft = (pallet_id) => {
  return receptionStore.limiters.find((el) => el.pallet_id == pallet_id)?.nbr_boxes_left ?? 0
}
</script>
