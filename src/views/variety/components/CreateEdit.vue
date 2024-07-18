<template>
  <el-dialog
    draggable
    :title="$t(variety?.id ? 'edit-variety' : 'create-new-variety')"
    :model-value="useDialog.visible('create_edit_variety')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_variety')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <el-form-item :label="$t('name')" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('number-of-days')" prop="nbr_days">
          <el-input-number
            v-model="form.nbr_days"
            class="!w-full"
            :min="1"
            :max="999"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="variety?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_variety')"
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
import { useVarietyStore } from '@/stores/variety'

const props = defineProps({
  variety: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['reload'])

const initForm = {
  name: null,
  nbr_days: null,
}
const loading = ref(false)
const formRef = ref()
const form = ref(initForm)
const varietyStore = useVarietyStore()

const rules = reactive({
  name: [
    {
      required: true,
      message: t('please-input-name'),
      trigger: 'blur',
    },
  ],
  nbr_days: [
    {
      required: true,
      message: t('please-input-number-of-days'),
      trigger: 'blur',
      type: 'integer',
      min: 1,
    },
  ],
})

watch(
  () => props.variety,
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
        varietyStore
          .updateVariety(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        varietyStore
          .newVariety(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}
const reset = () => {
  useDialog.close('create_edit_variety')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
