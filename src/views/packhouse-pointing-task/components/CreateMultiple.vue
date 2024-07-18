<template>
  <el-dialog
    draggable
    :title="$t('create-new-packhouse-pointing-tasks')"
    :model-value="useDialog.visible('create_multiple_packhouse_pointing_tasks')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="75%"
    top="5vh"
    @close="useDialog.close('create_multiple_packhouse_pointing_tasks')"
  >
    <div v-loading="loading">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        :validate-on-rule-change="false"
        @keypress.enter="save()"
      >
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('added-at')" prop="added_at">
              <el-date-picker
                v-model="form.added_at"
                class="!w-full"
                type="datetime"
                :format="`${DATE_FORMAT} ${TIME_FORMAT}`"
                :disabled-date="disabledDate"
                :default-value="defaultDate"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('station')" prop="site_id">
              <el-select-v2
                v-model="form.site_id"
                class="w-full"
                clearable
                filterable
                :options="stations.map((el) => ({ ...el, label: el.name }))"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1 grid grid-cols-2 gap-x-5">
            <el-form-item :label="$t('transport')" prop="vehicle_id">
              <el-select-v2
                v-model="form.vehicle_id"
                class="w-full"
                clearable
                filterable
                :options="vehicleStore.getVehicles"
                value-key="id"
              ></el-select-v2>
            </el-form-item>

            <el-form-item :label="$t('line')" prop="packhouse_line_id">
              <el-select-v2
                v-model="form.packhouse_line_id"
                class="w-full"
                clearable
                filterable
                :reserve-keyword="false"
                :options="packhouseLineStore.packhouseLines.map((el) => ({ ...el, label: el.label }))"
                value-key="id"
              ></el-select-v2>
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
          <div class="col-span-1">
            <el-form-item :label="$t('task')" prop="packhouse_task_id">
              <el-select-v2
                v-model="form.packhouse_task_id"
                class="w-full"
                clearable
                filterable
                :reserve-keyword="false"
                :options="
                  packhouseTaskStore.packhouseTasks.map((el) => ({ ...el, label: `${el.name} (${el.code})` }))
                "
                value-key="id"
                @change="onTaskChanged()"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('lot-installment-nbr')" prop="lot_installment_nbr">
              <el-select-v2
                v-model="form.lot_installment_id"
                :disabled="!form.is_packhouse_task_direct"
                class="w-full"
                clearable
                filterable
                :reserve-keyword="false"
                :options="filteredLotInstallments"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('unity')">
              <el-select
                v-if="!form.accept_hours_only"
                v-model="form.final_product_id"
                clearable
                filterable
                class="w-full"
              >
                <el-option
                  v-for="(product, index) in productStore.products"
                  :key="index"
                  :label="product.name"
                  :value="product.id"
                ></el-option>
              </el-select>
              <div v-else>
                {{ $t('hour') }}
              </div>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('number')">
              <el-input-number
                v-model="form.number"
                class="!w-full"
                :step="1"
                :min="1"
                value-on-clear="min"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <vxe-table
              ref="table"
              class="w-full"
              :loading="isTableLoading"
              :data="form.employees"
              :row-config="{ keyField: 'id' }"
              border
              round
              max-height="300"
            >
              <vxe-column field="uid" :title="$t('code')" min-width="80"></vxe-column>
              <vxe-column field="fullname" :title="$t('fullname')" min-width="200"></vxe-column>
              <vxe-column field="actions" :title="$t('actions')" min-width="80" align="center" fixed="right">
                <template #default="{ rowIndex }">
                  <div class="flex items-center justify-center">
                    <el-popconfirm
                      :title="$t('are-you-sure-to-delete-this')"
                      @confirm="deleteEmployee(rowIndex)"
                    >
                      <template #reference>
                        <div class="ml-1">
                          <el-tooltip :content="$t('delete')">
                            <el-button plain type="danger" size="small">
                              <i-el-delete />
                            </el-button>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-popconfirm>
                  </div>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button plain type="primary" :loading="loading" @click="save()">
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="useDialog.close('create_multiple_packhouse_pointing_tasks')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { dayjs, t } from '@/plugins'
import { useDialog } from '@/helpers'
import { DATE_FORMAT, TIME_FORMAT } from '@/constants'
import { usePackhousePointingTaskStore } from '@/stores/packhousePointingTask'
import { useEmployeeStore } from '@/stores/employee'
import { useSiteStore } from '@/stores/site'
import { useProductStore } from '@/stores/product'
import { useVehicleStore } from '@/stores/vehicle'
import { useLotInstallmentStore } from '@/stores/lotInstallment'
import { usePackhouseTaskStore } from '@/stores/packhouseTask'
import { usePointingReasonStore } from '@/stores/pointingReason'
import { usePackhouseLineStore } from '@/stores/packhouseLine'

const initForm = {
  added_at: null,
  site_id: null,
  vehicle_id: null,
  reason_id: null,
  employee_id: null,
  employee_type_id: null,
  packhouse_task_id: null,
  packhouse_line_id: null,
  lot_installment_id: null,
  final_product_id: null,
  number: null,
  payClosure: {},
  employees: [],
}

const props = defineProps({
  selectedEmployees: { type: Object, default: () => {} },
  payClosure: { type: Object, default: () => {} },
})

const emit = defineEmits(['reload'])

const form = ref(initForm)
const loading = ref(false)
const formRef = ref(null)
const table = ref(null)
const isTableLoading = ref(false)

const siteStore = useSiteStore()
const vehicleStore = useVehicleStore()
const employeeStore = useEmployeeStore()
const productStore = useProductStore()
const packhouseTaskStore = usePackhouseTaskStore()
const pointingReasonStore = usePointingReasonStore()
const lotInstallmentStore = useLotInstallmentStore()
const packhousePointingTaskStore = usePackhousePointingTaskStore()
const packhouseLineStore = usePackhouseLineStore()

onMounted(() => {
  siteStore.fetchAllSites({ list: true })
  vehicleStore.fetchAllVehicles({ list: true })
  employeeStore.fetchAllEmployees({ get: ['id,uid,firstname,lastname,type_id'] })
  productStore.fetch({ list: true })
  pointingReasonStore.fetchAllReasons({ list: true })
  lotInstallmentStore.fetch({ list: true })
  packhouseTaskStore.fetchPackhouseTasks({ list: true })
  packhouseLineStore.fetch({ list: true })
})

const rules = reactive({
  added_at: [
    {
      required: true,
      message: t('please-select-date-and-time'),
      trigger: 'blur',
    },
  ],
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
  packhouse_task_id: [
    {
      required: true,
      message: t('please-select-task'),
      trigger: 'blur',
    },
  ],
  final_product_id: [
    {
      required: true,
      message: t('please-select-unity'),
      trigger: 'blur',
    },
  ],
})

const stations = computed(() => {
  return siteStore.sites.filter(({ group }) => group == siteStore.groups[2].value)
})

const filteredLotInstallments = computed(() => {
  return lotInstallmentStore.lotInstallments
    .filter(({ status }) => status)
    .map((el) => ({ ...el, label: el.code }))
})

const defaultDate = computed(() => {
  return dayjs(form.value.payClosure.start_date).toDate()
})

watch(
  () => props.selectedEmployees,
  (newVal) => {
    const employeesData = newVal.map((item) => {
      const { uid, firstname, lastname } = employeeStore.employees.find(({ id }) => id === item.employee_id)
      const fullname = `${firstname} ${lastname}`
      const employee_id = item.employee_id

      return { uid, fullname, employee_id }
    })

    form.value = {
      ...form.value,
      employees: employeesData,
      payClosure: props.payClosure,
    }
  },
)

const disabledDate = (time) => {
  let start_date = dayjs(form.value.payClosure.start_date)
  let end_date = dayjs(form.value.payClosure.end_date)
  return time.getTime() > end_date || start_date > time.getTime()
}

const onTaskChanged = () => {
  const packhouseTask = packhouseTaskStore.packhouseTasks.find(({ id }) => id == form.value.packhouse_task_id)

  form.value.accept_hours_only = packhouseTask?.accept_hours_only
  form.value.is_packhouse_task_direct = packhouseTask?.is_direct
  form.value.number = packhouseTask?.accept_hours_only ? 8 : 1
  form.value.lot_installment_id = null
  form.value.final_product_id = null
}

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      const {
        added_at,
        site_id,
        vehicle_id,
        packhouse_task_id,
        packhouse_line_id,
        reason_id,
        number,
        payClosure,
        employees,
        lot_installment_id,
        final_product_id,
        accept_hours_only,
        is_packhouse_task_direct,
      } = form.value

      let pointing = employees.map((employee) => {
        const { employee_id } = employee
        let data = {
          is_nature: false,
          added_at: dayjs(added_at).format(),
          site_id,
          vehicle_id,
          reason_id,
          pay_closure_id: payClosure.id,
          employee_id,
          packhouse_task_id,
          packhouse_line_id,
          lot_installment_id,
          final_product_id,
          number,
        }

        if (accept_hours_only) {
          delete data.final_product_id
        }
        if (!is_packhouse_task_direct) {
          delete data.lot_installment_id
        }
        return data
      })

      packhousePointingTaskStore
        .create(pointing)
        .then(() => reset())
        .finally(() => (loading.value = false))
    }
  })
}

const reset = () => {
  useDialog.close('create_multiple_packhouse_pointing_tasks')
  loading.value = false
  form.value = initForm
  emit('reload')
}

const deleteEmployee = (index) => {
  isTableLoading.value = true
  form.value.employees = form.value.employees.filter((_, i) => i != index)
  reloadTable()
}

const reloadTable = () => {
  setTimeout(() => {
    table.value.loadData(form.value.employees)
    isTableLoading.value = false
  }, 250)
}
</script>
