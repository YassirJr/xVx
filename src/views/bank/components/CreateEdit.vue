<template>
  <el-dialog
    draggable
    :title="$t(bank?.id ? 'update-bank' : 'add-new-bank')"
    :model-value="useDialog.visible('create_edit_bank')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_bank')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <el-form-item :label="$t('label')" prop="label">
          <el-input v-model="form.label"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="bank?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_bank')"
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
import { useBankStore } from '@/stores/bank'
import { reactive, ref, watch } from 'vue'

const loading = ref(false)
const formRef = ref()
const form = ref({ label: null })

const bankStore = useBankStore()
const props = defineProps({
  bank: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['reload'])

const rules = reactive({
  label: [
    {
      required: true,
      message: t('please-input-name'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.bank,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = Object.assign({}, { label: null })
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        bankStore
          .updateBank(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        bankStore
          .newBank(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_bank')
  loading.value = false
  form.value = Object.assign({}, { label: null })
  emit('reload')
}
</script>
