<template>
  <el-dialog
    draggable
    :title="$t(company?.id ? 'edit-company' : 'create-new-company')"
    :model-value="useDialog.visible('create_edit_company')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_company')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('code')" prop="code">
              <el-input-number
                v-model="form.code"
                class="!w-full"
                :controls="false"
                :disabled="Boolean(company?.id)"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('address')" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('tax-identification')" prop="tax_identification">
              <el-input-number
                v-model="form.tax_identification"
                class="!w-full"
                :controls="false"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('trade-registry')" prop="trade_registry">
              <el-input-number
                v-model="form.trade_registry"
                class="!w-full"
                :controls="false"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('work-accident-insurance')" prop="work_accident_insurance">
              <el-input v-model="form.work_accident_insurance"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('license-number')" prop="license_number">
              <el-input-number
                v-model="form.license_number"
                class="!w-full"
                :controls="false"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1 relative">
            <el-form-item :label="$t('employee-types')" prop="employee_type_ids">
              <el-select v-model="form.employee_type_ids" clearable filterable class="w-full" multiple>
                <el-option
                  v-for="type in types"
                  :key="type.id"
                  :label="type.name"
                  :value="type.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="company?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_company')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useDialog } from '@/helpers'
import { t } from '@/plugins'
import { reactive, ref, watch, computed } from 'vue'
import { useCompanyStore } from '@/stores/company'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'

const initForm = {
  code: null,
  name: null,
  address: null,
  tax_identification: null,
  trade_registry: null,
  work_accident_insurance: null,
  license_number: null,
  employee_type_ids: [],
}

const props = defineProps({
  company: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['reload'])

const loading = ref(false)
const formRef = ref()
const form = ref(initForm)

const companyStore = useCompanyStore()

const empTypeStore = useEmployeeTypeStore()
const types = computed(() => empTypeStore.types)

const rules = reactive({
  code: [
    {
      required: true,
      message: t('please-input-code'),
      trigger: 'blur',
    },
  ],
  name: [
    {
      required: true,
      message: t('please-input-name'),
      trigger: 'blur',
    },
  ],
  address: [
    {
      required: true,
      message: t('please-input-address'),
      trigger: 'blur',
    },
  ],
  tax_identification: [
    {
      required: true,
      message: t('please-input-tax-identification'),
      trigger: 'blur',
    },
  ],
  trade_registry: [
    {
      required: true,
      message: t('please-input-trade-registry'),
      trigger: 'blur',
    },
  ],
  work_accident_insurance: [
    {
      required: true,
      message: t('please-input-work-accident-insurance'),
      trigger: 'blur',
    },
  ],
  license_number: [
    {
      required: true,
      message: t('please-input-license-number'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.company,
  (newVal) => {
    if (newVal?.id) {
      let employee_type_ids = newVal.employee_types?.length ? newVal.employee_types.map(({ id }) => id) : []
      form.value = Object.assign({}, { ...newVal, employee_type_ids })
    } else {
      form.value = Object.assign({}, initForm)
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        companyStore
          .updateCompany(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        companyStore
          .newCompany(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_company')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
