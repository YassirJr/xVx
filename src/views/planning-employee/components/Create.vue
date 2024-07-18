<template>
  <el-dialog
    draggable
    :title="$t('add-new-planning')"
    :model-value="useDialog.visible('create_planning_employee')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="75%"
    @close="useDialog.close('create_planning_employee')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="grid grid-cols-12 gap-x-5">
          <div class="col-span-9">
            <el-form-item :label="$t('date-range')" prop="daterange">
              <el-date-picker
                v-model="form.daterange"
                class="!w-full !inline-flex"
                type="daterange"
                unlink-panels
                :clearable="false"
                :range-separator="$t('to')"
                :start-placeholder="$t('start-date')"
                :end-placeholder="$t('end-date')"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item :label="$t('max-time')" prop="max_time">
              <el-time-picker
                v-model="form.max_time"
                class="!w-full !inline-flex"
                format="HH:mm"
                :clearable="false"
              ></el-time-picker>
            </el-form-item>
          </div>
          <div class="col-span-6">
            <el-form-item :label="$t('employee-types')" prop="employeeTypeId">
              <el-select
                v-model="employeeTypeId"
                :disabled="disableEmployeeTypes"
                clearable
                filterable
                class="w-full"
                @change="onEmployeeTypeChange"
              >
                <el-option
                  v-for="type in employeeTypeStore.types"
                  :key="type.id"
                  :label="type.name"
                  :value="type.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-6">
            <el-form-item :label="$t('employees')" prop="employees">
              <el-select-v2
                ref="empSelectRef"
                v-model="form.employees"
                multiple
                filterable
                clearable
                :reserve-keyword="false"
                :disabled="disableEmployees"
                :options="employeeOptions"
                value-key="id"
                class="w-full"
                collapse-tags
                @change="onEmployeeChange"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-12">
            <el-divider></el-divider>
            <vxe-table border show-overflow :max-height="400" :data="planning">
              <vxe-column field="fullname" :title="$t('fullname')"></vxe-column>
              <vxe-column field="start_date" :title="$t('start-date')">
                <template #default="{ rowIndex }">
                  {{ planning[rowIndex].start_date.format(dateLabelFormat(true)) }}
                </template>
              </vxe-column>
              <vxe-column field="end_date" :title="$t('end-date')">
                <template #default="{ rowIndex }">
                  {{ planning[rowIndex].end_date.format(dateLabelFormat(true)) }}
                </template>
              </vxe-column>
              <vxe-column field="max_time" :title="$t('max-time')">
                <template #default="{ rowIndex }">
                  <el-form-item
                    :key="rowIndex"
                    class="!m-0"
                    :required="!planning[rowIndex].max_time"
                    :show-message="false"
                    :prop="`max_time_${rowIndex}`"
                  >
                    <el-time-picker
                      v-model="planning[rowIndex].max_time"
                      class="!w-full !inline-flex"
                      format="HH:mm"
                      :clearable="false"
                    ></el-time-picker>
                  </el-form-item>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>
      </el-form>
      <div v-if="isEmptyPlanning" class="text-xs text-red-500 mt-4">
        {{ $t('please-add-at-least-one-planning') }}
      </div>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          type="primary"
          :loading="loading"
          :disabled="loading || isFormValid || isEmptyPlanning"
          @click="save()"
        >
          {{ $t('save') }}
        </el-button>
        <el-button plain type="info" :loading="loading" :disabled="loading" @click="reset()">
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { t, dayjs } from '@/plugins'
import { useDialog, dateLabelFormat } from '@/helpers'
import { usePlanningEmployeeStore } from '@/stores/planningEmployee'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { useEmployeeStore } from '@/stores/employee'

const emit = defineEmits(['reload'])

const loading = ref(false)
const employeeTypeId = ref(null)
const form = ref({
  daterange: null,
  max_time: null,
  employees: [],
})
const empSelectRef = ref(null)
const formRef = ref(null)
const planning = ref([])

const planningEmployeeStore = usePlanningEmployeeStore()
const employeeTypeStore = useEmployeeTypeStore()
const employeeStore = useEmployeeStore()

const rules = reactive({
  daterange: [
    {
      required: true,
      message: t('please-select-daterange-of-the-planning'),
      trigger: 'blur',
      min: 2,
      max: 2,
      type: 'array',
    },
  ],
  max_time: [
    {
      required: true,
      message: t('please-set-max-time-of-the-planning'),
      trigger: 'blur',
    },
  ],
})

const disableEmployees = computed(() => {
  return disableEmployeeTypes.value || !employeeTypeId.value
})

const disableEmployeeTypes = computed(() => {
  const { daterange, max_time } = form.value
  return !(max_time && daterange?.length == 2)
})

const isFormValid = computed(() => {
  return !(planning.value.filter(({ max_time }) => !max_time).length == 0)
})

const filteredEmployees = computed(() => {
  return employeeStore.employees.filter((el) => el.type_id == employeeTypeId.value || !employeeTypeId.value)
})

const filteredEmployeeIDs = computed(() => {
  return filteredEmployees.value.map(({ id }) => id)
})

const isEmptyPlanning = computed(() => {
  return planning.value.length === 0
})

const employeeOptions = computed(() => {
  const selectAllGroup = {
    value: t('select-all'),
    label: t('select-all'),
    options: [
      {
        id: -1,
        label: t('select-all-employees'),
        disabled: form.value.employees.filter((el) => el != -1).length == filteredEmployeeIDs.value.length,
      },
    ],
  }

  const employeesGroup = {
    value: t('employees-list'),
    label: t('employees-list'),
    options: filteredEmployees.value.map((el) => ({
      ...el,
      label: `${el.firstname} ${el.lastname} (${el.uid})`,
    })),
  }

  return [selectAllGroup, employeesGroup]
})

const onEmployeeChange = (value) => {
  loading.value = true
  if (value.includes(-1)) {
    empSelectRef.value.dropdownMenuVisible = false
    setTimeout(() => {
      form.value.employees = filteredEmployeeIDs.value
      planning.value = getMultiPlanning(filteredEmployees.value)
      loading.value = false
    }, 200)
  } else {
    setTimeout(() => {
      planning.value = getMultiPlanning(
        filteredEmployees.value.filter(({ id }) => form.value.employees.includes(id)),
      )
      loading.value = false
    }, 200)
  }
}

const onEmployeeTypeChange = () => {
  form.value = {
    ...form.value,
    employees: [],
  }
  planning.value = []
}

const getMultiPlanning = (employees) => {
  const start_date = dayjs(form.value.daterange[0])
  const end_date = dayjs(form.value.daterange[1])
  const max_time = form.value.max_time

  return employees.map((el, i) => {
    return {
      index: i,
      employee_id: el.id,
      uid: el.uid,
      fullname: `${el.firstname} ${el.lastname}`,
      start_date,
      end_date,
      max_time,
      type_id: el.type_id,
    }
  })
}

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const data = planning.value.map((el) => ({
        employee_id: el.employee_id,
        start_date: dayjs(el.start_date).format(),
        end_date: dayjs(el.end_date).format(),
        max_time: dayjs(el.max_time).format(),
      }))

      loading.value = true
      planningEmployeeStore
        .create(data)
        .then(() => reset())
        .finally(() => (loading.value = false))
    }
  })
}

const reset = () => {
  form.value = {
    daterange: null,
    max_time: null,
    employees: [],
  }
  employeeTypeId.value = null
  planning.value = []

  emit('reload')
  useDialog.close('create_planning_employee')
}
</script>
