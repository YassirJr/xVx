<template>
  <el-dialog
    draggable
    :title="$t(vehicleTypeRate?.id ? 'edit-vehicle-type-rate' : 'create-new-vehicle-type-rate')"
    :model-value="useDialog.visible('create_edit_vehicle_type_rate')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_vehicle_type_rate')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-5">
          <div class="col-span-1">
            <el-form-item :label="$t('vehicle-type')" prop="vehicle_type_id">
              <el-select v-model="form.vehicle_type_id" class="!w-full">
                <el-option
                  v-for="type in vehicleTypeStore.vehicleTypes"
                  :key="type.id"
                  :label="type.name"
                  :value="type.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('min-kilometer')" prop="min">
              <el-input-number v-model="form.min" class="!w-full" :min="1" />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('max-kilometer')" prop="max">
              <el-input-number v-model="form.max" class="!w-full" :min="1" />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('price-per-place')" prop="rate">
              <el-input-number v-model="form.rate" class="!w-full" :min="1" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="vehicleTypeRate?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_vehicle_type_rate')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useDialog } from '@/helpers'
import { t } from '@/plugins'
import { useVehicleTypeStore } from '@/stores/vehicleTypes'

const props = defineProps({
  vehicleTypeRate: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const formRef = ref(null)
const form = ref({
  vehicle_type_id: null,
  min: null,
  max: null,
  rate: null,
})

const vehicleTypeStore = useVehicleTypeStore()
onMounted(() => vehicleTypeStore.fetchVehicleTypes({ list: true }))

const rules = reactive({
  vehicle_type_id: [
    {
      required: true,
      message: t('please-select-vehicle-type'),
      trigger: 'blur',
    },
  ],
  min: [
    {
      required: true,
      message: t('please-input-min'),
      trigger: 'blur',
    },
  ],
  max: [
    {
      required: true,
      message: t('please-input-max'),
      trigger: 'blur',
    },
  ],
  rate: [
    {
      required: true,
      message: t('please-input-price-per-place'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.vehicleTypeRate,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = {
        vehicle_type_id: null,
        min: null,
        max: null,
        rate: null,
      }
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      if (form.value?.id) {
        vehicleTypeStore
          .updateRate(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        vehicleTypeStore
          .newRate(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_vehicle_type_rate')

  loading.value = false

  form.value = {
    vehicle_type_id: null,
    min: null,
    max: null,
    rate: null,
  }
  emit('reload')
}
</script>
