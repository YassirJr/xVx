<template>
  <el-dialog
    draggable
    :title="$t('sync-employees-to-the-device') + ' (' + device.name + ')'"
    :model-value="useDialog.visible('sync_employees_device')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('sync_employees_device')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <el-form-item :label="$t('employee-type')" prop="employee_type_ids">
          <el-select v-model="form.employee_type_ids" clearable filterable multiple class="w-full">
            <el-option
              v-for="employeeType in employeeTypeStore.types"
              :key="employeeType.id"
              :label="employeeType.name"
              :value="employeeType.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button plain type="primary" :loading="loading" :disabled="loading" @click="save">
          {{ $t('sync') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="useDialog.close('sync_employees_device')"
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
import { useDeviceStore } from '@/stores/device'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { reactive, ref } from 'vue'

const props = defineProps({
  device: {
    type: Object,
    default: () => {},
  },
})

const loading = ref(false)
const form = ref({ employee_type_ids: [] })
const formRef = ref(null)

const deviceStore = useDeviceStore()
const employeeTypeStore = useEmployeeTypeStore()

const rules = reactive({
  employee_type_ids: [
    {
      required: true,
      message: t('please-select-employee-type'),
      trigger: 'blur',
    },
  ],
})

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      deviceStore.syncEmployees({ ...form.value, id: props.device.id }).finally(() => {
        useDialog.close('sync_employees_device')
        loading.value = false
        form.value.employee_type_ids = []
      })
    }
  })
}
</script>
