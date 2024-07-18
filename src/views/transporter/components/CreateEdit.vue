<template>
  <el-dialog
    draggable
    :title="$t(transporter?.id ? 'edit-transporter' : 'create-new-transporter')"
    :model-value="useDialog.visible('create_edit_transporter')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_transporter')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-4 gap-x-5">
          <div class="col-span-2">
            <el-form-item :label="$t('code')" prop="code">
              <el-input v-model="form.code"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('active')" prop="status">
              <el-radio-group v-model="form.status" class="!w-full">
                <el-radio-button
                  v-for="option in status"
                  :key="option.value"
                  :label="option.value"
                  class="w-1/2"
                >
                  <template #default>
                    <div class="px-8">{{ option.label }}</div>
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('phone-number')" prop="phone_number">
              <el-input v-model="form.phone_number" maxlength="11" clearable></el-input>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item :label="$t('address')" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('city')" prop="city">
              <el-input v-model="form.city"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('bank')" prop="bank_id">
              <el-select v-model="form.bank_id" class="w-full">
                <el-option
                  v-for="bank in bankStore.banks"
                  :key="bank.id"
                  :label="bank.label"
                  :value="bank.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('bank-statement')" prop="bank_statement">
              <el-input v-model="form.bank_statement"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="transporter?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_transporter')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useDialog, phoneNumberFormat, PhoneNumRegex } from '@/helpers'
import { t } from '@/plugins'
import { BANK_STATEMENT_REGEX } from '@/constants'
import { reactive, ref, watch } from 'vue'
import { useTransporterStore } from '@/stores/transporter'
import { useBankStore } from '@/stores/bank'

const props = defineProps({
  transporter: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['reload'])

const initForm = {
  code: null,
  status: true,
  name: null,
  phone_number: null,
  address: null,
  city: null,
  bank_id: null,
  bank_statement: null,
}
const loading = ref(false)
const formRef = ref()
const form = ref(initForm)
const status = ref([
  { label: t('yes'), value: true },
  { label: t('no'), value: false },
])

const transporterStore = useTransporterStore()
const bankStore = useBankStore()

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
  phone_number: [
    {
      pattern: PhoneNumRegex,
      message: t('please-input-correct-phone-number'),
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
  city: [
    {
      required: true,
      message: t('please-input-city'),
      trigger: 'blur',
    },
  ],
  bank_statement: [
    {
      pattern: BANK_STATEMENT_REGEX(),
      message: t('bank-statement-invalid'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.transporter,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = Object.assign({}, { ...initForm, code: transporterStore.getLatestCode })
    }
  },
)

watch(
  () => form.value.phone_number,
  (newVal) => {
    form.value.phone_number = phoneNumberFormat(newVal, form.value.phone_number)
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        transporterStore
          .update(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        transporterStore
          .create(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_transporter')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
