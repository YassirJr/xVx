<template>
  <el-dialog
    draggable
    :title="$t(payrollVariable?.id ? 'edit-payroll-variable' : 'create-new-payroll-variable')"
    :model-value="$dialog.visible('create_edit_payroll_variable')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_payroll_variable')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="'col-span-1'">
            <el-form-item :label="$t('payroll-sections')" prop="payroll_section_id">
              <el-select v-model="form.payroll_section_id" clearable filterable class="w-full">
                <el-option
                  v-for="payrollSection in filteredPayrollSections"
                  :key="payrollSection.id"
                  :label="payrollSection.label"
                  :value="payrollSection.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <template v-if="!payrollVariable?.id">
            <div class="'col-span-1'">
              <el-form-item :label="$t('pay-closure')" prop="pay_closure_id">
                <el-select-v2
                  v-model="form.pay_closure_id"
                  class="w-full mr-2"
                  clearable
                  filterable
                  :options="payClosures.map((el) => ({ ...el, label: labelDate(el) }))"
                  value-key="id"
                ></el-select-v2>
              </el-form-item>
            </div>
            <div class="col-span-2">
              <el-divider></el-divider>
            </div>
            <div class="col-span-2">
              <div class="flex justify-between items-center mb-5">
                <div>
                  <el-form-item :label="$t('default-data')" prop="value">
                    <el-input-number
                      v-model="default_data"
                      :disabled="disableInput"
                      :controls="false"
                      :precision="2"
                      :min="0"
                    />
                  </el-form-item>
                </div>
                <div class="flex">
                  <el-select-v2
                    v-model="employee"
                    clearable
                    filterable
                    :reserve-keyword="false"
                    :disabled="disableInput"
                    :options="filteredEmployees"
                    value-key="id"
                  ></el-select-v2>
                  <el-button class="ml-3" type="primary" :disabled="!employee" @click="newEmployee()">
                    <i-el-plus class="mr-2" />
                    {{ $t('add') }}
                  </el-button>
                </div>
              </div>
            </div>
            <div class="col-span-2">
              <el-form-item label="" prop="employees">
                <vxe-table
                  :key="form.employees.length"
                  class="w-full"
                  :data="form.employees"
                  border
                  round
                  stripe
                  max-height="450"
                  show-overflow
                >
                  <vxe-column field="fullname" :title="$t('fullname')"></vxe-column>
                  <vxe-column
                    field="value"
                    :title="$t('value')"
                    :class-name="({ rowIndex }) => (!form.employees[rowIndex].id ? 'bg-danger/10' : null)"
                  >
                    <template #default="{ rowIndex }">
                      <el-form-item
                        :key="rowIndex"
                        class="!m-0"
                        :show-message="false"
                        :prop="`value_${rowIndex}`"
                      >
                        <el-input-number
                          v-model="form.employees[rowIndex].value"
                          :controls="false"
                          :min="0"
                          :precision="2"
                        />
                      </el-form-item>
                    </template>
                  </vxe-column>
                  <vxe-column field="actions" :title="$t('actions')" :width="100" align="center">
                    <template #default="{ row }">
                      <el-button type="danger" plain @click="removeEmployee(row.id)">
                        <i-el-delete />
                      </el-button>
                    </template>
                  </vxe-column>
                </vxe-table>
              </el-form-item>
            </div>
          </template>
          <template v-else>
            <div class="col-span-1">
              <el-form-item :label="$t('value')">
                <el-input-number
                  v-model="form.value"
                  class="!w-full"
                  :controls="false"
                  :precision="2"
                  :min="0"
                />
              </el-form-item>
            </div>
          </template>
        </div>
      </el-form>
      <div
        v-if="isErrorsExist"
        class="col-span-1 text-start text-sm text-red-500 max-h-28 overflow-y-auto mb-2 pr-4"
      >
        <p>{{ $t('please-fix-the-following-errors') }} :</p>
        <div v-if="importErrors.invalidLength" class="ml-2">{{ $t('the-number-of-columns-is-invalid') }}</div>
        <div v-else>
          <ul>
            <li v-for="(row, index) in importErrors.rows" :key="index" class="ml-2">
              <span class="pr-2">{{ $t('in-position') }} :</span>
              <span>{{ row.join(', ') }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <template #footer>
      <div :class="payrollVariable?.id ? 'flex justify-end' : 'flex justify-between'">
        <import-excel
          v-if="!payrollVariable?.id"
          :disabled="!employeeStore.employees.length"
          :model-data="modelData"
          :validation-row="validationRow"
          :cols-nbr="2"
          @import-change="importChange"
          @loading="importLoading"
          @error-change="errorChange"
        />
        <div>
          <el-button
            plain
            :type="payrollVariable?.id ? 'warning' : 'primary'"
            :loading="loading"
            :disabled="loading"
            @click="save()"
          >
            {{ $t('save') }}
          </el-button>
          <el-button
            plain
            type="info"
            :loading="loading"
            :disabled="loading"
            @click="$dialog.close('create_edit_payroll_variable')"
          >
            {{ $t('cancel') }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useDialog, getExcelModelData, labelDate } from '@/helpers'
import { t } from '@/plugins'
import ImportExcel from '@/components/ImportExcel'

import { useEmployeeStore } from '@/stores/employee'
import { usePayrollSectionStore } from '@/stores/payrollSection'
import { usePayrollVariableStore } from '@/stores/payrollVariable'

const employeeStore = useEmployeeStore()
const payrollVariableStore = usePayrollVariableStore()
const payrollSectionStore = usePayrollSectionStore()

const props = defineProps({
  payrollVariable: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['reload'])

const initForm = reactive({
  employee_type_id: null,
  employee_id: null,
  payroll_section_id: null,
  pay_closure_id: null,
  value: null,
  employees: [],
})
const form = ref(initForm)
const formRef = ref()
const loading = ref(false)
const employee = ref(null)
const default_data = ref(0)
const importErrors = ref({})
const payClosures = ref([])
const rules = reactive({
  payroll_section_id: [
    {
      required: true,
      message: t('please-select-payroll-section'),
      trigger: 'blur',
    },
  ],
  pay_closure_id: [
    {
      required: true,
      message: t('please-select-pay-closure'),
      trigger: 'blur',
    },
  ],
  employees: [
    {
      required: true,
      message: t('please-add-at-least-one-employee'),
      trigger: 'blur',
      type: 'array',
      min: 1,
    },
  ],
})

const filteredEmployees = computed(() => {
  return employeeStore.employees
    ?.filter(({ type_id }) => form.value?.employee_type_id == type_id)
    ?.map((el) => ({ ...el, label: `${el.firstname} ${el.lastname} (${el.uid})` }))
})

const filteredPayrollSections = computed(() => {
  return payrollSectionStore.payrollSections.filter(
    ({ section_type, mode }) =>
      section_type == payrollSectionStore.sectionTypes[0].value && mode == payrollSectionStore.modes[0].value,
  )
})

const disableInput = computed(() => !(form.value?.employee_type_id && form.value?.payroll_section_id))

const isErrorsExist = computed(() => Object.keys(importErrors.value).length != 0)

const modelData = computed(() =>
  getExcelModelData([
    { title: t('code'), modelVal: { type: 'number' } },
    { title: t('value'), modelVal: { type: 'number' } },
  ]),
)

watch(
  () => props.payrollVariable,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = Object.assign(
        {},
        { ...initForm, employee_type_id: newVal.employee_type_id, employees: [] },
      )
      payClosures.value = newVal.payClosures
    }
  },
)

const newEmployee = () => {
  if (employee.value) {
    const newEmployee = employeeStore.employees?.find(({ id }) => id == employee.value)
    const { id, firstname, lastname, uid } = newEmployee

    form.value.employees.push({
      id,
      fullname: `${firstname} ${lastname} (${uid})`,
      value: default_data.value,
    })

    employee.value = null
  }
}

const removeEmployee = (employeeId) => {
  form.value.employees = form.value.employees.filter(({ id }) => id != employeeId)
}

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        payrollVariableStore
          .updatePayrollVariable(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        const { employee_type_id, payroll_section_id, pay_closure_id, employees } = form.value
        const data = employees.map((el) => ({
          employee_id: el.id,
          employee_type_id,
          payroll_section_id,
          pay_closure_id,
          value: el.value || 0,
        }))

        payrollVariableStore
          .newPayrollVariable(data)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_payroll_variable')
  loading.value = false
  employee.value = null
  default_data.value = 0
  form.value = Object.assign({}, initForm)
  emit('reload')
}

const importChange = (data) => Object.assign(form.value, { employees: [...form.value.employees, ...data] })

const importLoading = (value) => (loading.value = value)

const errorChange = (errors) => (importErrors.value = errors)

const validationRow = (row, chooseValidator) => {
  let isRowInvalid = false
  let processedRow
  const uidCell = row[0]
  const valueCell = row[1]
  const employee = chooseValidator('employee')(uidCell?.value)
  const value = chooseValidator('value')(valueCell?.value)

  if (!employee || !value) {
    processedRow = [!employee ? uidCell?.ref : null, !value ? valueCell?.ref : null].filter((el) => el)
    isRowInvalid = true
  } else {
    const { id, firstname, lastname, uid } = employee
    processedRow = { id, fullname: `${firstname} ${lastname} (${uid})`, value }
  }

  return { isRowInvalid, processedRow }
}
</script>
