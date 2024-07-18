<template>
  <el-dialog
    draggable
    :title="$t(farmTrackLoad?.id ? 'update-farm-track-load' : 'add-new-farm-track-load')"
    :model-value="useDialog.visible('create_edit_farm_track_load')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_farm_track_load')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-3 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('code')" prop="track_loader_id">
              <el-input
                v-model="form.track_loader_id"
                class="!w-full"
                :disabled="Boolean(farmTrackLoad?.id)"
              ></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('site')" prop="site_id">
              <el-select-v2
                v-model="form.site_id"
                class="w-full"
                clearable
                filterable
                :options="siteStore.getSites"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('variety')" prop="variety_id">
              <el-select-v2
                v-model="form.variety_id"
                class="w-full"
                clearable
                filterable
                :options="varietyStore.getVarieties"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('unity')" prop="unity_id">
              <el-select-v2
                v-model="form.unity_id"
                class="w-full"
                clearable
                filterable
                :options="unityStore.getUnities"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('vehicle')" prop="vehicle_id">
              <el-select-v2
                v-model="form.vehicle_id"
                class="w-full"
                clearable
                filterable
                :options="vehicleStore.getVehicles"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('parcel')" prop="parcel_id">
              <el-select-v2
                v-model="form.parcel_id"
                class="w-full"
                clearable
                filterable
                :options="parcelStore.parcels.map((el) => ({ ...el, label: el.name }))"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('leader')" prop="leader_id">
              <el-select-v2
                v-model="form.leader_id"
                clearable
                filterable
                :reserve-keyword="false"
                :options="leadersOptions"
                value-key="id"
                class="w-full"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('number-of-unities')" prop="nbr_unities">
              <el-input-number v-model="form.nbr_unities" class="!w-full" :min="0" />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('added-at')" prop="added_at">
              <el-date-picker
                v-model="form.added_at"
                type="datetime"
                class="!w-full"
                format="DD-MM-YYYY HH:mm"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="farmTrackLoad?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_farm_track_load')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useDialog } from '@/helpers'
import { ref, reactive, watch, computed } from 'vue'
import { t, dayjs } from '@/plugins'
import { useFarmTrackLoadStore } from '@/stores/farmTrackLoad'
import { useSiteStore } from '@/stores/site'
import { useEmployeeStore } from '@/stores/employee'
import { useVehicleStore } from '@/stores/vehicle'
import { useParcelStore } from '@/stores/parcel'
import { useUnityStore } from '@/stores/unity'
import { useVarietyStore } from '@/stores/variety'

const initForm = {
  track_loader_id: null,
  site_id: null,
  variety_id: null,
  unity_id: null,
  vehicle_id: null,
  parcel_id: null,
  leader_id: null,
  nbr_unities: null,
  added_at: null,
}

const props = defineProps({
  farmTrackLoad: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const form = ref(initForm)
const formRef = ref(null)

const farmTrackLoadStore = useFarmTrackLoadStore()
const employeeStore = useEmployeeStore()
const varietyStore = useVarietyStore()
const vehicleStore = useVehicleStore()
const parcelStore = useParcelStore()
const unityStore = useUnityStore()
const siteStore = useSiteStore()

const rules = reactive({
  track_loader_id: [
    {
      required: true,
      message: t('please-input-track-loader'),
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
  variety_id: [
    {
      required: true,
      message: t('please-select-variety'),
      trigger: 'blur',
    },
  ],
  unity_id: [
    {
      required: true,
      message: t('please-select-unity'),
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
  parcel_id: [
    {
      required: true,
      message: t('please-select-parcel'),
      trigger: 'blur',
    },
  ],
  leader_id: [
    {
      required: true,
      message: t('please-select-leader'),
      trigger: 'blur',
    },
  ],
  nbr_unities: [
    {
      required: true,
      message: t('please-input-nbr-unities'),
      trigger: 'blur',
    },
  ],
  added_at: [
    {
      required: true,
      message: t('please-select-date-and-time'),
      trigger: 'blur',
    },
  ],
})

const leadersOptions = computed(() => {
  return employeeStore.leaders.map((el) => ({
    ...el,
    label: `${el.firstname} ${el.lastname} (${el.uid})`,
  }))
})

watch(
  () => props.farmTrackLoad,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = Object.assign({}, initForm)
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      form.value = Object.assign(
        {},
        {
          ...form.value,
          added_at: dayjs(form.value.added_at).format(),
        },
      )

      if (form.value?.id) {
        farmTrackLoadStore
          .updateFarmTrackLoad(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        farmTrackLoadStore
          .newFarmTrackLoad([form.value])
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_farm_track_load')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
