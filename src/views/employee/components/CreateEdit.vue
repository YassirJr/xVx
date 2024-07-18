<template>
  <el-dialog
    draggable
    :model-value="$dialog.visible('create_edit_employee')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    top="5vh"
    @close="$dialog.close('create_edit_employee')"
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
      <!-- Step 1: Personal -->
      <el-form
        v-if="activeStep == 0"
        :ref="`form-${steps[0].key}`"
        :model="getForm"
        :rules="rules[steps[0].key]"
        label-position="top"
      >
        <div class="grid grid-cols-6 gap-x-5">
          <div class="col-span-4">
            <el-form-item :label="$t('code')" prop="uid">
              <el-input-number
                v-model="getForm.uid"
                class="!w-full"
                :controls="false"
                :min="1"
                :disabled="Boolean(employee?.id)"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('active')" prop="status">
              <el-radio-group v-model="getForm.status" class="!w-full">
                <el-radio-button :key="0" class="!w-1/2" :label="true">
                  <template #default>
                    {{ $t('yes') }}
                  </template>
                </el-radio-button>
                <el-radio-button :key="1" class="!w-1/2" :label="false">
                  <template #default>
                    {{ $t('no') }}
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('firstname')" prop="firstname">
              <el-input v-model="getForm.firstname"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('lastname')" prop="lastname">
              <el-input v-model="getForm.lastname"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('gender')" prop="gender">
              <el-radio-group v-model="getForm.gender" class="!w-full">
                <el-radio-button
                  v-for="(item, index) in getGenders"
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
          <div :class="isQFS ? 'col-span-2' : 'col-span-3'">
            <el-form-item :label="$t('cin')" prop="cin">
              <el-input v-model="getForm.cin"></el-input>
            </el-form-item>
          </div>
          <div :class="isQFS ? 'col-span-2' : 'col-span-3'">
            <el-form-item class="!w-full" :label="$t('date-of-birth')" prop="birth_date">
              <el-date-picker
                v-model="getForm.birth_date"
                class="!w-full"
                format="DD-MM-YYYY"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div v-if="isQFS" class="col-span-2">
            <el-form-item :label="$t('place-of-birth')" prop="place_of_birth">
              <el-input v-model="getForm.place_of_birth"></el-input>
            </el-form-item>
          </div>
          <div :class="isQFS ? 'col-span-2' : 'col-span-3'">
            <el-form-item prop="family_status" :label="$t('family-status')">
              <el-select v-model="getForm.family_status" class="!w-full" clearable filterable>
                <el-option
                  v-for="status in familyStatus"
                  :key="status.value"
                  :label="$t(status.label)"
                  :value="status.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div :class="isQFS ? 'col-span-2' : 'col-span-3'">
            <el-form-item :label="$t('number-of-children')" prop="nbr_children">
              <el-input-number
                v-model="getForm.nbr_children"
                class="!w-full"
                :min="0"
                :max="99"
                :value-on-clear="0"
              ></el-input-number>
            </el-form-item>
          </div>
          <div v-if="isQFS" class="col-span-2">
            <el-form-item :label="$t('number-of-wives')" prop="nbr_wives">
              <el-input-number
                v-model="getForm.nbr_wives"
                class="!w-full"
                :min="0"
                :max="99"
                :value-on-clear="0"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item :label="$t('phone-number')" prop="phone_number">
              <el-input v-model="getForm.phone_number" maxlength="11" clearable></el-input>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item :label="$t('address')" prop="address">
              <el-input v-model="getForm.address"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-3 relative">
            <el-form-item :label="$t('departure')" prop="departure_id">
              <el-select v-model="getForm.departure_id" class="w-full" clearable filterable>
                <el-option
                  v-for="departure in departures"
                  :key="departure.id"
                  :label="departure.label"
                  :value="departure.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="absolute right-0 top-0">
              <el-button type="primary" text size="small" @click="$dialog.open('create_edit_departure')">
                {{ $t('new-departure') }}
              </el-button>
            </div>
          </div>
          <div class="col-span-3"></div>
          <div class="col-span-3 relative">
            <el-form-item :label="$t('bank')" prop="bank_id">
              <el-select v-model="getForm.bank_id" class="w-full" clearable filterable>
                <el-option
                  v-for="bank in banks"
                  :key="bank.id"
                  :label="bank.label"
                  :value="bank.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="absolute right-0 top-0">
              <el-button type="primary" text size="small" @click="$dialog.open('create_edit_bank')">
                {{ $t('add-bank') }}
              </el-button>
            </div>
          </div>
          <div class="col-span-3">
            <el-form-item :label="$t('bank-statement')" prop="bank_statement">
              <el-input v-model="getForm.bank_statement" class="!w-full"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <!-- Step 2: Info HR -->
      <el-form
        v-else-if="activeStep == 1"
        :ref="`form-${steps[1].key}`"
        :model="form[steps[1].key]"
        :rules="rules[steps[1].key]"
        label-position="top"
      >
        <div class="grid grid-cols-4 gap-x-5">
          <div class="col-span-2 relative">
            <el-form-item :label="$t('type')" prop="type_id">
              <el-select
                v-model="getForm.type_id"
                class="w-full"
                clearable
                filterable
                @change="typeChanged(getForm.type_id)"
              >
                <el-option
                  v-for="(type, i) in types"
                  :key="i"
                  :label="type.name"
                  :value="type.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="absolute right-0 top-0">
              <el-button type="primary" text size="small" @click="$dialog.open('create_edit_employee_type')">
                {{ $t('new-type') }}
              </el-button>
            </div>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('leader')" prop="leader_id">
              <el-select-v2
                v-model="getForm.leader_id"
                clearable
                filterable
                :reserve-keyword="false"
                :options="
                  leaders.map((el) => ({ ...el, label: `${el.firstname} ${el.lastname} (${el.uid})` }))
                "
                value-key="id"
                class="w-full"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div :class="isQFS ? 'col-span-1' : 'col-span-2'">
            <el-form-item class="!w-full" :label="$t('hiring-date')" prop="hiring_date">
              <el-date-picker
                v-model="getForm.hiring_date"
                class="!w-full"
                format="DD-MM-YYYY"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div v-if="isQFS" class="col-span-1">
            <el-form-item :label="$t('contract-type')" prop="contract_type">
              <el-select-v2
                v-model="getForm.contract_type"
                clearable
                filterable
                :reserve-keyword="false"
                :options="getContractTypes.map((el) => ({ ...el, label: $t(el.label) }))"
                value-key="value"
                class="w-full"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div :class="isQFS ? 'col-span-1' : 'col-span-2'">
            <el-form-item class="!w-full" :label="$t('contract-date')" prop="contract_date">
              <el-date-picker
                v-model="getForm.contract_date"
                class="!w-full"
                format="DD-MM-YYYY"
                :disabled-date="disabledContractDate"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div v-if="isQFS" class="col-span-1">
            <el-form-item class="!w-full" :label="$t('end-contract-date')" prop="end_contract_date">
              <el-date-picker
                v-model="getForm.end_contract_date"
                class="!w-full"
                format="DD-MM-YYYY"
                @change="onEndContractDateChange()"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="col-span-2 grid grid-cols-7 gap-x-5">
            <div class="col-span-2">
              <el-form-item class="!w-full" :label="$t('declared-days')" prop="pre_declared_days">
                <template v-if="Boolean(employee?.id)">
                  <label class="w-full">{{ declaredDays }}</label>
                </template>
                <template v-else>
                  <el-input-number
                    v-model="getForm.pre_declared_days"
                    class="!w-full"
                    :min="0"
                    :value-on-clear="0"
                  ></el-input-number>
                </template>
              </el-form-item>
            </div>
            <div class="col-span-5">
              <el-form-item prop="calc_seniority" :label="$t('calc-seniority')">
                <el-radio-group v-model="getForm.calc_seniority" class="!w-full">
                  <el-radio-button
                    v-for="(item, index) in calcSeniorities"
                    :key="index"
                    class="!w-1/3"
                    :label="item.value"
                  >
                    <template #default>
                      {{ $t(item.label) }}
                    </template>
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div class="col-span-2 relative">
            <el-form-item prop="mission_id" :label="$t('mission')">
              <el-select v-model="getForm.mission_id" class="!w-full" clearable filterable>
                <el-option
                  v-for="mission in missions"
                  :key="mission.id"
                  :label="mission.label"
                  :value="mission.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="absolute right-0 top-0">
              <el-button type="primary" text size="small" @click="$dialog.open('create_edit_mission')">
                {{ $t('new-mission') }}
              </el-button>
            </div>
          </div>
          <div class="col-span-2 relative">
            <el-form-item prop="department_id" :label="$t('department')">
              <el-select v-model="getForm.department_id" class="!w-full" clearable filterable>
                <el-option
                  v-for="department in departments"
                  :key="department.id"
                  :label="department.label"
                  :value="department.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="absolute right-0 top-0">
              <el-button type="primary" text size="small" @click="$dialog.open('create_edit_department')">
                {{ $t('new-department') }}
              </el-button>
            </div>
          </div>
          <div class="col-span-2">
            <el-form-item prop="social_category" :label="$t('social-category')">
              <el-select
                v-model="getForm.social_category"
                class="!w-full"
                clearable
                filterable
                @change="onSocialCategoryChange()"
              >
                <el-option
                  v-for="category in socialCategories"
                  :key="category.value"
                  :label="$t(category.label)"
                  :value="category.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <!-- Step 3: Pay -->
      <el-form
        v-else-if="activeStep == 2"
        :ref="`form-${steps[2].key}`"
        :model="form[steps[2].key]"
        :rules="rules[steps[2].key]"
        label-position="top"
      >
        <div class="grid grid-cols-4 gap-x-5">
          <div class="col-span-2">
            <el-form-item prop="pay_basis" :label="$t('pay-basis')">
              <el-radio-group v-model="getForm.pay_basis" class="!w-full">
                <el-radio-button
                  v-for="(item, index) in payBasis"
                  :key="index"
                  class="!w-1/3"
                  :label="item.value"
                >
                  <template #default>
                    {{ $t(item.label) }}
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div :class="isQFS ? 'col-span-1' : 'col-span-2'">
            <el-form-item prop="base_salary" :label="$t('base-salary')">
              <el-input-number
                v-model="getForm.base_salary"
                class="!w-full"
                :controls="false"
                :disabled="isQFS"
                :min="minBaseSalary"
              ></el-input-number>
            </el-form-item>
          </div>
          <div v-if="isQFS" class="col-span-1">
            <el-form-item prop="upon_salary" :label="$t('upon-salary')">
              <el-input-number
                v-model="getForm.upon_salary"
                class="!w-full"
                :controls="false"
                :min="0"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t(isQFS ? 'css-nbr' : 'cnss-nbr')" prop="cnss_nbr">
              <el-input v-model="getForm.cnss_nbr" class="!w-full"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-divider></el-divider>
          </div>
          <div class="col-span-2">
            <el-form-item :label="isQFS ? $t('ipres-nbr') : $t('cimr-nbr')" prop="cimr_nbr">
              <el-input-number v-model="getForm.cimr_nbr" class="!w-full" :controls="false"></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="isQFS ? $t('ipres-rc-rate') : $t('cimr-rate')" prop="cimr_rate_id">
              <el-select v-model="getForm.cimr_rate_id" clearable filterable class="w-full">
                <el-option
                  v-for="fund in socialFunds.filter(({ fund }) =>
                    isQFS ? fund == fundsList[0].value : fund == fundsList[2].value,
                  )"
                  :key="fund.id"
                  :label="fund.label"
                  :value="fund.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('complementary-insurance')" prop="complementary_insurance">
              <el-input v-model="getForm.complementary_insurance"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item v-if="isQFS" :label="$t('insurance-rate')" prop="ipm_id">
              <el-select v-model="getForm.ipm_id" clearable filterable class="w-full">
                <el-option
                  v-for="fund in socialFunds.filter(({ fund }) => fund == fundsList[3].value)"
                  :key="fund.id"
                  :label="fund.label"
                  :value="fund.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-else :label="$t('insurance-rate')" prop="insurance_rate">
              <el-input-number
                v-model="getForm.insurance_rate"
                class="!w-full"
                controls-position="right"
                :min="insuranceRateConfig.min"
                :max="insuranceRateConfig.max"
              ></el-input-number>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <!-- Step 4: Pointing settings -->
      <el-form
        v-else-if="activeStep == 3"
        :ref="`form-${steps[3].key}`"
        :model="form[steps[3].key]"
        :rules="rules[steps[3].key]"
        label-position="top"
      >
        <div class="grid grid-cols-4 gap-x-5">
          <div class="col-span-2">
            <el-form-item prop="nbr_hours" :label="$t('number-of-normal-hours')">
              <el-radio-group v-model="getForm.nbr_hours" class="!w-full">
                <el-radio-button
                  v-for="(item, index) in getFilteredNbrHours"
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
                v-model="getForm.auto_pause"
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
                v-model="getForm.fixed_time"
                class="!w-full"
                :precision="2"
                :min="0"
                :max="24"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item prop="day_off" :label="$t('day-off')">
              <el-select v-model="getForm.day_off" class="!w-full" clearable filterable>
                <el-option
                  v-for="day in weekdays"
                  :key="day.value"
                  :label="$t(day.label)"
                  :value="day.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item prop="type_day_off" :label="$t('type-day-off')">
              <el-radio-group v-model="getForm.type_day_off" class="!w-full">
                <el-radio-button
                  v-for="(item, index) in dayOffTypes"
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
              <el-input v-model="getForm.template.card" />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item prop="calc_day_off" :label="$t('calculate-extra-hours-day-off')">
              <el-switch v-model="getForm.calc_day_off" :active-text="$t('yes')" :inactive-text="$t('no')" />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <!-- Step 5: Preview -->
      <el-form v-else label-position="top">
        <div class="grid grid-cols-2 gap-5">
          <div class="col-span-1 p-5 border border-slate-200 rounded-xl relative">
            <h3 class="absolute left-[5%] -top-3 text-sm font-bold bg-white text-gray-400 px-2">
              {{ $t(steps[0].key) }}
            </h3>
            <div class="py-1">
              <strong>{{ $t('code') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[0].key].uid }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ `${$t('status')} | ${$t('active')}` }}:</strong>
              <span class="inline-block ml-2">
                {{ $t(form[steps[0].key].status ? 'yes' : 'no') }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('firstname') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[0].key].firstname }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('lastname') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[0].key].lastname }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('gender') }}:</strong>
              <span class="inline-block ml-2">
                {{ $t(form[steps[0].key].gender) }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('cin') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[0].key].cin }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('date-of-birth') }}:</strong>
              <span class="inline-block ml-2">
                {{ $dayjs(form[steps[0].key].birth_date).format('DD-MM-YYYY') }}
              </span>
            </div>
            <div v-if="isQFS" class="py-1">
              <strong>{{ $t('place-of-birth') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[0].key].place_of_birth }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('family-status') }}:</strong>
              <span class="inline-block ml-2">
                {{ $t(getFamilyStatus(form[steps[0].key].family_status)) }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('number-of-children') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[0].key].nbr_children }}
              </span>
            </div>
            <div v-if="isQFS" class="py-1">
              <strong>{{ $t('number-of-wives') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[0].key].nbr_wives }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('address') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[0].key].address }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('departure') }}:</strong>
              <span class="inline-block ml-2">
                {{ getDeparture(form[steps[0].key].departure_id) }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('bank') }}:</strong>
              <span v-if="form[steps[0].key].bank_id" class="inline-block ml-2">
                {{ getBank(form[steps[0].key].bank_id) }}
              </span>
              <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
                {{ $t('empty') }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('bank-statement') }}:</strong>
              <span v-if="form[steps[0].key].bank_statement" class="inline-block ml-2">
                {{ form[steps[0].key].bank_statement }}
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
              <span v-if="form[steps[1].key].social_category" class="inline-block ml-2">
                {{ getLabelSocialCategory(form[steps[1].key].social_category) }}
              </span>
              <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
                {{ $t('empty') }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('type') }}:</strong>
              <span class="inline-block ml-2">
                {{ getEmployeeType(form[steps[1].key].type_id) }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('leader') }}:</strong>
              <span v-if="form[steps[1].key].leader_id" class="inline-block ml-2">
                {{ getLeader(form[steps[1].key].leader_id) }}
              </span>
              <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
                {{ $t('empty') }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('hiring-date') }}:</strong>
              <span class="inline-block ml-2">
                {{ $dayjs(form[steps[1].key].hiring_date).format('DD-MM-YYYY') }}
              </span>
            </div>
            <div v-if="isQFS" class="py-1">
              <strong>{{ $t('contract-type') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[1].key].contract_type }}
              </span>
            </div>
            <div v-if="isQFS" class="py-1">
              <strong>{{ $t('end-contract-date') }}:</strong>
              <span class="inline-block ml-2">
                {{ $dayjs(form[steps[1].key].end_contract_date).format('DD-MM-YYYY') }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('contract-date') }}:</strong>
              <span class="inline-block ml-2">
                {{ $dayjs(form[steps[1].key].contract_date).format('DD-MM-YYYY') }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('declared-days') }}:</strong>
              <span v-if="employee?.id" class="inline-block ml-2">
                {{ declaredDays }}
              </span>
              <span v-else class="inline-block ml-2">
                {{ form[steps[1].key].pre_declared_days }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('calc-seniority') }}:</strong>
              <span class="inline-block ml-2">
                {{ $t(getCalcSeniority(form[steps[1].key].calc_seniority)) }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('department') }}:</strong>
              <span class="inline-block ml-2">
                {{ getDepartment(form[steps[1].key].department_id) }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('mission') }}:</strong>
              <span class="inline-block ml-2">
                {{ getMission(form[steps[1].key].mission_id) }}
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
                {{ $t(getPayBasis(form[steps[2].key].pay_basis)) }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('base-salary') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[2].key].base_salary }}
              </span>
            </div>
            <div v-if="isQFS" class="py-1">
              <strong>{{ $t('upon-salary') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[2].key].upon_salary }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t(isQFS ? 'css-nbr' : 'cnss-nbr') }}:</strong>
              <span v-if="form[steps[2].key].cnss_nbr" class="inline-block ml-2">
                {{ form[steps[2].key].cnss_nbr }}
              </span>
              <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
                {{ $t('empty') }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ isQFS ? $t('ipres-nbr') : $t('cimr-nbr') }}:</strong>
              <span v-if="form[steps[2].key].cimr_nbr" class="inline-block ml-2">
                {{ form[steps[2].key].cimr_nbr }}
              </span>
              <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
                {{ $t('empty') }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ isQFS ? $t('ipres-rc-rate') : $t('cimr-rate') }}:</strong>
              <span v-if="form[steps[2].key].cimr_rate_id" class="inline-block ml-2">
                {{ form[steps[2].key].cimr_rate_id }}
              </span>
              <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
                {{ $t('empty') }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('complementary-insurance') }}:</strong>
              <span v-if="form[steps[2].key].complementary_insurance" class="inline-block ml-2">
                {{ form[steps[2].key].complementary_insurance }}
              </span>
              <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
                {{ $t('empty') }}
              </span>
            </div>
            <div v-if="isQFS" class="py-1">
              <strong>{{ $t('ipm') }}:</strong>
              <span v-if="form[steps[2].key].ipm_id" class="inline-block ml-2">
                {{ form[steps[2].key].ipm_id }}
              </span>
              <span v-else class="inline-block ml-2 text-gray-400 opacity-70 text-sm">
                {{ $t('empty') }}
              </span>
            </div>
            <div v-else class="py-1">
              <strong>{{ $t('insurance-rate') }}:</strong>
              <span v-if="form[steps[2].key].insurance_rate" class="inline-block ml-2">
                {{ form[steps[2].key].insurance_rate }}
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
                {{ getNbrHours(form[steps[3].key].nbr_hours) }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('auto-pause') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[3].key].auto_pause }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('fixed-time') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[3].key].fixed_time }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('day-off') }}:</strong>
              <span class="inline-block ml-2">
                {{ $t(getDayOff(form[steps[3].key].day_off)) }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('type-day-off') }}:</strong>
              <span class="inline-block ml-2">
                {{ $t(getTypeDayOff(form[steps[3].key].type_day_off)) }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('template-card-number') }}:</strong>
              <span class="inline-block ml-2">
                {{ form[steps[3].key].template.card }}
              </span>
            </div>
            <div class="py-1">
              <strong>{{ $t('calculate-extra-hours-day-off') }}:</strong>
              <span class="inline-block ml-2">
                {{ $t(form[steps[3].key].calc_day_off ? 'yes' : 'no') }}
              </span>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="flex items-center justify-between">
        <div>
          <el-button
            plain
            type="info"
            :loading="loading"
            :disabled="loading"
            @click="$dialog.close('create_edit_employee')"
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

    <new-type></new-type>
    <new-departure></new-departure>
    <new-bank></new-bank>
    <new-mission></new-mission>
    <new-department></new-department>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import NewType from '@/views/employee-types/components/CreateEdit'
import NewDeparture from '@/views/departure/components/CreateEdit'
import NewMission from '@/views/mission/components/CreateEdit'
import NewBank from '@/views/bank/components/CreateEdit'
import NewDepartment from '@/views/department/components/CreateEdit'
import { isQFS, PhoneNumRegex } from '@/helpers'
import { BANK_STATEMENT_REGEX } from '@/constants'

const defaultForm = {
  personal: {
    status: true,
    firstname: null,
    lastname: null,
    gender: null,
    cin: null,
    uid: null,
    birth_date: null,
    place_of_birth: null,
    family_status: null,
    nbr_children: 0,
    nbr_wives: 0,
    address: null,
    phone_number: null,
    departure_id: null,
    bank_id: null,
    bank_statement: null,
  },
  'info-hr': {
    social_category: null,
    type_id: null,
    leader_id: null,
    hiring_date: new Date(),
    contract_type: null,
    end_contract_date: new Date(),
    contract_date: new Date(),
    pre_declared_days: 0,
    calc_seniority: null,
    department_id: null,
    mission_id: null,
  },
  pay: {
    pay_basis: null,
    base_salary: null,
    upon_salary: null,
    cnss_nbr: null,
    cimr_nbr: null,
    cimr_rate_id: null,
    complementary_insurance: null,
    insurance_rate: null,
    ipm_id: null,
  },
  'pointing-settings': {
    nbr_hours: null,
    auto_pause: null,
    fixed_time: null,
    day_off: null,
    type_day_off: null,
    calc_day_off: null,
    template: { card: null },
  },
}

export default {
  components: {
    NewType,
    NewDeparture,
    NewBank,
    NewMission,
    NewDepartment,
  },
  props: {
    employee: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['reload'],
  data() {
    return {
      isQFS: isQFS,
      loading: false,
      activeStep: 0,
      steps: [
        { key: 'personal', label: 'personal' },
        { key: 'info-hr', label: 'info-hr' },
        { key: 'pay', label: 'pay' },
        { key: 'pointing-settings', label: 'pointing-settings' },
        { key: 'preview', label: 'preview' },
      ],
      form: JSON.parse(JSON.stringify(defaultForm)),
      declaredDays: 0,
    }
  },
  computed: {
    ...mapGetters('bank', ['banks']),
    ...mapGetters('mission', ['missions']),
    ...mapGetters('department', ['departments']),
    ...mapGetters('departure', ['departures']),
    ...mapGetters('socialFund', ['fundsList', 'socialFunds']),
    ...mapGetters('employeeTypes', [
      'type',
      'types',
      'calcSeniorities',
      'payBasis',
      'getFilteredNbrHours',
      'weekdays',
      'dayOffTypes',
      'getTypeDayOff',
      'getDayOff',
      'getNbrHours',
      'getCalcSeniority',
      'getPayBasis',
    ]),
    ...mapGetters('employee', [
      'leaders',
      'latest_uid',
      'familyStatus',
      'socialCategories',
      'getFamilyStatus',
      'getSocialCategory',
      'getEmployeeNumberDays',
      'getGenders',
      'getContractTypes',
    ]),

    cinRule() {
      const rule = [
        {
          required: true,
          message: this.$t('please-input-cin'),
          trigger: 'blur',
        },
      ]
      if (!isQFS) {
        rule.push({
          min: 4,
          max: 8,
          pattern: /^[A-Z]{1,3}[0-9]{2,6}$/g,
          message: this.$t('cin-is-invalid'),
          trigger: 'blur',
        })
      }

      return rule
    },
    rules() {
      return {
        personal: {
          firstname: [
            {
              required: true,
              message: this.$t('please-input-firstname'),
              trigger: 'blur',
            },
          ],
          lastname: [
            {
              required: true,
              message: this.$t('please-input-lastname'),
              trigger: 'blur',
            },
          ],
          gender: [
            {
              required: true,
              message: this.$t('please-select-gender'),
              trigger: 'blur',
            },
          ],
          cin: this.cinRule,
          uid: [
            {
              required: true,
              message: this.$t('please-input-code'),
              trigger: 'blur',
            },
          ],
          birth_date: [
            {
              required: true,
              message: this.$t('please-select-birth-date'),
              trigger: 'blur',
            },
          ],
          place_of_birth: [
            {
              required: isQFS,
              message: this.$t('please-input-birth-place'),
              trigger: 'blur',
            },
          ],
          family_status: [
            {
              required: true,
              message: this.$t('please-select-family-status'),
              trigger: 'blur',
            },
          ],
          nbr_children: [
            {
              required: true,
              message: this.$t('please-input-nbr-children'),
              trigger: 'blur',
            },
          ],
          nbr_wives: [
            {
              required: isQFS,
              message: this.$t('please-input-nbr-wives'),
              trigger: 'blur',
            },
          ],
          phone_number: [
            {
              pattern: PhoneNumRegex,
              message: this.$t('please-input-correct-phone-number'),
              trigger: 'blur',
            },
          ],
          address: [
            {
              required: true,
              message: this.$t('please-input-address'),
              trigger: 'blur',
            },
          ],
          departure_id: [
            {
              required: true,
              message: this.$t('please-select-departure'),
              trigger: 'blur',
            },
          ],
          bank_statement: [
            {
              pattern: BANK_STATEMENT_REGEX(),
              message: this.$t('bank-statement-invalid'),
              trigger: 'blur',
            },
          ],
        },
        'info-hr': {
          type_id: [
            {
              required: true,
              message: this.$t('please-select-employee-type'),
              trigger: 'blur',
            },
          ],
          hiring_date: [
            {
              required: true,
              message: this.$t('please-select-hiring-date'),
              trigger: 'blur',
            },
          ],
          end_contract_date: [
            {
              required: isQFS,
              message: this.$t('please-select-end-contract-date'),
              trigger: 'blur',
            },
          ],
          contract_date: [
            {
              required: true,
              message: this.$t('please-select-contract-date'),
              trigger: 'blur',
            },
          ],
          pre_declared_days: [
            {
              required: true,
              message: this.$t('please-input-declared-days'),
              trigger: 'blur',
            },
          ],
          calc_seniority: [
            {
              required: true,
              message: this.$t('please-select-calc-seniority'),
              trigger: 'blur',
            },
          ],
          department_id: [
            {
              required: true,
              message: this.$t('please-select-department'),
              trigger: 'blur',
            },
          ],
          social_category: [
            {
              required: isQFS,
              message: this.$t('please-select-social-category'),
              trigger: 'blur',
            },
          ],
          mission_id: [
            {
              required: true,
              message: this.$t('please-select-mission'),
              trigger: 'blur',
            },
          ],
        },
        pay: {
          pay_basis: [
            {
              required: true,
              message: this.$t('please-select-pay-basis'),
              trigger: 'blur',
            },
          ],
          base_salary: [
            {
              required: true,
              message: this.$t('please-input-base-salary'),
              trigger: 'blur',
            },
            {
              type: 'number',
              message: this.$t('base-salary-invalid'),
              trigger: 'blur',
            },
          ],
          upon_salary: [
            {
              required: isQFS,
              message: this.$t('please-input-upon-salary'),
              trigger: 'blur',
            },
          ],
          cnss_nbr: [
            {
              pattern: /^[0-9]{9}/g,
              message: this.$t(isQFS ? 'css-nbr-invalid' : 'cnss-nbr-invalid'),
              trigger: 'blur',
            },
          ],
        },
        'pointing-settings': {
          nbr_hours: [
            {
              required: true,
              message: this.$t('please-select-number-of-normal-hours'),
              trigger: 'blur',
            },
          ],
          auto_pause: [
            {
              required: true,
              message: this.$t('please-input-auto-pause'),
              trigger: 'blur',
            },
          ],
          fixed_time: [
            {
              required: true,
              message: this.$t('please-input-fixed-time'),
              trigger: 'blur',
            },
          ],
          day_off: [
            {
              required: true,
              message: this.$t('please-select-day-off'),
              trigger: 'blur',
            },
          ],
          type_day_off: [
            {
              required: true,
              message: this.$t('please-select-type-day-off'),
              trigger: 'blur',
            },
          ],
        },
      }
    },
    getForm() {
      return this.form[this.steps[this.activeStep].key]
    },
    isNextDisabled() {
      return this.activeStep >= this.steps.length - 1
    },
    isPreviousDisabled() {
      return this.activeStep < 1
    },
    minBaseSalary() {
      return isQFS
        ? this.socialCategories.find(({ value }) => value == this.form['info-hr'].social_category)?.minSalary
        : 0
    },
    insuranceRateConfig() {
      const fund = this.socialFunds.find(({ id }) => id == this.form['pay'].cimr_rate_id)
      return {
        min: fund?.salary_rate_percent ? 0 : undefined,
        max: fund?.salary_rate_percent ? 100 : undefined,
      }
    },
  },
  watch: {
    'form.personal.firstname'(val) {
      this.form.personal.firstname = val ? val.toUpperCase() : val
    },
    'form.personal.lastname'(val) {
      this.form.personal.lastname = val ? val.toUpperCase() : val
    },
    'form.personal.address'(val) {
      this.form.personal.address = val ? val.toUpperCase() : val
    },
    'form.personal.phone_number'(newVal) {
      if (newVal && newVal.length == 2) {
        this.form.personal.phone_number = newVal + '-'
      }
    },
    'form.personal.cin'(val, oldVal) {
      if (val === null) {
        this.form.personal.cin = null
      } else {
        this.form.personal.cin = isQFS ? val.toUpperCase() : val?.length <= 8 ? val.toUpperCase() : oldVal
      }
    },
    'form.personal.bank_statement'(val, oldVal) {
      this.form.personal.bank_statement =
        val != null && val != '' && (val?.length > 24 || (!isQFS && isNaN(+val))) ? oldVal : val
    },
    'form.pay.cnss_nbr'(val, oldVal) {
      this.form.pay.cnss_nbr =
        val == null || val == '' || (val?.toString().length <= 9 && !isNaN(+val)) ? val : oldVal
    },
    'form.pointing-settings.template.card'(val, oldVal) {
      if (val) {
        this.form['pointing-settings'].template.card = /^[0-9]+$/.test(val) ? val : oldVal
      }
    },
    type(val) {
      if (val) {
        const {
          base_salary,
          calc_seniority,
          department_id,
          mission_id,
          pay_basis,
          auto_pause,
          fixed_time,
          calc_day_off,
          day_off,
          nbr_hours,
          type_day_off,
        } = val

        this.form.personal = { ...this.form.personal }
        this.form.pay = { ...this.form.pay, base_salary, pay_basis }
        this.form['info-hr'] = { ...this.form['info-hr'], calc_seniority, department_id, mission_id }
        this.form['pointing-settings'] = {
          template: this.form['pointing-settings'].template,
          auto_pause,
          fixed_time,
          calc_day_off,
          day_off,
          nbr_hours,
          type_day_off,
        }
      }
    },
    employee(newVal) {
      this.activeStep = 0

      if (newVal?.id) {
        let form = { id: newVal.id }

        if (!newVal.template) {
          newVal.template = { card: null }
        }

        this.steps.forEach((el) => {
          const item = this.form[el.key]

          if (item) {
            form = { ...form, [el.key]: {} }

            Object.keys(item).forEach((key) => {
              form[el.key] = {
                ...form[el.key],
                [key]: newVal[key],
              }
            })
          }
        })

        this.form = form

        this.declaredDays =
          this.form[this.steps[1].key].pre_declared_days +
          parseInt(newVal.processed_payroll_sum_nbr_declared_days ?? 0)
      } else {
        defaultForm.personal.gender = this.getGenders[0].value
        defaultForm.personal.uid = this.latest_uid
        this.form = JSON.parse(JSON.stringify(defaultForm))
      }
    },
  },
  methods: {
    ...mapActions('employee', ['newEmployee', 'updateEmployee']),
    ...mapActions('employeeTypes', ['fetchEmployeeType']),

    nextStep() {
      if (this.activeStep < this.steps.length - 1) {
        this.$refs[`form-${this.steps[this.activeStep].key}`].validate((valid) => {
          if (valid) {
            this.activeStep++
          }
        })
      }
    },
    previousStep() {
      if (this.activeStep > 0) {
        this.activeStep--
      }
    },
    getDeparture(departureId) {
      return this.departures?.find(({ id }) => id == departureId)?.label
    },
    getDepartment(departmentId) {
      return this.departments?.find(({ id }) => id == departmentId)?.label
    },
    getMission(missionId) {
      return this.missions?.find(({ id }) => id == missionId)?.label
    },
    getEmployeeType(typeId) {
      return this.types?.find(({ id }) => id == typeId)?.name
    },
    getBank(bankId) {
      return this.banks?.find(({ id }) => id == bankId)?.label
    },
    getLeader(leaderId) {
      const leader = this.leaders?.find(({ id }) => id == leaderId)
      return leader ? `${leader.firstname} ${leader.lastname} (${leader.uid})` : null
    },
    typeChanged(typeId) {
      this.loading = true
      this.fetchEmployeeType(typeId).finally(() => (this.loading = false))
    },
    disabledContractDate(time) {
      return isQFS && this.$dayjs(time).isAfter(this.form['info-hr'].end_contract_date, 'day', '[]')
    },
    onEndContractDateChange() {
      this.form['info-hr'].contract_date = null
    },
    save() {
      let form = {}

      this.steps.forEach(({ key }) => {
        form = { ...form, ...this.form[key] }
      })

      const {
        birth_date,
        hiring_date,
        end_contract_date,
        contract_date,
        cnss_nbr,
        insurance_rate,
        base_salary,
        upon_salary,
      } = form

      form = {
        ...form,
        birth_date: this.$dayjs(birth_date).format(),
        hiring_date: this.$dayjs(hiring_date).format(),
        contract_date: this.$dayjs(contract_date).format(),
        end_contract_date: isQFS ? this.$dayjs(end_contract_date).format() : null,
        cnss_nbr: cnss_nbr ? +cnss_nbr : null,
        insurance_rate: isQFS ? 0 : insurance_rate,
        base_salary: isQFS ? base_salary + upon_salary : base_salary,
      }

      this.loading = true

      if (this.form?.id) {
        this.updateEmployee({ id: this.form.id, ...form })
          .then(() => this.reset())
          .finally(() => (this.loading = false))
      } else {
        this.newEmployee(form)
          .then(() => this.reset())
          .finally(() => (this.loading = false))
      }
    },
    reset() {
      this.$dialog.close('create_edit_employee')
      this.loading = false
      this.activeStep = 0
      this.form = JSON.parse(JSON.stringify(defaultForm))
      this.$emit('reload')
    },
    onSocialCategoryChange() {
      if (isQFS)
        this.form['pay'].base_salary = this.socialCategories.find(
          ({ value }) => value == this.form['info-hr'].social_category,
        )?.minSalary
    },
    getLabelSocialCategory(category) {
      const label = this.getSocialCategory(category)?.label

      return label ? this.$t(label) : null
    },
  },
}
</script>
