<template>
  <el-dialog
    draggable
    :title="$t(pointing?.id ? 'edit-pointing-in-out' : 'create-new-pointing-in-out')"
    :model-value="useDialog.visible('create_edit_pointing_in_out')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_pointing_in_out')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="getRules" label-position="top">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('site')" prop="site_id">
              <el-select v-model="form.site_id" clearable filterable class="w-full">
                <el-option
                  v-for="(site, index) in siteStore.sites"
                  :key="index"
                  :label="site.name"
                  :value="site.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('reason')" prop="reason_id">
              <el-select v-model="form.reason_id" clearable filterable class="w-full">
                <el-option
                  v-for="(reason, index) in pointingReasonStore.reasons"
                  :key="index"
                  :label="reason.reason"
                  :value="reason.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <template v-if="!pointing?.id">
            <div class="col-span-2">
              <el-divider></el-divider>
            </div>
            <div class="col-span-2">
              <div class="flex justify-between items-center mb-5">
                <div>
                  <el-date-picker
                    v-model="pointingDatetime"
                    type="datetime"
                    :format="DATE_TIME_FORMAT"
                    :disabled-date="disabledDate"
                    :default-value="defaultDate"
                  />
                </div>
                <div class="flex">
                  <el-select-v2
                    v-model="employee"
                    clearable
                    filterable
                    :reserve-keyword="false"
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
                  :key="form.employees?.length"
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
                    field="added_at"
                    :title="$t('added-at')"
                    :class-name="
                      ({ rowIndex }) => (!form.employees[rowIndex].added_at ? 'bg-danger/10' : null)
                    "
                  >
                    <template #default="{ rowIndex }">
                      <el-form-item
                        :key="rowIndex"
                        class="!m-0"
                        :required="!form.employees[rowIndex].added_at"
                        :show-message="false"
                        :prop="`pointing_datetime_${rowIndex}`"
                      >
                        <el-date-picker
                          :key="rowIndex"
                          v-model="form.employees[rowIndex].added_at"
                          type="datetime"
                          :format="DATE_TIME_FORMAT"
                          :disabled-date="disabledDate"
                        ></el-date-picker>
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
            <div class="col-span-2">
              <el-form-item class="!m-0" :required="!form.added_at" :show-message="false" prop="added_at">
                <el-date-picker
                  v-model="form.added_at"
                  class="!w-full"
                  type="datetime"
                  :format="DATE_TIME_FORMAT"
                  :disabled-date="disabledDate"
                ></el-date-picker>
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
              <span>{{ row.join(', ') }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-between">
        <import-excel
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
            :type="pointing?.id ? 'warning' : 'primary'"
            :loading="loading"
            :disabled="loading || isDateTimesValid"
            @click="save()"
          >
            {{ $t('save') }}
          </el-button>
          <el-button
            plain
            type="info"
            :loading="loading"
            :disabled="loading"
            @click="useDialog.close('create_edit_pointing_in_out')"
          >
            {{ $t('cancel') }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import ImportExcel from '@/components/ImportExcel'
import { getExcelModelData, useDialog } from '@/helpers'
import { DATE_TIME_FORMAT } from '@/constants'
import { ref, computed, watch } from 'vue'
import { dayjs, t } from '@/plugins'
import { usePointingInOutStore } from '@/stores/pointingInOut'
import { useEmployeeStore } from '@/stores/employee'
import { usePointingReasonStore } from '@/stores/pointingReason'
import { useSiteStore } from '@/stores/site'

const props = defineProps({
  pointing: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const employee = ref(null)
const pointingDatetime = ref(null)
const importErrors = ref({})
const form = ref({
  is_nature: false,
  site_id: null,
  employee_id: null,
  reason_id: null,
  added_at: null,
  employees: [],
})
const formRef = ref(null)

const pointingInOutStore = usePointingInOutStore()
const employeeStore = useEmployeeStore()
const pointingReasonStore = usePointingReasonStore()
const siteStore = useSiteStore()

const rules = ref({
  site_id: [
    {
      required: true,
      message: t('please-select-site'),
      trigger: 'blur',
    },
  ],
  reason_id: [
    {
      required: true,
      message: t('please-select-reason'),
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

const dateTimeRule = ref({
  added_at: [
    {
      required: true,
      message: t('please-select-date-and-time'),
      trigger: 'blur',
    },
  ],
})

const filteredEmployees = computed(() => {
  return props.pointing?.id
    ? []
    : employeeStore.employees
        .filter(
          ({ id, type_id }) =>
            !form.value.employees.map((el) => el.id).includes(id) &&
            type_id === props.pointing.payClosure.employee_type_id,
        )
        .map((el) => ({
          ...el,
          label: `${el.firstname} ${el.lastname} (${el.uid})`,
        }))
})

const getRules = computed(() => {
  return props.pointing?.id ? rules.value : { ...rules.value, ...dateTimeRule.value }
})

const isDateTimesValid = computed(() => {
  return props.pointing?.id ? false : form.value.employees.filter(({ added_at }) => !added_at)?.length > 0
})

const defaultDate = computed(() => {
  return dayjs(props.pointing.payClosure.start_date).toDate()
})

const isErrorsExist = computed(() => {
  return Object.keys(importErrors.value)?.length != 0
})

const modelData = computed(() => {
  const randomDate = dayjs(props.pointing.payClosure.start_date)
    .add(Math.floor(Math.random() * 3), 'day')
    .format(DATE_TIME_FORMAT)

  return getExcelModelData([
    {
      title: t('code'),
      modelVal: {
        type: 'number',
      },
    },
    {
      title: t('date-time'),
      modelVal: randomDate,
    },
  ])
})

watch(
  () => props.pointing,
  (newVal) => {
    importErrors.value = {}
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = {
        is_nature: false,
        site_id: null,
        employee_id: null,
        reason_id: null,
        added_at: null,
        pay_closure_id: newVal.payClosure.id,
        employees: [],
      }

      pointingDatetime.value =
        pointingDatetime.value && disabledDate(pointingDatetime.value) ? null : pointingDatetime.value
    }
  },
)

watch(
  () => getRules.value,
  () => {
    if (formRef.value) {
      const timeout = setTimeout(() => {
        formRef.value.clearValidate()
        clearTimeout(timeout)
      }, 50)
    }
  },
)

watch(
  () => pointingDatetime.value,
  (newVal) => {
    for (let i = 0; i < form.value.employees?.length; i++) {
      form.value.employees[i].added_at = newVal
    }
  },
)

const newEmployee = () => {
  if (employee.value) {
    const selectedEmployee = employeeStore.employees.find((el) => el.id == employee.value)
    const { id, firstname, lastname, uid } = selectedEmployee

    form.value.employees.push({
      id,
      fullname: `${firstname} ${lastname} (${uid})`,
      added_at: pointingDatetime.value ? pointingDatetime.value : dayjs().toString(),
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
        form.value.added_at = dayjs(form.value.added_at).format()
        pointingInOutStore
          .updatePointingInOut(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        const { is_nature, site_id, reason_id, pay_closure_id, employees } = form.value
        const data = employees.map((el) => {
          return {
            is_nature,
            site_id,
            reason_id,
            pay_closure_id,
            employee_id: el.id,
            added_at: dayjs(el.added_at).format(),
          }
        })

        pointingInOutStore
          .newPointingInOut(data)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_pointing_in_out')
  loading.value = false
  form.value = {
    is_nature: false,
    site_id: null,
    employee_id: null,
    reason_id: null,
    added_at: null,
    employees: [],
  }
  emit('reload')
}

const disabledDate = (date) => {
  let start_date = +dayjs(props.pointing.payClosure.start_date).subtract(1, 'day')
  let end_date = +dayjs(props.pointing.payClosure.end_date).add(1, 'day')
  return date.getTime() > end_date || start_date > date.getTime()
}

const importChange = (data) => {
  form.value.employees = [...form.value.employees, ...data]
}

const importLoading = (val) => {
  loading.value = val
}

const validationRow = (row, chooseValidator) => {
  let isRowInvalid = false
  let processedRow
  const uidCell = row[0]
  const dateTimeCell = row[1]
  const employee = chooseValidator('employee')(uidCell?.value)
  const dateTime = chooseValidator('datetime')(dateTimeCell?.value)
  const startDate = +dayjs(props.pointing.payClosure.start_date).subtract(1, 'day')
  const endDate = +dayjs(props.pointing.payClosure.end_date).add(1, 'day')
  const isDateTimeValid = dateTime.isValid() && dateTime.isBetween(startDate, endDate, 'day', '[]')
  const errMsg = () => {
    const messages = []
    if (!employee) messages.push([uidCell?.ref, ':', t('this-employee-is-not-exist')].join(' '))

    if (!dateTime) messages.push([dateTimeCell?.ref, ':', t('the-date-is-invalid')].join(' '))
    else if (!dateTime.isBetween(startDate, endDate, 'day', '[]'))
      messages.push([dateTimeCell?.ref, ':', t('the-date-is-outside-the-period-range')].join(' '))

    return [messages.join(' , ')]
  }

  if (!employee || !isDateTimeValid) {
    processedRow = errMsg().filter((el) => el)
    isRowInvalid = true
  } else {
    const { id, firstname, lastname, uid } = employee

    processedRow = {
      id,
      fullname: `${firstname} ${lastname} (${uid})`,
      added_at: dateTime.format(),
    }
  }

  return { isRowInvalid, processedRow }
}

const errorChange = (errors) => {
  importErrors.value = errors
}
</script>
