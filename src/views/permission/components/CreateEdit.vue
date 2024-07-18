<template>
  <el-dialog
    draggable
    :title="$t(permission?.id ? 'edit-permission' : 'create-new-permission')"
    :model-value="useDialog.visible('create_edit_permission')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_permission')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-2">
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="permission?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_permission')"
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
import { usePermissionStore } from '@/stores/permission'
import { reactive, ref, watch } from 'vue'

const initForm = { name: null }
const loading = ref(false)
const formRef = ref()
const form = ref(initForm)

const permissionStore = usePermissionStore()
const props = defineProps({
  permission: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['reload'])

const rules = reactive({
  name: [
    {
      required: true,
      message: t('please-input-name'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.permission,
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
        permissionStore
          .updatePermission(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        permissionStore
          .newPermission(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_permission')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
