<template>
  <el-form ref="formRef" :model="form" :rules="pointingSettingRules" label-position="top">
    <div class="grid grid-cols-4 gap-x-5">
      <div class="col-span-2">
        <el-form-item prop="nbr_hours" :label="$t('number-of-normal-hours')">
          <el-radio-group v-model="form.nbr_hours" class="!w-full">
            <el-radio-button
              v-for="(item, index) in empTypeStore.nbrHours"
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
      <div class="col-span-2">
        <el-form-item prop="day_off" :label="$t('day-off')">
          <el-select v-model="form.day_off" class="!w-full" clearable filterable>
            <el-option
              v-for="day in empTypeStore.weekdays"
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
              v-for="(item, index) in empTypeStore.dayOffTypes"
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
      <div class="col-span-2">
        <el-form-item prop="template.card" :label="$t('template-card-number')">
          <el-input v-model="form.template.card" />
        </el-form-item>
      </div>
      <div class="col-span-2">
        <el-form-item prop="calc_day_off" :label="$t('calculate-extra-hours-day-off')">
          <el-switch v-model="form.calc_day_off" :active-text="$t('yes')" :inactive-text="$t('no')" />
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup>
import { t } from '@/plugins'
import { computed, onMounted, ref, watch } from 'vue'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'

const props = defineProps({
  employee: {
    type: Object,
    default: () => {},
  },
  type: {
    type: Object,
    default: () => {},
  },
})

const formInit = {
  nbr_hours: null,
  auto_pause: null,
  fixed_time: null,
  day_off: null,
  type_day_off: null,
  calc_day_off: null,
  template: { card: null },
}
const formRef = ref(null)
const form = ref({ ...formInit })
const empTypeStore = useEmployeeTypeStore()

const pointingSettingRules = computed(() => ({
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
}))

watch(
  () => form.value.cnss_nbr,
  (newVal, oldVal) => {
    const cnss_nbr =
      newVal == null || newVal == '' || (newVal?.toString().length <= 9 && !isNaN(+newVal)) ? newVal : oldVal
    form.value = Object.assign({}, { ...form.value, cnss_nbr })
  },
)
watch(
  () => form.value?.template?.card,
  (newVal, oldVal) => {
    const card = newVal && /^[0-9]+$/.test(newVal) ? newVal : oldVal

    form.value = Object.assign({}, { ...form.value, template: { card } })
  },
)

const setForm = (data) => {
  if (data?.id) {
    let employee = { ...data }

    if (!data.template) {
      employee.template = { card: null }
    } else if (data.template.card) {
      employee.template.card = data.template.card.toString()
    }

    Object.keys(formInit).forEach((key) => {
      form.value[key] = employee[key]
    })
  } else {
    form.value = Object.assign({}, formInit)
  }
}

onMounted(() => setForm(props.employee))

watch(
  () => props.employee,
  (newVal) => setForm(newVal),
)

watch(
  () => props.type,
  (newVal) => {
    if (newVal) {
      const { auto_pause, fixed_time, calc_day_off, day_off, nbr_hours, type_day_off } = props.type
      form.value = Object.assign(
        {},
        { ...form.value, auto_pause, fixed_time, calc_day_off, day_off, nbr_hours, type_day_off },
      )
    }
  },
)

defineExpose({
  formRef,
  form,
})
</script>
