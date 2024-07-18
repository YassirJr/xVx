<template>
  <el-dialog
    draggable
    :title="$t(props.warehouse?.id ? 'update-warehouse' : 'add-new-warehouse')"
    :model-value="$dialog.visible('create_edit_warehouse')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_warehouse')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-7 gap-x-5">
          <div class="col-span-3">
            <el-form-item :label="$t('code')" prop="code">
              <el-input-number
                v-model="form.code"
                class="!w-full"
                :controls="false"
                :disabled="Boolean(props.warehouse?.id)"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item :label="$t('label')" prop="label">
              <el-input v-model="form.label"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('active')" prop="is_active">
              <el-switch v-model="form.is_active" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="props.warehouse?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_warehouse')"
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
import { useWarehouseStore } from '@/stores/warehouse'
import { reactive, ref, watch } from 'vue'

const warehouseStore = useWarehouseStore()

const props = defineProps({
  warehouse: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['reload'])

const initForm = reactive({
  code: null,
  label: null,
  is_active: true,
})

const loading = ref(false)
const form = ref(initForm)
const formRef = ref(null)

const rules = reactive({
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
      message: t('please-input-name'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.warehouse,
  (newVal) => {
    if (newVal.id) {
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
        warehouseStore
          .updateWarehouse(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        warehouseStore
          .newWarehouse(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_warehouse')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
