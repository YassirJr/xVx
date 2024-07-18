<template>
  <el-dialog
    draggable
    :title="$t(pointing?.id ? 'edit-pointing-transporter' : 'create-new-pointing-transporter')"
    :model-value="useDialog.visible('create_edit_pointing_transporter')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_pointing_transporter')"
  >
    <div v-loading="loading">
      <el-form
        ref="formRef"
        :model="form"
        :rules="pointing?.id ? { ...rules, added_at } : rules"
        label-position="top"
      >
        <div class="grid grid-cols-6 gap-x-5">
          <div class="col-span-3">
            <el-form-item :label="$t('site')" prop="site_id">
              <el-select-v2
                v-model="form.site_id"
                class="w-full"
                clearable
                filterable
                :options="siteStore.getSites"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item :label="$t('vehicle')" prop="vehicle_id">
              <el-select-v2
                v-model="form.vehicle_id"
                class="w-full"
                clearable
                filterable
                :options="vehicleStore.getVehicles"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div :class="`col-span-${pointing?.id ? 2 : 3}`">
            <el-form-item
              :label="`${$t('leader')} | ${departure ? $t('departure') + ': ' + departure : ''}`"
              prop="leader_id"
            >
              <el-select-v2
                v-model="form.leader_id"
                clearable
                filterable
                class="w-full"
                :options="
                  employeeStore.employees.map((el) => ({
                    ...el,
                    label: `${el.firstname} ${el.lastname} (${el.uid})`,
                  }))
                "
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div :class="`col-span-${pointing?.id ? 2 : 3}`">
            <el-form-item :label="$t('reason')" prop="reason_id">
              <el-select-v2
                v-model="form.reason_id"
                class="w-full"
                clearable
                filterable
                :options="pointingReasonStore.reasons.map((el) => ({ ...el, label: el.reason }))"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <template v-if="!pointing?.id">
            <div class="col-span-6">
              <el-divider></el-divider>
            </div>
            <div class="col-span-6">
              <div class="flex justify-between items-center mb-5">
                <div>
                  <el-date-picker
                    v-model="pointing_datetime"
                    type="datetime"
                    :format="DATE_TIME_FORMAT"
                    :disabled-date="disabledDate"
                    :default-value="defaultDate"
                  />
                </div>
                <div>
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
            <div class="col-span-6">
              <el-form-item label="" prop="employees">
                <vxe-table
                  :key="form.employees.length"
                  class="w-full"
                  :data="form.employees"
                  border
                  round
                  stripe
                  max-height="450"
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
              <el-form-item :label="$t('added-at')" prop="added_at">
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
    </div>
    <template #footer>
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
          @click="useDialog.close('create_edit_pointing_transporter')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useDialog } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { DATE_TIME_FORMAT } from '@/constants'
import { usePointingTransporterStore } from '@/stores/pointingTransporter'
import { usePointingReasonStore } from '@/stores/pointingReason'
import { useEmployeeStore } from '@/stores/employee'
import { useVehicleStore } from '@/stores/vehicle'
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
const pointing_datetime = ref(null)
const form = ref({
  is_nature: false,
  site_id: null,
  vehicle_id: null,
  leader_id: null,
  employee_id: null,
  reason_id: null,
  employees: [],
})
const formRef = ref(null)

const pointingTransporterStore = usePointingTransporterStore()
const pointingReasonStore = usePointingReasonStore()
const employeeStore = useEmployeeStore()
const vehicleStore = useVehicleStore()
const siteStore = useSiteStore()

const rules = reactive({
  site_id: [
    {
      required: true,
      message: t('please-select-site'),
      trigger: 'blur',
    },
  ],
  vehicle_id: [
    {
      required: true,
      message: t('please-select-vehicle'),
      trigger: 'blur',
    },
  ],
  leader_id: [
    {
      required: true,
      message: t('please-select-leader'),
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

const added_at = ref([
  {
    required: true,
    message: t('please-select-date-and-time'),
    trigger: 'blur',
  },
])

const filteredEmployees = computed(() => {
  return props.pointing?.id
    ? []
    : employeeStore.employees
        .filter(
          ({ id, type_id }) =>
            !form.value.employees.map((el) => el.id).includes(id) &&
            type_id === props.pointing.payClosure.employee_type_id,
        )
        .map((el) => ({ ...el, label: `${el.firstname} ${el.lastname} (${el.uid})` }))
})

const departure = computed(() => {
  return form.value?.leader_id
    ? employeeStore.employees.find(({ id }) => id == form.value.leader_id)?.departure?.label
    : null
})

const isDateTimesValid = computed(() => {
  return props.pointing?.id ? false : !(form.value.employees.filter(({ added_at }) => !added_at).length == 0)
})

const defaultDate = computed(() => {
  return dayjs(props.pointing.payClosure.start_date).toDate()
})

watch(
  () => props.pointing,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = {
        is_nature: false,
        site_id: null,
        vehicle_id: null,
        leader_id: null,
        employee_id: null,
        reason_id: null,
        employees: [],
        pay_closure_id: newVal.payClosure.id,
      }
      pointing_datetime.value =
        pointing_datetime.value && disabledDate(pointing_datetime.value) ? null : pointing_datetime.value
    }
  },
)

watch(
  () => pointing_datetime.value,
  (newVal) => {
    for (let i = 0; i < form.value.employees.length; i++) {
      form.value.employees[i].added_at = newVal
    }
  },
)

const newEmployee = () => {
  if (employee.value) {
    const newEmployee = employeeStore.employees.find((el) => el.id == employee.value)
    const { id, firstname, lastname, uid } = newEmployee

    form.value.employees.push({
      id,
      fullname: `${firstname} ${lastname} (${uid})`,
      added_at: pointing_datetime.value ? pointing_datetime.value : dayjs().toString(),
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
        pointingTransporterStore
          .updatePointing(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        const { is_nature, site_id, vehicle_id, leader_id, reason_id, pay_closure_id, employees } = form.value
        const data = employees.map((el) => {
          return {
            is_nature,
            site_id,
            vehicle_id,
            leader_id,
            reason_id,
            pay_closure_id,
            employee_id: el.id,
            added_at: dayjs(el.added_at).format(),
          }
        })
        pointingTransporterStore
          .newPointing(data)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_pointing_transporter')
  loading.value = false
  form.value = {
    is_nature: false,
    site_id: null,
    vehicle_id: null,
    leader_id: null,
    employee_id: null,
    reason_id: null,
    employees: [],
  }
  emit('reload')
}

const disabledDate = (date) => {
  let start_date = +dayjs(props.pointing.payClosure.start_date).subtract(1, 'day')
  let end_date = +dayjs(props.pointing.payClosure.end_date).add(1, 'day')
  return date.getTime() > end_date || start_date > date.getTime()
}
</script>
