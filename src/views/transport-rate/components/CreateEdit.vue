<template>
  <el-dialog
    draggable
    :title="$t(transportRate?.id ? 'update-transport-rate' : 'add-new-transport-rate')"
    :model-value="useDialog.visible('create_edit_transport_rate')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_transport_rate')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-4 gap-x-5">
          <div class="col-span-3">
            <el-form-item :label="$t('itinerary')" prop="itinerary_id">
              <el-select v-model="form.itinerary_id" class="!w-full" @change="onItineraryChange">
                <el-option
                  v-for="itinerary in itineraryOptions"
                  :key="itinerary.id"
                  :label="itinerary.label"
                  :value="itinerary.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1 h-full flex items-center">
            <template v-if="form.itinerary_id">
              <span class="pr-2">{{ $t('distance') }} :</span>
              <span>{{ form.distance }}</span>
            </template>
          </div>
          <div class="col-span-3">
            <el-form-item :label="$t('vehicle-type')" prop="vehicle_type_id">
              <el-select v-model="form.vehicle_type_id" class="!w-full" @change="onTypeChange">
                <el-option
                  v-for="type in vehicleTypeStore.vehicleTypes"
                  :key="type.id"
                  :label="type.name"
                  :value="type.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1 h-full flex items-center">
            <template v-if="isNbrPlaceRequired">
              <span class="pr-2">{{ $t('min') }} :</span>
              <span>{{ vehicleType?.nbr_place_min || 0 }} /</span>
              <span class="pr-2">{{ $t('max') }} :</span>
              <span>{{ vehicleType?.nbr_place_max || 0 }}</span>
            </template>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('place-rate')" prop="place_rate">
              <el-input-number v-model="form.place_rate" class="!w-full"></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('trip-rate')" prop="trip_rate">
              <el-input-number v-model="form.trip_rate" class="!w-full"></el-input-number>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="transportRate?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_transport_rate')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { t } from '@/plugins'
import { useDialog } from '@/helpers'

import { useTransportRateStore } from '@/stores/transportRate'
import { useVehicleTypeStore } from '@/stores/vehicleTypes'
import { useItineraryStore } from '@/stores/itinerary'
import { useSiteStore } from '@/stores/site'
import { useDepartureStore } from '@/stores/departure'

const formInit = {
  itinerary_id: null,
  distance: null,
  vehicle_type_id: null,
  place_rate: null,
  trip_rate: null,
}

const props = defineProps({
  transportRate: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const form = ref(formInit)
const formRef = ref(null)

const transportRateStore = useTransportRateStore()
const vehicleTypeStore = useVehicleTypeStore()
const itineraryStore = useItineraryStore()
const siteStore = useSiteStore()
const departureStore = useDepartureStore()

const rules = reactive({
  itinerary_id: [
    {
      required: true,
      message: t('please-select-itinerary'),
      trigger: 'blur',
    },
  ],
  vehicle_type_id: [
    {
      required: true,
      message: t('please-select-vehicle-type'),
      trigger: 'blur',
    },
  ],
  place_rate: [
    {
      required: true,
      message: t('please-input-place-rate'),
      trigger: 'blur',
    },
  ],
  trip_rate: [
    {
      required: true,
      message: t('please-input-trip-rate'),
      trigger: 'blur',
    },
  ],
})

const itineraryOptions = computed(() => {
  return itineraryStore.itineraries.map((el) => {
    const site = siteStore.sites.find(({ id }) => id == el.site_id)
    const departure = departureStore.departures.find(({ id }) => id == el.departure_id)

    return {
      ...el,
      label: `${departure.label} ${t('to')} ${site.name}`,
    }
  })
})

const isNbrPlaceRequired = computed(() => {
  const group = vehicleTypeStore.vehicleTypes.find(({ id }) => id == form.value.vehicle_type_id)?.group

  return vehicleTypeStore.getFilteredGroups.map(({ value }) => value).includes(group)
})

const vehicleType = computed(() => {
  return vehicleTypeStore.vehicleTypes.find(({ id }) => id == form.value.vehicle_type_id)
})

watch(
  () => props.transportRate,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, { ...newVal, distance: newVal.itinerary.distance })
    } else {
      form.value = formInit
    }
  },
)

const isBetween = (nbr, min, max) => {
  return nbr >= min && nbr <= max
}

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      if (form.value?.id) {
        transportRateStore
          .update(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        transportRateStore
          .new(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_transport_rate')
  loading.value = false
  form.value = formInit
  emit('reload')
}

const onItineraryChange = () => {
  form.value.distance = itineraryOptions.value.find(({ id }) => id == form.value.itinerary_id).distance
  if (form.value.vehicle_type_id) {
    setPlaceRate()
    setTripRate()
  }
}

const setPlaceRate = () => {
  const { distance } = form.value

  form.value.place_rate =
    vehicleType.value?.vehicle_type_rates?.find((el) => isBetween(distance, el.min, el.max))?.rate || 0
}

const setTripRate = () => {
  form.value.trip_rate = vehicleType.value?.nbr_place_max * form.value.place_rate
}

const onTypeChange = () => {
  setPlaceRate()
  setTripRate()
}
</script>
