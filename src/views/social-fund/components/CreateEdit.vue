<template>
  <el-dialog
    draggable
    :title="$t(socialFund?.id ? 'edit-social-fund' : 'create-new-social-fund')"
    :model-value="useDialog.visible('create_edit_social_fund')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_social_fund')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-4 gap-x-5">
          <div class="col-span-2">
            <el-form-item :label="$t('code')" prop="code">
              <el-input-number
                v-model="form.code"
                class="!w-full"
                :controls="false"
                :disabled="Boolean(socialFund?.id)"
              />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('fund')" prop="fund">
              <el-select v-model="form.fund" clearable filterable class="w-full">
                <el-option
                  v-for="fund in socialFundStore.getFundsList"
                  :key="fund.value"
                  :label="$t(fund.label)"
                  :value="fund.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('label')" prop="label">
              <el-input v-model="form.label"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('ceiling')" prop="ceiling">
              <el-input-number v-model="form.ceiling" class="!w-full" :min="0" :precision="2" />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('salary-rate')" prop="salary_rate">
              <el-input-number
                v-model="form.salary_rate"
                class="!w-full"
                :min="salaryRateConfig.min"
                :max="salaryRateConfig.max"
                :precision="2"
              />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item>
              <template #label><div class="text-white">type</div></template>
              <el-radio-group v-model="form.salary_rate_percent" class="!w-full">
                <el-radio-button
                  v-for="(item, index) in socialFundStore.rateTypes"
                  :key="index"
                  class="!w-1/2"
                  :label="item.value"
                >
                  <template #default>
                    {{ $t(item.label) }}
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('employer-rate')" prop="employer_rate">
              <el-input-number
                v-model="form.employer_rate"
                class="!w-full"
                :min="employerRateConfig.min"
                :max="employerRateConfig.max"
                :precision="2"
              />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item>
              <template #label><div class="text-white">type</div></template>
              <el-radio-group v-model="form.employer_rate_percent" class="!w-full">
                <el-radio-button
                  v-for="(item, index) in socialFundStore.rateTypes"
                  :key="index"
                  class="!w-1/2"
                  :label="item.value"
                >
                  <template #default>
                    {{ $t(item.label) }}
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('frequency_declaration')" prop="frequency_declaration">
              <el-select v-model="form.frequency_declaration" clearable filterable class="w-full">
                <el-option
                  v-for="item in socialFundStore.frequencyDeclaration"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
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
          :type="socialFund?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_social_fund')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useDialog } from '@/helpers'
import { t } from '@/plugins'
import { useSocialFundStore } from '@/stores/socialFund'

const initForm = {
  code: null,
  fund: null,
  label: null,
  ceiling: 0,
  salary_rate: 0,
  salary_rate_percent: true,
  employer_rate: 0,
  employer_rate_percent: true,
  frequency_declaration: null,
}

const props = defineProps({
  socialFund: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const form = ref(initForm)
const formRef = ref(null)

const socialFundStore = useSocialFundStore()

const rules = reactive({
  code: [
    {
      required: true,
      message: t('please-input-code'),
      trigger: 'blur',
    },
  ],
  fund: [
    {
      required: true,
      message: t('please-input-fund'),
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
  frequency_declaration: [
    {
      required: true,
      message: t('please-input-frequency-declaration'),
      trigger: 'blur',
    },
  ],
  employer_rate: [
    {
      required: true,
      message: t('please-input-employer-rate'),
      trigger: 'blur',
    },
  ],
})

const salaryRateConfig = computed(() => {
  return {
    max: form.value.salary_rate_percent ? 100 : undefined,
    min: form.value.salary_rate_percent ? 0 : undefined,
  }
})

const employerRateConfig = computed(() => {
  return {
    max: form.value.employer_rate_percent ? 100 : undefined,
    min: form.value.employer_rate_percent ? 0 : undefined,
  }
})

watch(
  () => props.socialFund,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = Object.assign({}, initForm)
    }
  },
)

watch(
  () => form.value.salary_rate_percent,
  (val) => {
    if ((val && form.value.salary_rate < 0) || form.value.salary_rate > 100) {
      form.value.salary_rate = 0
    }
  },
)

watch(
  () => form.value.employer_rate_percent,
  (val) => {
    if ((val && form.value.employer_rate < 0) || form.value.employer_rate > 100) {
      form.value.employer_rate = 0
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        socialFundStore
          .updateSocialFund(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        socialFundStore
          .newSocialFund(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_social_fund')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
