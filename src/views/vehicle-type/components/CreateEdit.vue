<template>
  <el-dialog
    draggable
    :title="$t(vehicleType?.id ? 'edit-vehicle-type' : 'create-new-vehicle-type')"
    :model-value="$dialog.visible('create_edit_vehicle_type')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_vehicle_type')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-2">
          <div class="col-span-1">
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('group')" prop="group">
              <el-select v-model="form.group" class="w-full">
                <el-option
                  v-for="group in vehicleTypeStore.vehicleTypeGroups"
                  :key="group.value"
                  :label="$t(group.label)"
                  :value="group.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-if="isNbrPlaceRequired" class="col-span-1">
            <el-form-item :label="$t('nbr-place-min')" prop="nbr_place_min">
              <el-input-number
                v-model="form.nbr_place_min"
                class="!w-full"
                :min="1"
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
                controls-position="right"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="vehicleType?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_vehicle_type')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useDialog } from '@/helpers'
import { t } from '@/plugins'
import { computed, reactive, ref, watch } from 'vue'

import { useVehicleTypeStore } from '@/stores/vehicleTypes'

const props = defineProps({
  vehicleType: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const vehicleTypeStore = useVehicleTypeStore()

const initForm = reactive({
  name: null,
  group: null,
  nbr_place_min: null,
  nbr_place_max: null,
})

const loading = ref(false)
const form = ref(initForm)
const formRef = ref()

const rules = reactive({
  name: [
    {
      required: true,
      message: t('please-input-name'),
      trigger: 'blur',
    },
  ],
  group: [
    {
      required: true,
      message: t('please-select-group'),
      trigger: 'blur',
    },
  ],
  nbr_place_min: [
    {
      required: true,
      message: t('please-input-number-place-min'),
      trigger: 'blur',
    },
  ],
  nbr_place_max: [
    {
      required: true,
      message: t('please-input-number-place-max'),
      trigger: 'blur',
    },
  ],
})
const isNbrPlaceRequired = computed(() => {
  return vehicleTypeStore.getFilteredGroups.map(({ value }) => value).includes(form.value.group)
})

watch(
  () => props.vehicleType,
  (newVal) => {
    if (newVal) {
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
      if (!isNbrPlaceRequired.value) {
        form.value.nbr_place_min = null
        form.value.nbr_place_max = null
      }
      if (form.value?.id) {
        vehicleTypeStore
          .updateVehicleType(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        vehicleTypeStore
          .newVehicleType(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_vehicle_type')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
