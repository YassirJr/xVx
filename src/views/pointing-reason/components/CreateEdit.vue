<template>
  <el-dialog
    draggable
    :title="$t(reason?.id ? 'edit-reason' : 'create-new-reason')"
    :model-value="useDialog.visible('create_edit_reason')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_reason')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <el-form-item :label="$t('reason')" prop="reason">
          <el-input v-model="form.reason"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="reason?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_reason')"
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
import { usePointingReasonStore } from '@/stores/pointingReason'

const props = defineProps({
  reason: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['reload'])

const pointingReasonStore = usePointingReasonStore()

const initForm = {
  reason: null,
}
const loading = ref(false)
const formRef = ref()
const form = ref(initForm)

const rules = reactive({
  reason: [
    {
      required: true,
      message: t('please-input-reason'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.reason,
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
        pointingReasonStore
          .updatePointingReason(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        pointingReasonStore
          .newPointingReason(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_reason')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
