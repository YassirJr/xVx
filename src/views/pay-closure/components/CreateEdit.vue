<template>
  <el-dialog
    draggable
    :title="$t('create-pay-period')"
    :model-value="useDialog.visible('create_pay_period')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_pay_period')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-2">
            <el-form-item :label="$t('employee-type')" prop="employee_type_id">
              <el-select v-model="form.employee_type_id" clearable filterable class="w-full">
                <el-option
                  v-for="employeeType in employeeTypeStore.types"
                  :key="employeeType.id"
                  :label="employeeType.name"
                  :value="employeeType.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('month')" prop="month">
              <el-select v-model="form.month" class="!w-full">
                <el-option v-for="(month, i) in months" :key="i" :label="month.label" :value="month.value" />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('year')" prop="year">
              <el-select v-model="form.year" class="!w-full">
                <el-option v-for="(year, i) in years" :key="i" :label="year" :value="year" />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('period')" prop="daterange">
              <el-date-picker
                v-model="form.daterange"
                type="daterange"
                unlink-panels
                clearable
                :range-separator="$t('to')"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button plain type="primary" :loading="loading" :disabled="loading" @click="save()">
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="useDialog.close('create_pay_period')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElNotification } from 'element-plus'
import { toCapitalize, useDialog } from '@/helpers'
import { ref, reactive, computed } from 'vue'
import { t, dayjs } from '@/plugins'
import { usePayClosureStore } from '@/stores/payClosure'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'

const emit = defineEmits(['reload'])

const loading = ref(false)
const formRef = ref(null)
const years = ref([dayjs().year(), dayjs().add(1, 'year').year()])
const form = ref({
  employee_type_id: null,
  daterange: [],
  year: dayjs().year(),
  month: null,
})

const payClosureStore = usePayClosureStore()
const employeeTypeStore = useEmployeeTypeStore()

const rules = reactive({
  employee_type_id: [
    {
      required: true,
      message: t('please-select-employee-type'),
      trigger: 'blur',
    },
  ],
  year: [
    {
      required: true,
      message: t('please-select-year'),
      trigger: 'blur',
    },
  ],
  month: [
    {
      required: true,
      message: t('please-select-month'),
      trigger: 'blur',
    },
  ],
  daterange: [
    {
      required: true,
      message: t('please-select-period'),
      trigger: 'blur',
    },
  ],
})

const months = computed(() => {
  return dayjs.months().map((month, i) => ({ label: toCapitalize(month), value: i + 1 }))
})

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      const { daterange, employee_type_id, year, month } = form.value
      payClosureStore
        .newPayClosure({
          employee_type_id,
          year,
          month,
          start_date: dayjs(daterange[0]).format(),
          end_date: dayjs(daterange[1]).format(),
        })
        .then(() => reset())
        .catch(() => {
          ElNotification.error({
            title: t('error'),
            message: t('this-date-range-is-already-exist-for-this-employee-type'),
            showClose: true,
            duration: 5000,
            position: 'bottom-right',
          })
        })
        .finally(() => (loading.value = false))
    }
  })
}

const reset = () => {
  useDialog.close('create_pay_period')
  loading.value = false
  form.value = {
    employee_type_id: null,
    daterange: [],
    year: dayjs().year(),
    month: null,
  }
  emit('reload')
}
</script>
