<template>
  <el-dialog
    draggable
    :title="$t(seniority?.id ? 'edit-seniority-range' : 'create-new-seniority-range')"
    :model-value="useDialog.visible('create_edit_seniority')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_seniority')"
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
                :disabled="Boolean(seniority?.id)"
              />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('min-years')" prop="min_years">
              <el-input-number v-model="form.min_years" class="!w-full" :min="0" :max="99" />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('min-days')" prop="min_days">
              <el-input-number v-model="form.min_days" class="!w-full" :min="0" />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('rate')" prop="rate">
              <el-input-number v-model="form.rate" class="!w-full" :min="0" :max="100" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="seniority?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_seniority')"
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
import { reactive, ref, watch } from 'vue'
import { useSeniorityStore } from '@/stores/senioriy'

const props = defineProps({
  seniority: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['reload'])

const seniorityStore = useSeniorityStore()

const initForm = {
  code: null,
  min_years: null,
  min_days: null,
  rate: null,
}
const loading = ref(false)
const formRef = ref()
const form = ref(initForm)

const rules = reactive({
  code: [
    {
      required: true,
      message: t('please-input-code'),
      trigger: 'blur',
    },
  ],
  min_years: [
    {
      required: true,
      message: t('please-input-min-years'),
      trigger: 'blur',
    },
  ],
  min_days: [
    {
      required: true,
      message: t('please-input-min-days'),
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
})

watch(
  () => props.seniority,
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
        seniorityStore
          .updateSeniority(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        seniorityStore
          .newSeniority(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_seniority')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
