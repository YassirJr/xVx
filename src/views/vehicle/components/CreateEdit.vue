<template>
  <el-dialog
    draggable
    :title="$t(vehicle?.id ? 'edit-vehicle' : 'create-new-vehicle')"
    :model-value="$dialog.visible('create_edit_vehicle')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_vehicle')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('registration-nbr')" prop="registration_nbr">
              <el-input v-model="form.registration_nbr"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('type')" prop="type_id">
              <el-select v-model="form.type_id" clearable filterable class="w-full">
                <el-option
                  v-for="vehicleType in vehicleTypeStore.vehicleTypes"
                  :key="vehicleType.id"
                  :label="vehicleType.name"
                  :value="vehicleType.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('transporter')" prop="transporter_id">
              <el-select v-model="form.transporter_id" clearable filterable class="w-full">
                <el-option
                  v-for="transporter in transporterStore.transporters"
                  :key="transporter.id"
                  :label="transporter.name"
                  :value="transporter.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('nbr-place-legal')" prop="places_nbr">
              <el-input-number
                v-model="form.places_nbr"
                class="!w-full"
                :min="1"
                :max="100"
                controls-position="right"
              />
            </el-form-item>
          </div>
          <div v-if="isNbrPlaceRequired" class="col-span-1">
            <el-form-item :label="$t('nbr-place-min')" prop="nbr_place_min">
              <el-input-number
                v-model="form.nbr_place_min"
                class="!w-full"
                :min="1"
                :max="100"
                controls-position="right"
              />
            </el-form-item>
          </div>
          <div v-if="isNbrPlaceRequired" class="col-span-1">
            <el-form-item :label="$t('nbr-place-max')" prop="nbr_place_max">
              <el-input-number
                v-model="form.nbr_place_max"
                class="!w-full"
                :min="1"
                :max="100"
                controls-position="right"
              />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('calc-mode')" prop="calc_mode">
              <el-select v-model="form.calc_mode" clearable filterable class="w-full">
                <el-option
                  v-for="mode in vehicleStore.calcModes"
                  :key="mode.value"
                  :label="$t(mode.label)"
                  :value="mode.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('calc-average')" prop="calc_average">
              <el-switch v-model="form.calc_average" />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('calc-avg-per-grower')" prop="calc_avg_per_grower">
              <el-switch v-model="form.calc_avg_per_grower" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="vehicle?.id ? 'warning' : 'primary'"
          :loading="loading"
          :disabled="loading"
          @click="save()"
        >
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="$dialog.close('create_edit_vehicle')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { t } from '@/plugins'
import { useDialog } from '@/helpers'

import { useTransporterStore } from '@/stores/transporter'
import { useVehicleStore } from '@/stores/vehicle'
import { useVehicleTypeStore } from '@/stores/vehicleTypes'

const vehicleStore = useVehicleStore()
const vehicleTypeStore = useVehicleTypeStore()
const transporterStore = useTransporterStore()

const props = defineProps({
  vehicle: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const initForm = reactive({
  registration_nbr: null,
  transporter_id: null,
  type_id: null,
  places_nbr: 1,
  nbr_place_min: null,
  nbr_place_max: null,
  calc_mode: null,
  calc_average: false,
  calc_avg_per_grower: true,
})

const loading = ref(false)
const form = ref(null)
const formRef = ref()

const rules = reactive({
  registration_nbr: [
    {
      required: true,
      message: t('please-input-registration-number'),
      trigger: 'blur',
    },
  ],
  transporter_id: [
    {
      required: true,
      message: t('please-select-transporter'),
      trigger: 'blur',
    },
  ],
  type_id: [
    {
      required: true,
      message: t('please-select-vehicle-type'),
      trigger: 'blur',
    },
  ],
  places_nbr: [
    {
      required: true,
      message: t('please-input-places-number'),
      trigger: 'blur',
      type: 'integer',
      min: 1,
    },
  ],
  nbr_place_min: [
    {
      required: true,
      message: t('please-input-number-place-min'),
      trigger: 'blur',
      type: 'integer',
      min: 1,
    },
  ],
  nbr_place_max: [
    {
      required: true,
      message: t('please-input-number-place-max'),
      trigger: 'blur',
      type: 'integer',
      min: 1,
    },
  ],
  calc_mode: [
    {
      required: true,
      message: t('please-select-calc-mode'),
      trigger: 'blur',
    },
  ],
})

const selectedVehicleType = computed(() => {
  return vehicleTypeStore.vehicleTypes.find(({ id }) => id == form.value.type_id)
})

const isNbrPlaceRequired = computed(() => {
  const group = selectedVehicleType.value?.group

  return Boolean(vehicleTypeStore.getFilteredGroups.map(({ value }) => value).includes(group))
})

watch(
  () => props.vehicle,
  (newVal) => {
    form.value = Object.assign({}, newVal?.id ? newVal : initForm)
  },
)

watch(
  () => form.value?.type_id,
  () => {
    if (isNbrPlaceRequired.value) {
      form.value.nbr_place_min = selectedVehicleType.value?.nbr_place_min
      form.value.nbr_place_max = selectedVehicleType.value?.nbr_place_max
    }
  },
)
const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        vehicleStore
          .updateVehicle(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        vehicleStore
          .newVehicle(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_vehicle')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
