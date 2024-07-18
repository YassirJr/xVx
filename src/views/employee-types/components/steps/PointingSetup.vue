<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
    <div class="grid grid-cols-4 gap-x-5">
      <div class="col-span-2">
        <el-form-item prop="nbr_hours" :label="$t('number-of-normal-hours')">
          <el-radio-group v-model="form.nbr_hours" class="!w-full">
            <el-radio-button
              v-for="(item, index) in employeeTypeStore.getFilteredNbrHours"
              :key="index"
              class="!w-1/3"
              :label="item.value"
            >
              <template #default>
                {{ item.label }}
              </template>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item prop="auto_pause" :label="$t('auto-pause')">
          <el-input-number
            v-model="form.auto_pause"
            class="!w-full"
            :precision="2"
            :min="0"
            :max="24"
          ></el-input-number>
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item prop="fixed_time" :label="$t('fixed-time')">
          <el-input-number
            v-model="form.fixed_time"
            class="!w-full"
            :precision="2"
            :min="0"
            :max="24"
          ></el-input-number>
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item prop="day_off" :label="$t('day-off')">
          <el-select v-model="form.day_off" class="!w-full" clearable filterable>
            <el-option
              v-for="day in employeeTypeStore.weekdays"
              :key="day.value"
              :label="$t(day.label)"
              :value="day.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="col-span-2">
        <el-form-item prop="type_day_off" :label="$t('type-day-off')">
          <el-radio-group v-model="form.type_day_off" class="!w-full">
            <el-radio-button
              v-for="(item, index) in employeeTypeStore.dayOffTypes"
              :key="index"
              class="!w-1/2"
              :label="item.value"
            >
              <template #default>
                {{ $t(item.label) }}
              </template>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item prop="nbr_days_per_period" :label="$t('days-per-period')">
          <el-input-number
            v-model="form.nbr_days_per_period"
            class="!w-full"
            :min="0"
            :max="31"
          ></el-input-number>
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item prop="calc_day_off" :label="$t('calculate-extra-hours-day-off')">
          <el-switch v-model="form.calc_day_off" :active-text="$t('yes')" :inactive-text="$t('no')" />
        </el-form-item>
      </div>
      <div
        :class="`${
          form.source_pointing_hours == employeeTypeStore.pointingHourSources[0].value
            ? 'col-span-1'
            : 'col-span-2'
        }`"
      >
        <el-form-item prop="source_pointing_hours" :label="$t('source-pointing-hours')">
          <el-select v-model="form.source_pointing_hours" class="!w-full" clearable filterable>
            <el-option
              v-for="source in employeeTypeStore.pointingHourSources"
              :key="source.value"
              :label="$t(source.label)"
              :value="source.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div
        v-if="form.source_pointing_hours == employeeTypeStore.pointingHourSources[0].value"
        class="col-span-1"
      >
        <el-form-item prop="calc_extra_hours" :label="$t('calc-extra-hours')">
          <el-switch v-model="form.calc_extra_hours" :active-text="$t('yes')" :inactive-text="$t('no')" />
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item prop="source_pointing_unities" :label="$t('source-pointing-unities')">
          <el-select v-model="form.source_pointing_unities" class="!w-full" clearable filterable>
            <el-option
              v-for="source in employeeTypeStore.pointingUnitySources"
              :key="source.value"
              :label="$t(source.label)"
              :value="source.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item
          prop="start_hour_extra_25"
          :label="$t(isQFS ? 'start-hour-extra-25-40' : 'start-hour-extra-25')"
        >
          <el-time-picker v-model="form.start_hour_extra_25" class="!w-full"></el-time-picker>
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item
          prop="end_hour_extra_25"
          :label="$t(isQFS ? 'end-hour-extra-25-40' : 'end-hour-extra-25')"
        >
          <el-time-picker v-model="form.end_hour_extra_25" class="!w-full"></el-time-picker>
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item
          prop="start_hour_extra_50"
          :label="$t(isQFS ? 'start-hour-extra-60' : 'start-hour-extra-50')"
        >
          <el-time-picker v-model="form.start_hour_extra_50" class="!w-full"></el-time-picker>
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item prop="end_hour_extra_50" :label="$t(isQFS ? 'end-hour-extra-60' : 'end-hour-extra-50')">
          <el-time-picker v-model="form.end_hour_extra_50" class="!w-full"></el-time-picker>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { t } from '@/plugins'
import { isQFS } from '@/helpers'

const initForm = {
  nbr_hours: null,
  auto_pause: null,
  fixed_time: null,
  day_off: null,
  type_day_off: null,
  calc_day_off: false,
  source_pointing_hours: null,
  calc_extra_hours: false,
  source_pointing_unities: null,
  start_hour_extra_25: null,
  end_hour_extra_25: null,
  start_hour_extra_50: null,
  end_hour_extra_50: null,
  nbr_days_per_period: 13,
}

const props = defineProps({
  type: {
    type: Object,
    default: () => {},
  },
})

const formRef = ref(null)
const form = ref(initForm)

const employeeTypeStore = useEmployeeTypeStore()

const rules = reactive({
  nbr_hours: [
    {
      required: true,
      message: t('please-select-number-of-normal-hours'),
      trigger: 'blur',
    },
  ],
  auto_pause: [
    {
      required: true,
      message: t('please-input-auto-pause'),
      trigger: 'blur',
    },
  ],
  fixed_time: [
    {
      required: true,
      message: t('please-input-fixed-time'),
      trigger: 'blur',
    },
  ],
  day_off: [
    {
      required: true,
      message: t('please-select-day-off'),
      trigger: 'blur',
    },
  ],
  type_day_off: [
    {
      required: true,
      message: t('please-select-type-day-off'),
      trigger: 'blur',
    },
  ],
  source_pointing_hours: [
    {
      required: true,
      message: t('please-select-source-pointing-hours'),
      trigger: 'blur',
    },
  ],
  start_hour_extra_25: [
    {
      required: true,
      message: t('please-input-start-hour-extra'),
      trigger: 'blur',
    },
  ],
  end_hour_extra_25: [
    {
      required: true,
      message: t('please-input-end-hour-extra'),
      trigger: 'blur',
    },
  ],
  start_hour_extra_50: [
    {
      required: true,
      message: t('please-input-start-hour-extra'),
      trigger: 'blur',
    },
  ],
  end_hour_extra_50: [
    {
      required: true,
      message: t('please-input-end-hour-extra'),
      trigger: 'blur',
    },
  ],
  nbr_days_per_period: [
    {
      required: true,
      message: t('please-input-days-per-period'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => form.value.source_pointing_hours,
  (newVal) => {
    if (newVal != undefined) {
      form.value.calc_extra_hours = !(newVal != employeeTypeStore.pointingHourSources[0].value)
    }
  },
)

const setForm = (data) => {
  if (data?.id) {
    Object.keys(form.value).forEach((key) => {
      form.value[key] = data[key]
    })
  } else {
    form.value = initForm
  }
}

onMounted(() => setForm(props.type))

watch(
  () => props.type,
  (newVal) => setForm(newVal),
)

defineExpose({
  form,
  formRef,
})
</script>
