<template>
  <el-form ref="formRef" v-loading="loading" :model="form" :rules="infoHrRules" label-position="top">
    <div class="grid grid-cols-4 gap-x-5">
      <div class="col-span-2 relative">
        <el-form-item :label="$t('type')" prop="type_id">
          <el-select
            v-model="form.type_id"
            class="w-full"
            clearable
            filterable
            @change="typeChanged(form.type_id)"
          >
            <el-option
              v-for="(empType, i) in empTypeStore.types"
              :key="i"
              :label="empType.name"
              :value="empType.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="absolute right-0 top-0">
          <el-button type="primary" text size="small" @click="useDialog.open('create_edit_employee_type')">
            {{ $t('new-type') }}
          </el-button>
        </div>
      </div>
      <div class="col-span-2">
        <el-form-item :label="$t('leader')" prop="leader_id">
          <el-select-v2
            v-model="form.leader_id"
            clearable
            filterable
            :options="
              employeeStore.leaders.map((el) => ({
                ...el,
                label: `${el.firstname} ${el.lastname} (${el.uid})`,
              }))
            "
            value-key="id"
            class="w-full"
          ></el-select-v2>
        </el-form-item>
      </div>
      <div :class="isQFS ? 'col-span-1' : 'col-span-2'">
        <el-form-item class="!w-full" :label="$t('hiring-date')" prop="hiring_date">
          <el-date-picker v-model="form.hiring_date" class="!w-full" format="DD-MM-YYYY"></el-date-picker>
        </el-form-item>
      </div>
      <div v-if="isQFS" class="col-span-1">
        <el-form-item :label="$t('contract-type')" prop="contract_type">
          <el-select-v2
            v-model="form.contract_type"
            clearable
            filterable
            :reserve-keyword="false"
            :options="employeeStore.contractTypes.map((el) => ({ ...el, label: $t(el.label) }))"
            value-key="value"
            class="w-full"
          ></el-select-v2>
        </el-form-item>
      </div>
      <div :class="isQFS ? 'col-span-1' : 'col-span-2'">
        <el-form-item class="!w-full" :label="$t('contract-date')" prop="contract_date">
          <el-date-picker
            v-model="form.contract_date"
            class="!w-full"
            format="DD-MM-YYYY"
            :disabled-date="disabledContractDate"
          ></el-date-picker>
        </el-form-item>
      </div>
      <div v-if="isQFS" class="col-span-1">
        <el-form-item class="!w-full" :label="$t('end-contract-date')" prop="end_contract_date">
          <el-date-picker
            v-model="form.end_contract_date"
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
              <label class="w-full">
                {{ form.pre_declared_days + employeeStore.employeeNumberDays }}
              </label>
            </template>
            <template v-else>
              <el-input-number
                v-model="form.pre_declared_days"
                class="!w-full"
                :min="0"
                :value-on-clear="0"
              ></el-input-number>
            </template>
          </el-form-item>
        </div>
        <div class="col-span-5">
          <el-form-item prop="calc_seniority" :label="$t('calc-seniority')">
            <el-radio-group v-model="form.calc_seniority" class="!w-full">
              <el-radio-button
                v-for="(item, index) in empTypeStore.calcSeniorities"
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
          <el-select v-model="form.mission_id" class="!w-full" clearable filterable>
            <el-option
              v-for="mission in missionStore.missions"
              :key="mission.id"
              :label="mission.label"
              :value="mission.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="absolute right-0 top-0">
          <el-button type="primary" text size="small" @click="useDialog.open('create_edit_mission')">
            {{ $t('new-mission') }}
          </el-button>
        </div>
      </div>
      <div class="col-span-2 relative">
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
        <div class="absolute right-0 top-0">
          <el-button type="primary" text size="small" @click="useDialog.open('create_edit_department')">
            {{ $t('new-department') }}
          </el-button>
        </div>
      </div>
      <div class="col-span-2">
        <el-form-item prop="social_category" :label="$t('social-category')">
          <el-select
            v-model="form.social_category"
            class="!w-full"
            clearable
            filterable
            @change="onSocialCategoryChange()"
          >
            <el-option
              v-for="category in employeeStore.socialCategories"
              :key="category.value"
              :label="$t(category.label)"
              :value="category.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
    </div>
  </el-form>

  <new-type></new-type>
  <new-department></new-department>
  <new-mission></new-mission>
</template>

<script setup>
import { isQFS, useDialog } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { computed, onMounted, ref, watch } from 'vue'
import NewType from '@/views/employee-types/components/CreateEdit'
import NewMission from '@/views/mission/components/CreateEdit'
import NewDepartment from '@/views/department/components/CreateEdit'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { useDepartmentStore } from '@/stores/department'
import { useEmployeeStore } from '@/stores/employee'
import { useMissionStore } from '@/stores/mission'

const emit = defineEmits(['socialCategoryChange'])
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
}
const formRef = ref(null)
const form = ref({ ...formInit })
const empTypeStore = useEmployeeTypeStore()
const employeeStore = useEmployeeStore()
const missionStore = useMissionStore()
const departmentStore = useDepartmentStore()
const loading = ref(false)

const infoHrRules = computed(() => ({
  type_id: [
    {
      required: true,
      message: t('please-select-employee-type'),
      trigger: 'blur',
    },
  ],
  hiring_date: [
    {
      required: true,
      message: t('please-select-hiring-date'),
      trigger: 'blur',
    },
  ],
  end_contract_date: [
    {
      required: isQFS,
      message: t('please-select-end-contract-date'),
      trigger: 'blur',
    },
  ],
  contract_date: [
    {
      required: true,
      message: t('please-select-contract-date'),
      trigger: 'blur',
    },
  ],
  pre_declared_days: [
    {
      required: true,
      message: t('please-input-declared-days'),
      trigger: 'blur',
    },
  ],
  calc_seniority: [
    {
      required: true,
      message: t('please-select-calc-seniority'),
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
  social_category: [
    {
      required: isQFS,
      message: t('please-select-social-category'),
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
}))

const typeChanged = (typeId) => {
  loading.value = true
  empTypeStore.fetchEmployeeType(typeId).finally(() => (loading.value = false))
}
const disabledContractDate = (time) => {
  return isQFS && dayjs(time).isAfter(form.value.end_contract_date, 'day', '[]')
}
const onEndContractDateChange = () => {
  form.value.contract_date = null
}

const onSocialCategoryChange = () => {
  emit('socialCategoryChange', form.value.social_category)
}

const setForm = (data) => {
  if (data?.id) {
    const { hiring_date, contract_date } = data
    let employee = {
      ...data,
      hiring_date: dayjs(hiring_date, 'DD-MM-YYYY').toString(),
      contract_date: dayjs(contract_date, 'DD-MM-YYYY').toString(),
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
      const { calc_seniority, department_id, mission_id } = newVal
      form.value = Object.assign({}, { ...form.value, calc_seniority, department_id, mission_id })
    }
  },
)

defineExpose({
  formRef,
  form,
})
</script>
