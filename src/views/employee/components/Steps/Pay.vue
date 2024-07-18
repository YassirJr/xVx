<template>
  <el-form ref="formRef" :model="form" :rules="payRules" label-position="top">
    <div class="grid grid-cols-4 gap-x-5">
      <div class="col-span-2">
        <el-form-item prop="pay_basis" :label="$t('pay-basis')">
          <el-radio-group v-model="form.pay_basis" class="!w-full">
            <el-radio-button
              v-for="(item, index) in empTypeStore.payBasis"
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
            v-model="form.base_salary"
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
            v-model="form.upon_salary"
            class="!w-full"
            :controls="false"
            :min="0"
          ></el-input-number>
        </el-form-item>
      </div>
      <div class="col-span-2">
        <el-form-item :label="$t(isQFS ? 'css-nbr' : 'cnss-nbr')" prop="cnss_nbr">
          <el-input v-model="form.cnss_nbr" class="!w-full"></el-input>
        </el-form-item>
      </div>
      <div class="col-span-4">
        <el-divider></el-divider>
      </div>
      <div class="col-span-2">
        <el-form-item :label="isQFS ? $t('ipres-nbr') : $t('cimr-nbr')" prop="cimr_nbr">
          <el-input-number v-model="form.cimr_nbr" class="!w-full" :controls="false"></el-input-number>
        </el-form-item>
      </div>
      <div class="col-span-2">
        <el-form-item :label="isQFS ? $t('ipres-rc-rate') : $t('cimr-rate')" prop="cimr_rate_id">
          <el-select v-model="form.cimr_rate_id" clearable filterable class="w-full">
            <el-option
              v-for="fund in socialFundStore.socialFunds.filter(({ fund }) =>
                isQFS
                  ? fund == socialFundStore.getFundsList[0].value
                  : fund == socialFundStore.getFundsList[2].value,
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
          <el-input v-model="form.complementary_insurance"></el-input>
        </el-form-item>
      </div>
      <div class="col-span-2">
        <el-form-item v-if="isQFS" :label="$t('insurance-rate')" prop="ipm_id">
          <el-select v-model="form.ipm_id" clearable filterable class="w-full">
            <el-option
              v-for="fund in socialFundStore.socialFunds.filter(
                ({ fund }) => fund == socialFundStore.getFundsList[3].value,
              )"
              :key="fund.id"
              :label="fund.label"
              :value="fund.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else :label="$t('insurance-rate')" prop="insurance_rate">
          <el-input-number
            v-model="form.insurance_rate"
            class="!w-full"
            controls-position="right"
            :min="insuranceRateConfig.min"
            :max="insuranceRateConfig.max"
          ></el-input-number>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup>
import { isQFS } from '@/helpers'
import { t } from '@/plugins'
import { computed, onMounted, ref, watch } from 'vue'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { useSocialFundStore } from '@/stores/socialFund'
import { useEmployeeStore } from '@/stores/employee'

const props = defineProps({
  employee: {
    type: Object,
    default: () => {},
  },
  type: {
    type: Object,
    default: () => {},
  },
  baseSalary: {
    type: Number,
    default: null,
  },
  socialCategory: {
    type: String,
    default: null,
  },
})

const formInit = {
  pay_basis: null,
  base_salary: null,
  upon_salary: null,
  cnss_nbr: null,
  cimr_nbr: null,
  cimr_rate_id: null,
  complementary_insurance: null,
  insurance_rate: null,
  ipm_id: null,
}
const formRef = ref(null)
const form = ref({ ...formInit })
const empTypeStore = useEmployeeTypeStore()
const socialFundStore = useSocialFundStore()
const employeeStore = useEmployeeStore()

const payRules = computed(() => ({
  pay_basis: [
    {
      required: true,
      message: t('please-select-pay-basis'),
      trigger: 'blur',
    },
  ],
  base_salary: [
    {
      required: true,
      message: t('please-input-base-salary'),
      trigger: 'blur',
    },
    {
      type: 'number',
      message: t('base-salary-invalid'),
      trigger: 'blur',
    },
  ],
  upon_salary: [
    {
      required: isQFS,
      message: t('please-input-upon-salary'),
      trigger: 'blur',
    },
  ],
  cnss_nbr: [
    {
      pattern: /^[0-9]{9}/g,
      message: t(isQFS ? 'css-nbr-invalid' : 'cnss-nbr-invalid'),
      trigger: 'blur',
    },
  ],
}))

const minBaseSalary = computed(() => {
  return isQFS
    ? employeeStore.socialCategories.find(({ value }) => value == props.socialCategory)?.minSalary
    : 0
})

const insuranceRateConfig = computed(() => {
  const fund = socialFundStore.socialFunds.find(({ id }) => id == form.value.cimr_rate_id)
  return {
    min: fund?.salary_rate_percent ? 0 : undefined,
    max: fund?.salary_rate_percent ? 100 : undefined,
  }
})

watch(
  () => form.value.cnss_nbr,
  (newVal, oldVal) => {
    const cnss_nbr =
      newVal == null || newVal == '' || (newVal?.toString().length <= 9 && !isNaN(+newVal)) ? newVal : oldVal
    form.value = Object.assign({}, { ...form.value, cnss_nbr })
  },
)
watch(
  () => props.baseSalary,
  (newVal) => {
    form.value = Object.assign({}, { ...form.value, base_salary: newVal })
  },
)

const setForm = (data) => {
  if (data?.id) {
    Object.keys(formInit).forEach((key) => {
      form.value[key] = data[key]
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
      const { base_salary, pay_basis } = props.type
      form.value = Object.assign({}, { ...form.value, base_salary, pay_basis })
    }
  },
)

defineExpose({
  formRef,
  form,
})
</script>
