<template>
  <div class="grid grid-cols-2 gap-5 pt-5">
    <div class="col-span-1 p-5 border border-slate-200 rounded-xl relative">
      <h3 class="absolute left-[5%] -top-3 text-sm font-bold bg-white text-gray-400 px-2">
        {{ $t(steps[0].key) }}
      </h3>
      <div class="py-1">
        <strong>{{ $t('label') }}:</strong>
        <span class="inline-block ml-2">
          {{ form[steps[0].key].name }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t(isQFS ? 'css-scheme' : 'cnss-scheme') }}:</strong>
        <span class="inline-block ml-2">
          {{ $t(employeeTypeStore.getCnssScheme(form[steps[0].key].cnss_scheme)) }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t(isQFS ? 'css-affiliation' : 'cnss-affiliation') }}:</strong>
        <span class="inline-block ml-2">
          {{ form[steps[0].key].cnss_affiliation }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('frequency-pay') }}:</strong>
        <span class="inline-block ml-2">
          {{ $t(employeeTypeStore.getFrequencyPay(form[steps[0].key].frequency_pay)) }}
        </span>
      </div>
    </div>
    <div class="col-span-1 p-5 border border-slate-200 rounded-xl relative">
      <h3 class="absolute left-[5%] -top-3 text-sm font-bold bg-white text-gray-400 px-2">
        {{ $t(steps[2].key) }}
      </h3>
      <div class="py-1">
        <strong>{{ $t('calc-seniority') }}:</strong>
        <span class="inline-block ml-2">
          {{ $t(employeeTypeStore.getCalcSeniority(form[steps[2].key].calc_seniority)) }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('pay-basis') }}:</strong>
        <span class="inline-block ml-2">
          {{ $t(employeeTypeStore.getPayBasis(form[steps[2].key].pay_basis)) }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('base-salary') }}:</strong>
        <span class="inline-block ml-2">
          {{ form[steps[2].key].base_salary }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('department') }}:</strong>
        <span class="inline-block ml-2">
          {{ getDepartment }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('mission') }}:</strong>
        <span class="inline-block ml-2">
          {{ getMission }}
        </span>
      </div>
    </div>
    <div class="col-span-2 grid grid-cols-2 p-5 border border-slate-200 rounded-xl relative">
      <h3 class="absolute left-[5%] -top-3 text-sm font-bold bg-white text-gray-400 px-2">
        {{ $t(steps[1].key) }}
      </h3>
      <div class="py-1">
        <strong>{{ $t('number-of-normal-hours') }}:</strong>
        <span class="inline-block ml-2">
          {{ employeeTypeStore.getNbrHours(form[steps[1].key].nbr_hours) }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('auto-pause') }}:</strong>
        <span class="inline-block ml-2">
          {{ form[steps[1].key].auto_pause }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('fixed-time') }}:</strong>
        <span class="inline-block ml-2">
          {{ form[steps[1].key].fixed_time }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('day-off') }}:</strong>
        <span class="inline-block ml-2">
          {{ $t(employeeTypeStore.getDayOff(form[steps[1].key].day_off)) }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('type-day-off') }}:</strong>
        <span class="inline-block ml-2">
          {{ $t(employeeTypeStore.getTypeDayOff(form[steps[1].key].type_day_off)) }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('calculate-extra-hours-day-off') }}:</strong>
        <span class="inline-block ml-2">
          {{ $t(form[steps[1].key].calc_day_off ? 'yes' : 'no') }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('source-pointing-hours') }}:</strong>
        <span class="inline-block ml-2">
          {{ $t(employeeTypeStore.getPointingHourSource(form[steps[1].key].source_pointing_hours)) }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('calc-extra-hours') }}:</strong>
        <span class="inline-block ml-2">
          {{ $t(form[steps[1].key].calc_extra_hours ? 'yes' : 'no') }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('source-pointing-unities') }}:</strong>
        <span class="inline-block ml-2">
          {{
            form[steps[1].key].source_pointing_unities
              ? $t(employeeTypeStore.getPointingUnitySource(form[steps[1].key].source_pointing_unities))
              : null
          }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t('days-per-period') }}:</strong>
        <span class="inline-block ml-2">
          {{ form[steps[1].key].nbr_days_per_period }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t(isQFS ? 'start-hour-extra-25-40' : 'start-hour-extra-25') }}:</strong>
        <span class="inline-block ml-2">
          {{ $dayjs(form[steps[1].key].start_hour_extra_25).format(TIME_FORMAT) }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t(isQFS ? 'end-hour-extra-25-40' : 'end-hour-extra-25') }}:</strong>
        <span class="inline-block ml-2">
          {{ $dayjs(form[steps[1].key].end_hour_extra_25).format(TIME_FORMAT) }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t(isQFS ? 'start-hour-extra-60' : 'start-hour-extra-50') }}:</strong>
        <span class="inline-block ml-2">
          {{ $dayjs(form[steps[1].key].start_hour_extra_50).format(TIME_FORMAT) }}
        </span>
      </div>
      <div class="py-1">
        <strong>{{ $t(isQFS ? 'end-hour-extra-60' : 'end-hour-extra-50') }}:</strong>
        <span class="inline-block ml-2">
          {{ $dayjs(form[steps[1].key].end_hour_extra_50).format(TIME_FORMAT) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isQFS } from '@/helpers'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { useMissionStore } from '@/stores/mission'
import { useDepartmentStore } from '@/stores/department'
import { TIME_FORMAT } from '@/constants'

const props = defineProps({
  form: {
    type: Object,
    default: () => {},
  },
  steps: {
    type: Array,
    default: () => [],
  },
})

const employeeTypeStore = useEmployeeTypeStore()
const departmentStore = useDepartmentStore()
const missionStore = useMissionStore()

const getDepartment = computed(() => {
  return departmentStore.departments.find(({ id }) => id == props.form[props.steps[2].key].department_id)
    .label
})

const getMission = computed(() => {
  return missionStore.missions.find(({ id }) => id == props.form[props.steps[2].key].mission_id).label
})
</script>
