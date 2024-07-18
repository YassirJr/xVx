<template>
  <el-form label-position="top">
    <div class="grid grid-cols-2 gap-5">
      <div class="col-span-1 p-5 border border-slate-200 rounded-xl relative">
        <h3 class="absolute left-[5%] -top-3 text-sm font-bold bg-white text-gray-400 px-2">
          {{ $t(steps[0].key) }}
        </h3>
        <div class="py-1">
          <strong>{{ $t('code') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['personal'].uid }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('status') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['personal'].status }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('firstname') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['personal'].firstname }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('lastname') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['personal'].lastname }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('gender') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['personal'].gender }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('cin') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['personal'].cin }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('date-of-birth') }}:</strong>
          <span class="inline-block ml-2">
            {{ $dayjs(form['personal'].birth_date).format('DD-MM-YYYY') }}
          </span>
        </div>
        <div v-if="isQFS" class="py-1">
          <strong>{{ $t('place-of-birth') }}:</strong>
          <span class="inline-block ml-2">
            {{ employeeStore.place_of_birth }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('family-status') }}:</strong>
          <span class="inline-block ml-2">
            {{ $t(employeeStore.getFamilyStatus(form['personal'].family_status)) }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('number-of-children') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['personal'].nbr_children }}
          </span>
        </div>
        <div v-if="isQFS" class="py-1">
          <strong>{{ $t('number-of-wives') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['personal'].nbr_wives }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('address') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['personal'].address }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('departure') }}:</strong>
          <span class="inline-block ml-2">
            {{ getDeparture(form['personal'].departure_id) }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('bank') }}:</strong>
          <span v-if="form['personal'].bank_id" class="inline-block ml-2">
            {{ getBank(form['personal'].bank_id) }}
          </span>
          <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
            {{ $t('empty') }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('bank-statement') }}:</strong>
          <span v-if="form['personal'].bank_statement" class="inline-block ml-2">
            {{ form['personal'].bank_statement }}
          </span>
          <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
            {{ $t('empty') }}
          </span>
        </div>
      </div>
      <div class="col-span-1 p-5 border border-slate-200 rounded-xl relative">
        <h3 class="absolute left-[5%] -top-3 text-sm font-bold bg-white text-gray-400 px-2">
          {{ $t(steps[1].key) }}
        </h3>
        <div class="py-1">
          <strong>{{ $t('social-category') }}:</strong>
          <span v-if="form['info-hr'].social_category" class="inline-block ml-2">
            {{ getLabelSocialCategory(form['info-hr'].social_category) }}
          </span>
          <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
            {{ $t('empty') }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('type') }}:</strong>
          <span class="inline-block ml-2">
            {{ getEmployeeType(form['info-hr'].type_id) }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('leader') }}:</strong>
          <span v-if="form['info-hr'].leader_id" class="inline-block ml-2">
            {{ getLeader(form['info-hr'].leader_id) }}
          </span>
          <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
            {{ $t('empty') }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('hiring-date') }}:</strong>
          <span class="inline-block ml-2">
            {{ $dayjs(form['info-hr'].hiring_date).format('DD-MM-YYYY') }}
          </span>
        </div>
        <div v-if="isQFS" class="py-1">
          <strong>{{ $t('contract-type') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['info-hr'].contract_type }}
          </span>
        </div>
        <div v-if="isQFS" class="py-1">
          <strong>{{ $t('end-contract-date') }}:</strong>
          <span class="inline-block ml-2">
            {{ $dayjs(form['info-hr'].end_contract_date).format('DD-MM-YYYY') }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('contract-date') }}:</strong>
          <span class="inline-block ml-2">
            {{ $dayjs(form['info-hr'].contract_date).format('DD-MM-YYYY') }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('declared-days') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['info-hr'].pre_declared_days }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('calc-seniority') }}:</strong>
          <span class="inline-block ml-2">
            {{ $t(empTypeStore.getCalcSeniority(form['info-hr'].calc_seniority)) }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('department') }}:</strong>
          <span class="inline-block ml-2">
            {{ getDepartment(form['info-hr'].department_id) }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('mission') }}:</strong>
          <span class="inline-block ml-2">
            {{ getMission(form['info-hr'].mission_id) }}
          </span>
        </div>
      </div>
      <div class="col-span-1 p-5 border border-slate-200 rounded-xl relative">
        <h3 class="absolute left-[5%] -top-3 text-sm font-bold bg-white text-gray-400 px-2">
          {{ $t(steps[2].key) }}
        </h3>
        <div class="py-1">
          <strong>{{ $t('pay-basis') }}:</strong>
          <span class="inline-block ml-2">
            {{ $t(empTypeStore.getPayBasis(form['pay'].pay_basis)) }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('base-salary') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['pay'].base_salary }}
          </span>
        </div>
        <div v-if="isQFS" class="py-1">
          <strong>{{ $t('upon-salary') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['pay'].upon_salary }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t(isQFS ? 'css-nbr' : 'cnss-nbr') }}:</strong>
          <span v-if="form['pay'].cnss_nbr" class="inline-block ml-2">
            {{ form['pay'].cnss_nbr }}
          </span>
          <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
            {{ $t('empty') }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ isQFS ? $t('ipres-nbr') : $t('cimr-nbr') }}:</strong>
          <span v-if="form['pay'].cimr_nbr" class="inline-block ml-2">
            {{ form['pay'].cimr_nbr }}
          </span>
          <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
            {{ $t('empty') }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ isQFS ? $t('ipres-rc-rate') : $t('cimr-rate') }}:</strong>
          <span v-if="form['pay'].cimr_rate_id" class="inline-block ml-2">
            {{ form['pay'].cimr_rate_id }}
          </span>
          <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
            {{ $t('empty') }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('complementary-insurance') }}:</strong>
          <span v-if="form['pay'].complementary_insurance" class="inline-block ml-2">
            {{ form['pay'].complementary_insurance }}
          </span>
          <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
            {{ $t('empty') }}
          </span>
        </div>
        <div v-if="isQFS" class="py-1">
          <strong>{{ $t('ipm') }}:</strong>
          <span v-if="form['pay'].ipm_id" class="inline-block ml-2">
            {{ form['pay'].ipm_id }}
          </span>
          <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
            {{ $t('empty') }}
          </span>
        </div>
        <div v-else class="py-1">
          <strong>{{ $t('insurance-rate') }}:</strong>
          <span v-if="form['pay'].insurance_rate" class="inline-block ml-2">
            {{ form['pay'].insurance_rate }}
          </span>
          <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
            {{ $t('empty') }}
          </span>
        </div>
      </div>
      <div class="col-span-1 p-5 border border-slate-200 rounded-xl relative">
        <h3 class="absolute left-[5%] -top-3 text-sm font-bold bg-white text-gray-400 px-2">
          {{ $t(steps[3].key) }}
        </h3>
        <div class="py-1">
          <strong>{{ $t('number-of-normal-hours') }}:</strong>
          <span class="inline-block ml-2">
            {{ empTypeStore.getNbrHours(form['pointing-settings'].nbr_hours) }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('auto-pause') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['pointing-settings'].auto_pause }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('fixed-time') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['pointing-settings'].fixed_time }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('day-off') }}:</strong>
          <span class="inline-block ml-2">
            {{ $t(empTypeStore.getDayOff(form['pointing-settings'].day_off)) }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('type-day-off') }}:</strong>
          <span class="inline-block ml-2">
            {{ $t(empTypeStore.getTypeDayOff(form['pointing-settings'].type_day_off)) }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('template-card-number') }}:</strong>
          <span class="inline-block ml-2">
            {{ form['pointing-settings'].template.card }}
          </span>
        </div>
        <div class="py-1">
          <strong>{{ $t('calculate-extra-hours-day-off') }}:</strong>
          <span class="inline-block ml-2">
            {{ $t(form['pointing-settings'].calc_day_off ? 'yes' : 'no') }}
          </span>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script setup>
import { t } from '@/plugins'
import { isQFS } from '@/helpers'
import { useBankStore } from '@/stores/bank'
import { useDepartmentStore } from '@/stores/department'
import { useDepartureStore } from '@/stores/departure'
import { useEmployeeStore } from '@/stores/employee'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { useMissionStore } from '@/stores/mission'

defineProps({
  steps: {
    type: Array,
    default: () => [],
  },
  form: {
    type: Object,
    default: () => {},
  },
})

const employeeStore = useEmployeeStore()
const empTypeStore = useEmployeeTypeStore()
const getEmployeeType = (typeId) => {
  return empTypeStore.types?.find(({ id }) => id == typeId)?.name
}
const getLeader = (leaderId) => {
  const leader = employeeStore.leaders?.find(({ id }) => id == leaderId)
  return leader ? `${leader.firstname} ${leader.lastname} (${leader.uid})` : null
}
const missionStore = useMissionStore()
const getMission = (missionId) => {
  return missionStore.missions?.find(({ id }) => id == missionId)?.label
}

const departureStore = useDepartureStore()
const getDeparture = (departureId) => {
  return departureStore.departures?.find(({ id }) => id == departureId)?.label
}
const bankStore = useBankStore()
const getBank = (bankId) => {
  return bankStore.banks?.find(({ id }) => id == bankId)?.label
}

const departmentStore = useDepartmentStore()
const getDepartment = (departmentId) => {
  return departmentStore.departments?.find(({ id }) => id == departmentId)?.label
}
const getLabelSocialCategory = (category) => {
  const label = employeeStore.getSocialCategory(category)?.label

  return label ? t(label) : null
}
</script>
