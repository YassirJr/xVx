<template>
  <el-dialog
    draggable
    :title="$t(cultivation?.id ? 'edit-cultivation' : 'create-new-cultivation')"
    :model-value="useDialog.visible('create_edit_cultivation')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_cultivation')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-6 gap-x-5">
          <div class="col-span-2">
            <el-form-item :label="$t('drilling-code')" prop="code">
              <el-input v-model="form.code" class="!w-full"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('season')" prop="season">
              <el-input-number
                v-model="form.season"
                class="!w-full"
                :controls="false"
                :max="9999"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('cycle')" prop="cycle">
              <el-select v-model="form.cycle" clearable filterable class="w-full">
                <el-option
                  v-for="(cycle, index) in cultivationStore.cycles"
                  :key="index"
                  :label="$t(cycle.label)"
                  :value="cycle.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('site')" prop="site_id">
              <el-select v-model="form.site_id" clearable filterable class="w-full" @change="onSiteChange()">
                <el-option
                  v-for="(site, index) in siteStore.sites"
                  :key="index"
                  :label="site.name"
                  :value="site.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('variety')" prop="variety_id">
              <el-select-v2
                v-model="form.variety_id"
                class="w-full"
                clearable
                filterable
                :options="filteredVarieties"
                value-key="id"
                @change="onVarietyChange()"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('variety-field')" prop="variety_field_id">
              <el-select v-model="form.variety_field_id" class="w-full" clearable>
                <el-option
                  v-for="(varietyField, i) in filteredVarietyField"
                  :key="i"
                  :label="varietyField.label"
                  :value="varietyField.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item :label="$t('sowing-date')" prop="sowing_date">
              <el-date-picker
                v-model="form.sowing_date"
                class="!w-full"
                :format="DATE_FORMAT"
                :disabled-date="disabledSowingDates"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item :label="$t('uprooting-date')" prop="uprooting_date">
              <el-date-picker
                v-model="form.uprooting_date"
                class="!w-full"
                :format="DATE_FORMAT"
                :disabled-date="disabledUprootingDates"
              ></el-date-picker>
            </el-form-item>
          </div>

          <div v-if="form.parcels?.length" class="col-span-6">
            <el-divider></el-divider>
          </div>
          <div v-if="form.parcels?.length" class="col-span-6">
            <div class="grid grid-cols-3 gap-x-5">
              <template v-for="(parcel, index) in form.parcels" :key="index">
                <div class="col-span-2">
                  <el-form-item :label="$t('parcel')">
                    <el-select-v2
                      v-model="parcel.id"
                      class="w-full"
                      clearable
                      filterable
                      :disabled="Boolean(props.cultivation?.id)"
                      value-key="id"
                      :options="filteredParcelsBySite"
                      @change="onParcelChanges(parcel)"
                    ></el-select-v2>
                  </el-form-item>
                </div>
                <div class="col-span-1 text-right px-2 my-auto">
                  <strong class="inline-block mr-2">{{ $t('available-surface') }}:</strong>
                  {{ getParcelAvailableSurface(parcel) }}
                </div>
                <div v-if="parcel?.id" class="col-span-3">
                  <div class="grid grid-cols-3 gap-x-5">
                    <div class="col-span-3">
                      <el-divider></el-divider>
                    </div>
                    <div class="col-span-1">
                      <el-form-item :label="$t('opened-surface')" prop="available_surface">
                        <el-input-number
                          v-model="form.available_surface"
                          class="!w-full"
                          :precision="2"
                          :step="0.1"
                          :min="0"
                          :max="maxSurface(parcel.id)"
                          :disabled="Boolean(props.cultivation?.id)"
                        ></el-input-number>
                      </el-form-item>
                    </div>
                    <div class="col-span-1">
                      <el-form-item :label="$t('arrached-surface')" prop="arrached_surface">
                        <el-input-number
                          v-model="form.arrached_surface"
                          class="!w-full"
                          :precision="2"
                          :step="0.1"
                          :min="0"
                          :max="maxSurface(parcel.id)"
                          :disabled="!Boolean(props.cultivation?.id)"
                        ></el-input-number>
                      </el-form-item>
                    </div>
                    <div class="col-span-1 text-right px-2 my-auto">
                      <strong class="inline-block mr-2">{{ $t('total-surface') }}:</strong>
                      {{ totalSurfaces }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="cultivation?.id ? 'warning' : 'primary'"
          :loading="loading"
          :disabled="loading || hasParcels || form.available_surface + form.arrached_surface == 0"
          @click="save()"
        >
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="useDialog.close('create_edit_cultivation')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useDialog, isQFS, isGanFruits } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { DATE_FORMAT } from '@/constants'
import { reactive, ref, watch, computed } from 'vue'
import { useCultivationStore } from '@/stores/cultivation'
import { useSiteStore } from '@/stores/site'
import { useVarietyStore } from '@/stores/variety'
import { useParcelStore } from '@/stores/parcel'
import { useVarietyFieldStore } from '@/stores/varietyField'

const props = defineProps({
  cultivation: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const initForm = {
  code: null,
  season: +dayjs().format('YYYY'),
  site_id: null,
  parcels: [],
  variety_id: null,
  sowing_date: null,
  uprooting_date: null,
  arrached_surface: 0,
  available_surface: null,
  variety_field_id: null,
  cycle: null,
  total_surface: null,
}

const loading = ref(false)
const formRef = ref()
const form = ref(initForm)

const cultivationStore = useCultivationStore()
const varietyFieldStore = useVarietyFieldStore()
const varietyStore = useVarietyStore()
const siteStore = useSiteStore()
const parcelStore = useParcelStore()

const onSiteChange = () => {
  form.value = Object.assign(
    {},
    {
      ...form.value,
      variety_id: null,
      sowing_date: null,
      uprooting_date: null,
      variety_field_id: null,
      parcels: [{ id: null, surface: 0 }],
    },
  )
}

const filteredVarieties = computed(() => {
  const site = siteStore.sites.find(({ id }) => id === form.value?.site_id)
  return site?.varieties?.length ? site?.varieties.map((el) => ({ ...el, label: el.name })) : []
})

const onVarietyChange = () => {
  form.value = Object.assign(
    {},
    {
      ...form.value,
      sowing_date: null,
      uprooting_date: null,
      variety_field_id: null,
    },
  )
}

const hasParcels = computed(() => {
  return !form.value.parcels.filter(({ id }) => Boolean(id)).length
})

const onParcelChanges = (parcel) => {
  form.value.parcels[0].surface = maxSurface(parcel.id)
  form.value.available_surface = getParcelAvailableSurface(parcel)
}

const totalSurfaces = computed(() => {
  if (!props.cultivation?.id) {
    return form.value.arrached_surface + form.value.available_surface
  } else {
    return props.cultivation.total_surface
  }
})

const filteredParcelsBySite = computed(() => {
  return parcelStore.parcels
    .filter(({ site_id }) => site_id == form.value.site_id)
    .map((el) => ({ ...el, label: el.name }))
})

const rules = reactive({
  code: [
    {
      required: true,
      message: t('please-input-drilling-code'),
      trigger: 'blur',
    },
  ],
  season: [
    {
      required: true,
      message: t('please-input-season'),
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
  sowing_date: [
    {
      required: true,
      message: t('please-select-sowing-date'),
      trigger: 'blur',
    },
  ],
  uprooting_date: [
    {
      required: true,
      message: t('please-select-uprooting-date'),
      trigger: 'blur',
    },
  ],
  parcels: [
    {
      type: 'array',
      required: true,
      message: t('please-select-parcel'),
      trigger: 'blur',
    },
  ],
  variety_id: [
    {
      required: true,
      message: t('please-select-variety'),
      trigger: 'blur',
    },
  ],
  arrached_surface: [
    {
      required: true,
      message: t('please-input-arrached-surface'),
      trigger: 'blur',
    },
  ],
  available_surface: [
    {
      required: true,
      message: t('please-input-available-surface'),
      trigger: 'blur',
    },
  ],
  cycle: [
    {
      required: true,
      message: t('please-input-cycle'),
      trigger: 'blur',
    },
  ],
  variety_field_id: [
    {
      required: true,
      message: t('please-select-variety-field'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.cultivation,
  (newVal) => {
    if (newVal?.id) {
      const { parcel_id, parcel, surface, sowing_date, uprooting_date } = newVal

      form.value = Object.assign(
        {},
        {
          ...newVal,
          site_id: parcel.site_id,
          parcels: [{ id: parcel_id, surface }],
          sowing_date: dayjs(sowing_date).toString(),
          uprooting_date: dayjs(uprooting_date).toString(),
        },
      )
    } else {
      form.value = Object.assign({}, initForm)
    }
  },
)

watch(
  () => form.value.sowing_date,
  (newVal) => {
    if (form.value.variety_id && !props.cultivation?.id) {
      const nbr_days = varietyStore.varieties.find(({ id }) => id === form.value.variety_id)?.nbr_days ?? 0
      const sowingDate = dayjs(newVal)

      form.value.uprooting_date = sowingDate.add(nbr_days, 'day').toString()
    }
  },
)

watch(
  () => form.value.code,
  (newVal, oldVal) => {
    if (newVal) {
      if (isQFS || isGanFruits) {
        form.value.code = /^[0-9a-zA-Z_-]*$/.test(newVal) ? newVal : oldVal
      } else {
        form.value.code = /^\d+$/.test(newVal) ? newVal : oldVal
      }
    }
  },
)

watch(
  () => form.value.arrached_surface,
  (newVal) => {
    const cultivation = props.cultivation

    if (cultivation?.id) {
      form.value.available_surface = +(cultivation.total_surface - newVal).toFixed(2)
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    const { sowing_date, uprooting_date } = form.value

    form.value = Object.assign(
      {},
      {
        ...form.value,
        sowing_date: dayjs(sowing_date).format(),
        uprooting_date: dayjs(uprooting_date).format(),
      },
    )

    if (valid) {
      loading.value = true
      form.value.parcels = form.value.parcels.filter(({ id }) => Boolean(id))
      const {
        code,
        season,
        site_id,
        variety_id,
        sowing_date,
        uprooting_date,
        arrached_surface,
        available_surface,
        variety_field_id,
        cycle,
      } = form.value
      const data = form.value.parcels.map(({ id, surface }) => {
        return {
          id: form.value?.id,
          parcel_id: id,
          surface,
          code,
          season,
          site_id,
          variety_id,
          sowing_date,
          uprooting_date,
          arrached_surface,
          available_surface,
          variety_field_id,
          cycle,
        }
      })

      if (form.value?.id) {
        cultivationStore
          .updateCultivation(data[0])
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        cultivationStore
          .newCultivation(data[0])
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_cultivation')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')

  // Reload parcels to get available surface
  parcelStore.fetchAllParcels()
}

const maxSurface = (parcelId) => {
  let surface = 0

  if (form.value?.id) {
    surface = form.value.total_surface
  } else {
    const parcel = filteredParcelsBySite.value.find(({ id }) => id == parcelId)

    surface = parcel?.available_surface ?? 0
  }

  return surface > 0 ? +surface.toFixed(2) : 0
}

const disabledSowingDates = (time) => {
  return form.value.uprooting_date && form.value.uprooting_date < time.getTime()
}

const disabledUprootingDates = (time) => {
  return form.value.sowing_date > time.getTime()
}

const getParcelAvailableSurface = (parcel) => {
  return filteredParcelsBySite.value.find(({ id }) => id == parcel?.id)?.available_surface ?? 0
}

const filteredVarietyField = computed(() => {
  return varietyFieldStore.varietyFields.filter(({ variety_id }) => variety_id === form.value.variety_id)
})
</script>
