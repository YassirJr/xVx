<template>
  <el-dialog
    draggable
    :title="$t(incomeTax?.id ? 'edit-income-tax-brackets' : 'create-new-income-tax-brackets')"
    :model-value="useDialog.visible('create_edit_income_tax_bracket')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_income_tax_bracket')"
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
                :disabled="Boolean(incomeTax?.id)"
              />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('min')" prop="min">
              <el-input-number v-model="form.min" class="!w-full" :min="0" />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('max')" prop="max">
              <el-input-number v-model="form.max" class="!w-full" :min="0" />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('rate')" prop="rate">
              <el-input-number v-model="form.rate" class="!w-full" :min="0" :max="100" />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('abatement')" prop="abatement">
              <el-input-number v-model="form.abatement" class="!w-full" :min="0" :precision="2" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="incomeTax?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_income_tax_bracket')"
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
import { useIncomeTaxStore } from '@/stores/incomeTax'
import { reactive, ref, watch } from 'vue'

const initForm = { code: null, min: null, max: null, rate: null, abatement: null }
const loading = ref(false)
const formRef = ref()
const form = ref(initForm)

const incomeTaxStore = useIncomeTaxStore()

const props = defineProps({
  incomeTax: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['reload'])

const rules = reactive({
  code: [
    {
      required: true,
      message: t('please-input-code'),
      trigger: 'blur',
    },
  ],
  min: [
    {
      required: true,
      message: t('please-input-min'),
      trigger: 'blur',
    },
  ],
  max: [
    {
      required: true,
      message: t('please-input-max'),
      trigger: 'blur',
    },
  ],
  rate: [
    {
      required: true,
      message: t('please-input-rate'),
      trigger: 'blur',
    },
  ],
  abatement: [
    {
      required: true,
      message: t('please-input-abatement'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.incomeTax,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
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
        incomeTaxStore
          .updateIncomeTaxBracket(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        incomeTaxStore
          .newIncomeTaxBracket(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_income_tax_bracket')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
