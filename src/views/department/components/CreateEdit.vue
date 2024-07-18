<template>
  <el-dialog
    draggable
    :title="$t(department?.id ? 'update-department' : 'create-new-department')"
    :model-value="useDialog.visible('create_edit_department')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_department')"
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
          :type="department?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_department')"
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
import { useDepartmentStore } from '@/stores/department'
import { reactive, ref, watch } from 'vue'

const loading = ref(false)
const formRef = ref()
const form = ref({ label: null })

const departmentStore = useDepartmentStore()
const props = defineProps({
  department: {
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
  () => props.department,
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
        departmentStore
          .updateDepartment(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        departmentStore
          .newDepartment(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_department')
  loading.value = false
  form.value = Object.assign({}, { label: null })
  emit('reload')
}
</script>
