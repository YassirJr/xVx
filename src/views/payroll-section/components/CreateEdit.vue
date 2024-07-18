<template>
  <el-dialog
    draggable
    :title="$t(payrollSection?.id ? 'edit-payroll-section' : 'create-new-payroll-section')"
    :model-value="useDialog.visible('create_edit_payroll_section')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_payroll_section')"
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
            <el-form-item :label="$t('code')" prop="code">
              <el-input-number
                v-model="form.code"
                class="!w-full"
                :disabled="Boolean(payrollSection?.id)"
                :controls="false"
              />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('label')" prop="label">
              <el-input v-model="form.label"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('nature')" prop="nature">
              <el-select v-model="form.nature" clearable filterable class="w-full">
                <el-option
                  v-for="nature in payrollSectionStore.natures"
                  :key="nature.value"
                  :label="$t(nature.label)"
                  :value="nature.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('mode')" prop="mode">
              <el-select v-model="form.mode" clearable filterable class="w-full">
                <el-option
                  v-for="mode in payrollSectionStore.modes"
                  :key="mode.value"
                  :label="$t(mode.label)"
                  :value="mode.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <template v-if="form.mode == payrollSectionStore.modes[1].value">
            <div class="col-span-1">
              <el-form-item :label="$t('base')" prop="base_id">
                <el-select v-model="form.base_id" clearable filterable class="w-full">
                  <el-option
                    v-for="section in getPayrollSections"
                    :key="section.id"
                    :label="section.label"
                    :value="section.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-1">
              <el-form-item :label="$t('symbol')" prop="symbol">
                <el-select v-model="form.symbol" clearable filterable class="w-full">
                  <el-option
                    v-for="symbol in payrollSectionStore.symbols"
                    :key="symbol.value"
                    :label="symbol.label"
                    :value="symbol.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-1">
              <el-form-item :label="$t('rate')" prop="rate_id">
                <el-select v-model="form.rate_id" clearable filterable class="w-full">
                  <el-option
                    v-for="section in getPayrollSections"
                    :key="section.id"
                    :label="section.label"
                    :value="section.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </template>
          <div class="col-span-1">
            <el-form-item :label="$t('main-sections')" prop="main_section_ids">
              <el-select v-model="form.main_section_ids" clearable filterable class="w-full" multiple>
                <el-option
                  v-for="mainSection in payrollSectionStore.payrollSections.filter(({ id }) => form.id != id)"
                  :key="mainSection.id"
                  :label="mainSection.label"
                  :value="mainSection.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2"><el-divider></el-divider></div>
          <div class="col-span-2">
            <div class="grid grid-cols-4 gap-x-5">
              <div class="col-span-1">
                <el-form-item :label="$t('active')" prop="is_active">
                  <el-radio-group v-model="form.is_active" class="!w-full">
                    <el-radio-button
                      v-for="(option, i) in options"
                      :key="i"
                      class="!w-1/2"
                      :label="option.value"
                    >
                      <template #default>
                        {{ option.label }}
                      </template>
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="col-span-1">
                <el-form-item :label="$t('payroll-slip')" prop="payroll_slip">
                  <el-radio-group v-model="form.payroll_slip" class="!w-full">
                    <el-radio-button
                      v-for="(option, i) in options"
                      :key="i"
                      class="!w-1/2"
                      :label="option.value"
                    >
                      <template #default>
                        {{ option.label }}
                      </template>
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="col-span-1">
                <el-form-item :label="$t('payroll-book')" prop="payroll_book">
                  <el-radio-group v-model="form.payroll_book" class="!w-full">
                    <el-radio-button
                      v-for="(option, i) in options"
                      :key="i"
                      class="!w-1/2"
                      :label="option.value"
                    >
                      <template #default>
                        {{ option.label }}
                      </template>
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="col-span-1">
                <el-form-item :label="$t('declared-days')" prop="is_declared_days">
                  <el-radio-group v-model="form.is_declared_days" class="!w-full">
                    <el-radio-button
                      v-for="(option, i) in options"
                      :key="i"
                      class="!w-1/2"
                      :label="option.value"
                    >
                      <template #default>
                        {{ option.label }}
                      </template>
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="payrollSection?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_payroll_section')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDialog } from '@/helpers'
import { t } from '@/plugins'

import { usePayrollSectionStore } from '@/stores/payrollSection'

const initForm = {
  code: null,
  label: null,
  nature: null,
  mode: null,
  base_id: null,
  symbol: null,
  rate_id: null,
  main_section_ids: [],
  cnss: false,
  income_tax: false,
  payroll_slip: true,
  payroll_book: true,
  is_declared_days: true,
  is_active: true,
}

const props = defineProps({
  payrollSection: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const options = ref([
  { value: true, label: t('yes') },
  { value: false, label: t('no') },
])
const form = ref(initForm)
const formRef = ref(null)

const payrollSectionStore = usePayrollSectionStore()

const rules = ref({
  code: [
    {
      required: true,
      message: t('please-input-code'),
      trigger: 'blur',
    },
  ],
  label: [
    {
      required: true,
      message: t('please-input-label'),
      trigger: 'blur',
    },
  ],
  nature: [
    {
      required: true,
      message: t('please-select-nature'),
      trigger: 'blur',
    },
  ],
  mode: [
    {
      required: true,
      message: t('please-select-mode'),
      trigger: 'blur',
    },
  ],
})

const secondaryRules = ref({
  base_id: [
    {
      required: true,
      message: t('please-select-base'),
      trigger: 'blur',
    },
  ],
  symbol: [
    {
      required: true,
      message: t('please-select-symbol'),
      trigger: 'blur',
    },
  ],
  rate_id: [
    {
      required: true,
      message: t('please-select-rate'),
      trigger: 'blur',
    },
  ],
})

const getPayrollSections = computed(() => {
  const payrollSections = payrollSectionStore.payrollSections.filter(({ id }) => form.value.id != id)

  return [
    ...payrollSections,
    ...payrollSectionStore.getExtraValues.map((el) => ({ id: el.value, label: t(el.label) })),
  ]
})

watch(
  () => props.payrollSection,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
      form.value.main_section_ids = [...newVal.main_payroll_sections.map(({ id }) => id)]
    } else {
      form.value = Object.assign({}, initForm)
    }
  },
)

watch(
  () => form.value.mode,
  (newVal) => {
    if (newVal == payrollSectionStore.modes[1].value) {
      rules.value = Object.assign(rules.value, secondaryRules.value)
    } else {
      form.value.base_id = null
      form.value.symbol = null
      form.value.rate_id = null
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      if (form.value?.id) {
        payrollSectionStore
          .update(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        payrollSectionStore
          .create(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_payroll_section')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
