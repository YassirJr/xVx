<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
    <div class="grid grid-cols-2 gap-x-5">
      <div class="col-span-1">
        <el-form-item prop="calc_seniority" :label="$t('calc-seniority')">
          <el-radio-group v-model="form.calc_seniority" class="!w-full">
            <el-radio-button
              v-for="(item, index) in employeeTypeStore.calcSeniorities"
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
      <div class="col-span-1">
        <el-form-item prop="pay_basis" :label="$t('pay-basis')">
          <el-radio-group v-model="form.pay_basis" class="!w-full">
            <el-radio-button
              v-for="(item, index) in employeeTypeStore.payBasis"
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
      <div class="col-span-1">
        <el-form-item prop="base_salary" :label="$t('base-salary')">
          <el-input-number v-model="form.base_salary" class="!w-full" :controls="false"></el-input-number>
        </el-form-item>
      </div>
      <div class="col-span-1 relative">
        <el-form-item prop="department_id" :label="$t('department')">
          <el-select v-model="form.department_id" class="!w-full" clearable filterable>
            <el-option
              v-for="department in departmentStore.departments"
              :key="department.id"
              :label="department.label"
              :value="department.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="col-span-1 relative">
        <el-form-item prop="mission_id" :label="$t('mission')">
          <el-select v-model="form.mission_id" class="!w-full" clearable filterable>
            <el-option
              v-for="mission in missionStore.missions"
              :key="mission.id"
              :label="mission.label"
              :value="mission.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { useMissionStore } from '@/stores/mission'
import { useDepartmentStore } from '@/stores/department'
import { t } from '@/plugins'

const props = defineProps({
  type: {
    type: Object,
    default: () => {},
  },
})

const formRef = ref(null)
const form = ref({
  calc_seniority: null,
  pay_basis: null,
  base_salary: null,
  department_id: null,
  mission_id: null,
})

const employeeTypeStore = useEmployeeTypeStore()
const departmentStore = useDepartmentStore()
const missionStore = useMissionStore()

const rules = reactive({
  calc_seniority: [
    {
      required: true,
      message: t('please-select-calc-seniority'),
      trigger: 'blur',
    },
  ],
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
  department_id: [
    {
      required: true,
      message: t('please-select-department'),
      trigger: 'blur',
    },
  ],
  mission_id: [
    {
      required: true,
      message: t('please-select-mission'),
      trigger: 'blur',
    },
  ],
})

const setForm = (data) => {
  if (data?.id) {
    Object.keys(form.value).forEach((key) => {
      form.value[key] = data[key]
    })
  } else {
    form.value = {
      calc_seniority: null,
      pay_basis: null,
      base_salary: null,
      department_id: null,
      mission_id: null,
    }
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
