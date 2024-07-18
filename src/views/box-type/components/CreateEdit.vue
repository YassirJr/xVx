<template>
  <el-dialog
    draggable
    :title="$t(boxType?.id ? 'edit-box-type' : 'create-new-box-type')"
    :model-value="useDialog.visible('create_edit_box_type')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_box_type')"
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
                :disabled="Boolean(boxType?.id)"
              />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('label')" prop="label">
              <el-input v-model="form.label"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('tare-weight')" prop="tare_weight">
              <el-input-number
                v-model="form.tare_weight"
                class="!w-full"
                :min="1"
                :max="1000"
                controls-position="right"
                :precision="2"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="boxType?.id ? 'warning' : 'primary'"
          :loading="loading"
          :disabled="loading"
          @click="save()"
        >
          {{ t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="useDialog.close('create_edit_box_type')"
        >
          {{ t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { t } from '@/plugins'
import { useBoxTypeStore } from '@/stores/boxType'
import { useDialog } from '@/helpers'

const props = defineProps({
  boxType: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const initForm = reactive({
  code: null,
  label: null,
  tare_weight: null,
})
const boxTypeStore = useBoxTypeStore()
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
  label: [
    {
      required: true,
      message: t('please-input-label'),
      trigger: 'blur',
    },
  ],
  tare_weight: [
    {
      required: true,
      message: t('please-input-tare-weight'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.boxType,
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
        boxTypeStore
          .updateBoxType(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        boxTypeStore
          .newBoxType(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_box_type')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
