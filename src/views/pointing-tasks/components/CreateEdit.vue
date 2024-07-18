<template>
  <el-dialog
    draggable
    :title="$t(pointing?.id ? 'edit-pointing-tasks' : 'create-new-pointing-tasks')"
    :model-value="$dialog.visible('create_edit_pointing_tasks')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="75%"
    top="5vh"
    @close="$dialog.close('create_edit_pointing_tasks')"
  >
    <div v-loading="loading">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        :validate-on-rule-change="false"
      >
        <div class="grid grid-cols-6 gap-x-5">
          <div class="col-span-3">
            <el-form-item :label="$t('site')" prop="site_id">
              <el-select
                v-model="form.site_id"
                clearable
                filterable
                class="w-full"
                @change="resetEmployeesData({ resetVariety: true })"
              >
                <el-option
                  v-for="(site, index) in siteStore.sites"
                  :key="index"
                  :label="site.name"
                  :value="site.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item :label="$t('variety')" prop="variety_id">
              <el-select
                v-model="form.variety_id"
                clearable
                filterable
                class="w-full"
                @change="resetEmployeesData()"
              >
                <el-option
                  v-for="(variety, index) in varietiesBySite"
                  :key="index"
                  :label="variety.name"
                  :value="variety.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item :label="$t('leader')" prop="leader_id">
              <el-select-v2
                v-model="form.leader_id"
                clearable
                filterable
                :reserve-keyword="false"
                :options="
                  employeesStore.employees.map((el) => ({
                    ...el,
                    label: `${el.firstname} ${el.lastname} (${el.uid})`,
                  }))
                "
                value-key="id"
                class="w-full"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-3">
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
          <div class="col-span-6 -mt-4">
            <el-divider></el-divider>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('added-at')" prop="added_at">
              <el-date-picker
                v-model="form.added_at"
                class="!w-full"
                type="datetime"
                format="DD-MM-YYYY HH:mm"
                :disabled-date="disabledDate"
                :default-value="defaultDate"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="col-span-2"></div>
          <div class="col-span-2">
            <el-form-item v-if="!pointing?.id" :label="$t('employee')">
              <el-select-v2
                v-model="form.employee_id"
                class="!w-full"
                clearable
                filterable
                :reserve-keyword="false"
                :options="filteredEmployees"
                value-key="id"
                @change="addEmployee()"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-6">
            <vxe-table
              ref="table"
              class="w-full"
              :data="form.employees"
              :loading="tableLoading"
              :row-config="{ keyField: 'id' }"
              :show-footer="isFooterVisible"
              :footer-method="footerMethod"
              border
              round
              max-height="450"
            >
              <vxe-column
                field="uid"
                :title="$t('code')"
                :class-name="isRowInvalid"
                min-width="80"
              ></vxe-column>
              <vxe-column
                field="fullname"
                :title="$t('fullname')"
                :class-name="isRowInvalid"
                min-width="200"
              ></vxe-column>
              <vxe-column field="task" :title="$t('task')" :class-name="isRowInvalid" min-width="150">
                <template #default="{ rowIndex }">
                  <el-select-v2
                    v-model="form.employees[rowIndex].task_id"
                    class="w-full"
                    clearable
                    filterable
                    :reserve-keyword="false"
                    :options="filtersTasks.map((el) => ({ ...el, label: `${el.name} (${el.code})` }))"
                    value-key="id"
                    @change="onTaskChanged(rowIndex)"
                  ></el-select-v2>
                </template>
              </vxe-column>
              <vxe-column field="parcel" :title="$t('parcel')" :class-name="isRowInvalid" min-width="170">
                <template #default="{ rowIndex }">
                  <el-select-v2
                    v-model="form.employees[rowIndex].cultivation_ids"
                    class="w-full"
                    :disabled="!form.employees[rowIndex].is_task_direct"
                    clearable
                    filterable
                    :reserve-keyword="false"
                    multiple
                    :multiple-limit="pointing?.id ? 1 : 0"
                    :options="filteredCultivations"
                    value-key="id"
                    collapse-tags
                    collapse-tags-tooltip
                  ></el-select-v2>
                </template>
              </vxe-column>
              <vxe-column field="unity" :title="$t('unity')" :class-name="isRowInvalid" min-width="150">
                <template #default="{ rowIndex }">
                  <el-select
                    v-if="!form.employees[rowIndex].accept_hours_only"
                    v-model="form.employees[rowIndex].unity_id"
                    clearable
                    filterable
                    class="w-full"
                  >
                    <el-option
                      v-for="(unity, index) in filtredUnities"
                      :key="index"
                      :label="`${unity.label} (${unity.code})`"
                      :value="unity.id"
                    ></el-option>
                  </el-select>
                  <div v-else>
                    {{ $t('hour') }}
                  </div>
                </template>
              </vxe-column>
              <vxe-column field="number" :title="$t('number')" :class-name="isRowInvalid" min-width="150">
                <template #default="{ rowIndex }">
                  <el-input-number
                    v-if="!form.employees[rowIndex].accept_hours_only"
                    v-model="form.employees[rowIndex].nbr_unities"
                    class="!w-full"
                    :step="1"
                    :min="0"
                    value-on-clear="min"
                  ></el-input-number>
                  <el-input-number
                    v-else
                    v-model="form.employees[rowIndex].nbr_hours"
                    class="!w-full"
                    :step="1"
                    :min="0"
                    value-on-clear="min"
                  ></el-input-number>
                </template>
              </vxe-column>
              <vxe-column
                field="hours_bonus"
                :title="$t('hours-bonus')"
                :class-name="isRowInvalid"
                min-width="150"
              >
                <template #default="{ rowIndex }">
                  <el-input-number
                    v-model="form.employees[rowIndex].hours_bonus"
                    class="!w-full"
                    :precision="2"
                    :min="0"
                    value-on-clear="min"
                  ></el-input-number>
                </template>
              </vxe-column>
              <vxe-column
                v-if="!pointing?.id"
                field="actions"
                :title="$t('actions')"
                :class-name="isRowInvalid"
                min-width="100"
                align="center"
                fixed="right"
              >
                <template #default="{ rowIndex }">
                  <div class="flex items-center justify-center">
                    <el-tooltip :content="$t('duplicate')">
                      <el-button plain type="info" size="small" @click="duplicateEmployee(rowIndex)">
                        <i-el-document-copy />
                      </el-button>
                    </el-tooltip>
                    <el-tooltip :content="$t('delete')">
                      <el-button plain type="danger" size="small" @click="deleteEmployee(rowIndex)">
                        <i-el-delete />
                      </el-button>
                    </el-tooltip>
                  </div>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>
      </el-form>
      <div v-if="cultivationClosureDirect" class="text-xs text-red-500 mt-4">
        {{ $t('the-uprooting-date-has-already-passed') }}
      </div>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="pointing?.id ? 'warning' : 'primary'"
          :loading="loading"
          :disabled="isSaveDisabled"
          @click="save()"
        >
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="$dialog.close('create_edit_pointing_tasks')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { sum, useDialog } from '@/helpers'
import { dayjs, t } from '@/plugins'
import { computed, watch, ref, reactive } from 'vue'

import { useSiteStore } from '@/stores/site'
import { useCultivationStore } from '@/stores/cultivation'
import { useUnityStore } from '@/stores/unity'
import { useEmployeeStore } from '@/stores/employee'
import { useTaskStore } from '@/stores/task'
import { usePointingReasonStore } from '@/stores/pointingReason'
import { usePointingTasksStore } from '@/stores/pointingTasks'

const pointingTaskStore = usePointingTasksStore()
const siteStore = useSiteStore()
const taskStore = useTaskStore()
const cultivationStore = useCultivationStore()
const pointingReasonStore = usePointingReasonStore()
const unityStore = useUnityStore()
const employeesStore = useEmployeeStore()

const emit = defineEmits(['reload'])

const props = defineProps({
  pointing: {
    type: Object,
    default: null,
  },
})
const initForm = reactive({
  site_id: null,
  variety_id: null,
  leader_id: null,
  reason_id: null,
  added_at: null,
  employee_id: null,
  employees: [],
})
const loading = ref(false)
const tableLoading = ref(false)
const table = ref(null)
const formRef = ref(null)
const form = ref(initForm)
const rules = reactive({
  site_id: [
    {
      required: true,
      message: t('please-select-site'),
      trigger: 'blur',
    },
  ],
  variety_id: [
    {
      required: true,
      message: t('please-select-variety'),
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
  added_at: [
    {
      required: true,
      message: t('please-select-date-and-time'),
      trigger: 'blur',
    },
  ],
})

const varietiesBySite = computed(() => {
  return siteStore.sites.find(({ id }) => id == form.value.site_id)?.varieties ?? []
})

const filteredEmployees = computed(() =>
  !props?.pointing?.id
    ? employeesStore.employees
        .filter(
          ({ id, type_id }) =>
            !form.value.employees.map(({ employee_id }) => employee_id).includes(id) &&
            type_id === props.pointing.payClosure.employee_type_id,
        )
        .map((el) => ({ ...el, label: `${el.firstname} ${el.lastname} (${el.uid})` }))
    : [],
)

const filteredCultivations = computed(() => {
  let cultivations =
    form.value.id && form.value.cultivation
      ? [
          ...cultivationStore.cultivations,
          {
            ...form.value.cultivation,
            parcel: { ...form.value.cultivation.parcel, site_id: form.value.site_id, site: form.value.site },
          },
        ]
      : cultivationStore.cultivations

  return cultivations
    .map((el) => ({
      ...el,
      site_id: el.parcel.site_id,
      id: `${el.id}_${el.parcel_id}`,
      label: `${el.parcel.name}_${el.parcel.site.name}_DC${el.code} (${el.code})`,
    }))
    .filter(
      ({ site_id, variety_id }) => site_id === form.value.site_id && variety_id === form.value.variety_id,
    )
})

const filtersTasks = computed(() => {
  return taskStore.tasks.filter(({ varieties }) => varieties.some(({ id }) => id === form.value.variety_id))
})

const filtredUnities = computed(() => {
  return unityStore.unities.filter(({ variety_id }) => variety_id === form.value.variety_id)
})

const isPointingInvalid = computed(() => {
  const employees = form.value.employees
  return Boolean(
    !employees.length ||
      employees.filter(({ task_id }) => !task_id).length ||
      employees.filter(({ unity_id, accept_hours_only }) => !accept_hours_only && !unity_id).length ||
      employees.filter(
        ({ task_id, cultivation_ids }) =>
          filtersTasks.value.find(({ id }) => id == task_id)?.is_direct && !cultivation_ids.length,
      ).length,
  )
})

const defaultDate = computed(() => {
  return dayjs(props.pointing.payClosure.start_date).toDate()
})

const totalNumber = computed(() => {
  return sum(
    form.value.employees.map(({ accept_hours_only, nbr_unities, nbr_hours }) =>
      accept_hours_only ? nbr_hours : nbr_unities,
    ),
  )
})

const totalHoursBonus = computed(() => {
  return sum(form.value.employees.map(({ hours_bonus }) => hours_bonus)).toFixed(2)
})

const isCultivationClosed = computed(() => {
  const { id, cultivation } = form.value
  return Boolean(id && dayjs(cultivation?.uprooting_date).isSameOrBefore(dayjs(), 'day'))
})

const isSaveDisabled = computed(() => {
  return Boolean(isPointingInvalid.value || loading.value || cultivationClosureDirect.value)
})

const isFooterVisible = computed(() => {
  return Boolean(form.value.employees.length > 1)
})

const cultivationClosureDirect = computed(() => {
  return Boolean(isCultivationClosed.value && form.value.employees[0].is_task_direct)
})

watch(
  () => props.pointing,
  (newVal) => {
    if (newVal?.id) {
      const {
        id,
        employee_id,
        employee,
        cultivation_id,
        parcel_id,
        task_id,
        unity_id = null,
        nbr_unities = 0,
        nbr_hours = 0,
        hours_bonus,
        added_at,
      } = newVal
      const employeeData = {
        id,
        employee_id,
        uid: employee.uid,
        fullname: `${employee.firstname} ${employee.lastname}`,
        cultivation_ids: cultivation_id && parcel_id ? [`${cultivation_id}_${parcel_id}`] : [],
        task_id,
        unity_id,
        nbr_unities,
        nbr_hours,
        hours_bonus,
        accept_hours_only: !unity_id,
        is_task_direct: taskStore.tasks.find(({ id }) => id == task_id)?.is_direct,
      }

      form.value = Object.assign(
        {},
        {
          ...newVal,
          cultivation: cultivationStore.cultivations.find(({ id }) => id === cultivation_id),
          employee_id: null,
          added_at: dayjs(added_at).toString(),
          employees: [employeeData],
        },
      )
    } else {
      form.value = Object.assign({}, { ...initForm, pay_closure_id: newVal.payClosure.id, employees: [] })
    }
  },
)

watch(
  () => form.value.employees,
  () => {
    if (table.value) {
      table.value.updateFooter()
    }
  },
  { deep: true },
)

const disabledDate = (date) => {
  let start_date = +dayjs(props.pointing.payClosure.start_date).subtract(1, 'day')
  let end_date = +dayjs(props.pointing.payClosure.end_date).add(1, 'day')

  return date.getTime() > end_date || start_date > date.getTime()
}

const addEmployee = () => {
  const employee = employeesStore.employees.find(({ id }) => id == form.value.employee_id)
  const latestEmployee = form.value.employees[0]

  form.value.employee_id = null

  if (employee) {
    const { id, uid, firstname, lastname } = employee
    const {
      cultivation_ids = [],
      task_id = null,
      unity_id = null,
      nbr_unities = 0,
      nbr_hours = 8,
      hours_bonus = 0,
      accept_hours_only = true,
    } = latestEmployee ?? {}

    const newEmployee = Object.assign(
      {},
      {
        id: `${id}_${Math.random()}`,
        employee_id: id,
        uid,
        fullname: `${firstname} ${lastname}`,
        cultivation_ids,
        task_id,
        unity_id,
        nbr_unities,
        nbr_hours,
        hours_bonus,
        accept_hours_only,
      },
    )

    tableLoading.value = true
    form.value.employees.unshift(newEmployee)
  }

  reloadTable()
}

const duplicateEmployee = (index) => {
  const employee = Object.assign({}, form.value.employees[index])

  employee.id = `${employee.employee_id}_${Math.random()}`

  tableLoading.value = true
  form.value.employees.unshift(employee)
  form.value.employees.forEach(({ task_id }, index) => {
    const task = taskStore.tasks.find(({ id }) => id == task_id)
    form.value.employees[index].is_task_direct = task?.is_direct
  })
  reloadTable()
}

const deleteEmployee = (index) => {
  tableLoading.value = true
  form.value.employees = form.value.employees.filter((_, i) => i != index)
  reloadTable()
}

const onTaskChanged = (index) => {
  const { task_id } = form.value.employees[index]
  const task = taskStore.tasks.find(({ id }) => id == task_id)

  form.value.employees[index].accept_hours_only = Boolean(task?.accept_hours_only)
  form.value.employees[index].is_task_direct = task?.is_direct
  if (task && !task.is_direct) {
    form.value.employees[index].cultivation_ids = []
  }
}

const resetEmployeesData = ({ resetVariety } = {}) => {
  if (resetVariety) {
    form.value.variety_id = null
  }
  form.value.employees.forEach((employee) => {
    employee.cultivation_ids = []
    employee.task_id = null
  })
}

const reloadTable = () => {
  setTimeout(() => {
    table.value.loadData(form.value.employees)
    tableLoading.value = false
  }, 250)
}

const save = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true

      if (form.value?.id) {
        const { id, site_id, variety_id, leader_id, reason_id, pay_closure_id, added_at } = form.value
        const employee = getFormListByParcel(form.value.employees[0])

        let data = {
          ...employee[0],
          id,
          site_id,
          variety_id,
          leader_id,
          reason_id,
          pay_closure_id,
          added_at: dayjs(added_at).format(),
        }

        if (data?.unity_id) {
          delete data.nbr_hours
        } else {
          delete data.unity_id
          delete data.nbr_unities
        }

        pointingTaskStore
          .updatePointingTasks(data)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        const { employees } = form.value
        let formList = []
        employees.forEach((employee) => {
          delete employee.is_task_direct
          formList = [...formList, ...getFormListByParcel(employee)]
        })

        const pointingHours = await getPointing(formList.filter(({ accept_hours_only }) => accept_hours_only))
        const pointingUnities = await getPointing(
          formList.filter(({ accept_hours_only }) => !accept_hours_only),
        )

        if (pointingHours?.length) await pointingTaskStore.newPointingTasks(pointingHours)
        if (pointingUnities?.length) await pointingTaskStore.newPointingTasks(pointingUnities)

        reset()
        loading.value = false
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_pointing_tasks')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}

const getFormListByParcel = (employee) => {
  let formList = []

  if (employee.cultivation_ids.length) {
    const surfaces = filteredCultivations.value.filter(({ id }) => employee.cultivation_ids.includes(id))
    const totalSurfaces = sum(surfaces.map(({ total_surface }) => total_surface))

    employee.cultivation_ids.map((id) => {
      const ids = id.split('_')
      const surface = surfaces.find((el) => el.id == id).total_surface
      const surfaceAverage = surface / totalSurfaces

      formList.push({
        ...employee,
        cultivation_id: +ids[0],
        parcel_id: +ids[1],
        nbr_hours: form.value?.id ? employee.nbr_hours : +(employee.nbr_hours * surfaceAverage).toFixed(2),
        hours_bonus: form.value?.id
          ? employee.hours_bonus
          : +(employee.hours_bonus * surfaceAverage).toFixed(2),
      })
    })
  } else formList.push(employee)

  return formList
}

const getPointing = (data) => {
  const { site_id, variety_id, reason_id, leader_id, pay_closure_id, added_at } = form.value

  return data.map(
    ({
      employee_id,
      nbr_hours,
      task_id,
      cultivation_id = null,
      parcel_id = null,
      unity_id,
      nbr_unities,
      hours_bonus,
      accept_hours_only,
    }) => {
      const nbrUnitiesOrHours = !accept_hours_only ? { unity_id, nbr_unities } : { nbr_hours }

      return {
        employee_id,
        is_nature: false,
        site_id,
        variety_id,
        task_id,
        cultivation_id,
        parcel_id,
        reason_id,
        leader_id,
        pay_closure_id,
        hours_bonus,
        ...nbrUnitiesOrHours,
        added_at: dayjs(added_at).format(),
      }
    },
  )
}

const isRowInvalid = ({ row }) => {
  const { task_id, unity_id, accept_hours_only, cultivation_ids } = row
  let selectedTask = filtersTasks.value.find(({ id }) => id == task_id)
  return !task_id || (!accept_hours_only && !unity_id) || (selectedTask?.is_direct && !cultivation_ids.length)
    ? 'bg-red-50'
    : null
}

const footerMethod = ({ columns }) => {
  return [
    columns.map((column) => {
      switch (column.field) {
        case 'uid':
          return t('total')
        case 'number':
          return totalNumber.value
        case 'hours_bonus':
          return totalHoursBonus.value
        default:
          return ''
      }
    }),
  ]
}
</script>
