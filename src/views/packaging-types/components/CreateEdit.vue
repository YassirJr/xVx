<template>
  <el-dialog
    draggable
    :title="$t(packagingType?.id ? 'update-packaging-type' : 'add-new-packaging-type')"
    :model-value="$dialog.visible('create_edit_packhouse_unity')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_packhouse_unity')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-2">
            <el-form-item :label="$t('code')" prop="code">
              <el-input-number
                v-model="form.code"
                class="!w-full"
                :min="1"
                :disabled="Boolean(packagingType?.id)"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('label')" prop="label">
              <el-input v-model="form.label"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('weight')" prop="weight">
              <el-input-number
                v-model="form.weight"
                class="!w-full"
                :precision="2"
                :min="0"
              ></el-input-number>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="packagingType?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_packhouse_unity')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useDialog } from '@/helpers'
import { usePackagingTypesStore } from '@/stores/packagingTypes'
import { t } from '@/plugins'
import { ref, watch } from 'vue'

const packagingTypesStore = usePackagingTypesStore()
const emit = defineEmits(['reload'])
const initForm = {
  code: null,
  label: null,
  weight: null,
}
const props = defineProps({
  packagingType: {
    type: Object,
    default: () => {},
  },
})

const loading = ref(false)
const formRef = ref(null)
const form = ref(initForm)
const rules = ref({
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
  weight: [
    {
      required: true,
      message: t('please-input-weight'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.packagingType,
  (newVal) => {
    form.value = newVal?.id ? Object.assign({}, newVal) : Object.assign({}, initForm)
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        packagingTypesStore
          .update(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        packagingTypesStore
          .create({ ...form.value })
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_packhouse_unity')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
