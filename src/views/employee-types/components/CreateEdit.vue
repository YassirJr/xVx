<template>
  <el-dialog
    draggable
    :model-value="useDialog.visible('create_edit_employee_type')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    top="10vh"
    @close="useDialog.close('create_edit_employee_type')"
  >
    <template #header>
      <div class="pt-3">
        <el-steps :active="activeStep" align-center>
          <el-step
            v-for="(step, i) in steps"
            :key="i"
            :status="activeStep > i ? 'success' : activeStep == i ? 'process' : null"
            :title="$t(step.label)"
          />
        </el-steps>
      </div>
    </template>
    <div v-loading="loading">
      <keep-alive>
        <component :is="steps[activeStep].component" ref="componentRef" v-bind="componentProps"></component>
      </keep-alive>
    </div>
    <template #footer>
      <div class="flex items-center justify-between">
        <div>
          <el-button
            plain
            type="info"
            :loading="loading"
            :disabled="loading"
            @click="useDialog.close('create_edit_employee_type')"
          >
            {{ $t('cancel') }}
          </el-button>
        </div>
        <div>
          <el-button
            class="px-8"
            type="primary"
            plain
            :loading="loading"
            :disabled="isPreviousDisabled || loading"
            @click="previousStep()"
          >
            <i-el-arrow-left-bold />
            <span class="inline-block ml-3">
              {{ $t('previous') }}
            </span>
          </el-button>
          <el-button
            v-if="activeStep != steps.length - 1"
            class="px-8"
            type="primary"
            plain
            :loading="loading"
            :disabled="isNextDisabled || loading"
            @click="nextStep()"
          >
            <span class="inline-block mr-3">
              {{ $t('next') }}
            </span>
            <i-el-arrow-right-bold />
          </el-button>
          <el-button
            v-else
            class="px-8"
            type="success"
            plain
            :loading="loading"
            :disabled="loading"
            @click="save()"
          >
            <i-el-circle-check />
            <span class="inline-block ml-2">{{ $t('confirm-and-save') }}</span>
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import Identification from '@/views/employee-types/components/steps/Identification'
import PointingSetup from '@/views/employee-types/components/steps/PointingSetup'
import DefaultData from '@/views/employee-types/components/steps/DefaultData'
import Preview from '@/views/employee-types/components/steps/Preview'
import { useDialog } from '@/helpers'
import { dayjs } from '@/plugins'
import { ref, computed, watch, shallowRef } from 'vue'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'

const defaultForm = {
  identification: {
    name: null,
    cnss_scheme: null,
    cnss_affiliation: null,
    frequency_pay: null,
  },
  'pointing-setup': {
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
  },
  'default-data': {
    calc_seniority: null,
    pay_basis: null,
    base_salary: null,
    department_id: null,
    mission_id: null,
  },
}

const props = defineProps({
  type: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const componentRef = shallowRef(null)
const identification = shallowRef(Identification)
const pointingSetup = shallowRef(PointingSetup)
const defaultData = shallowRef(DefaultData)
const preview = shallowRef(Preview)
const loading = ref(false)
const activeStep = ref(0)
const steps = ref([
  { key: 'identification', label: 'identification', component: identification },
  { key: 'pointing-setup', label: 'pointing-setup', component: pointingSetup },
  { key: 'default-data', label: 'default-data', component: defaultData },
  { key: 'preview', label: 'preview', component: preview },
])
const form = ref(JSON.parse(JSON.stringify(defaultForm)))

const employeeTypeStore = useEmployeeTypeStore()

const isNextDisabled = computed(() => {
  return activeStep.value >= steps.value.length - 1
})

const isPreviousDisabled = computed(() => {
  return activeStep.value < 1
})

const componentProps = computed(() => {
  const stepsProps = { type: props.type }
  if (activeStep.value === 3) {
    stepsProps.form = form.value
    stepsProps.steps = steps.value
    return stepsProps
  } else {
    return stepsProps
  }
})

watch(
  () => props.type,
  (newVal) => {
    activeStep.value = 0

    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = JSON.parse(JSON.stringify(defaultForm))
    }
  },
  { deep: true },
)

const nextStep = () => {
  if (activeStep.value < steps.value.length - 1) {
    const currentStep = steps.value[activeStep.value]

    componentRef.value.formRef.validate((valid) => {
      if (valid) {
        form.value[currentStep.key] = Object.assign({}, componentRef.value.form)
        activeStep.value++
      }
    })
  }
}

const previousStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

const save = () => {
  let employeeType = {}

  steps.value.forEach(({ key }) => {
    employeeType = { ...employeeType, ...form.value[key] }
  })
  const { start_hour_extra_25, end_hour_extra_25, start_hour_extra_50, end_hour_extra_50 } = employeeType

  employeeType = {
    ...employeeType,
    start_hour_extra_25: dayjs(start_hour_extra_25).format(),
    end_hour_extra_25: dayjs(end_hour_extra_25).format(),
    start_hour_extra_50: dayjs(start_hour_extra_50).format(),
    end_hour_extra_50: dayjs(end_hour_extra_50).format(),
  }

  loading.value = true
  if (form.value?.id) {
    employeeTypeStore
      .updateEmployeeType({ id: form.value.id, ...employeeType })
      .then(() => reset())
      .finally(() => (loading.value = false))
  } else {
    employeeTypeStore
      .newEmployeeType(employeeType)
      .then(() => reset())
      .finally(() => (loading.value = false))
  }
}

const reset = () => {
  useDialog.close('create_edit_employee_type')
  loading.value = false
  activeStep.value = 0
  form.value = JSON.parse(JSON.stringify(defaultForm))
  emit('reload')
}
</script>
