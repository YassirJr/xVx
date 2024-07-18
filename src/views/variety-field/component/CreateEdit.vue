<template>
  <el-dialog
    draggable
    :title="$t(varietyField?.id ? 'update-variety-field' : 'add-new-variety-field')"
    :model-value="useDialog.visible('create_edit_variety_field')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_variety_field')"
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
                :disabled="Boolean(varietyField?.id)"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('active')" prop="status">
              <el-radio-group v-model="form.status" class="!w-full">
                <el-radio-button :key="0" class="!w-1/2" :label="true">
                  <template #default>
                    {{ $t('yes') }}
                  </template>
                </el-radio-button>
                <el-radio-button :key="1" class="!w-1/2" :label="false">
                  <template #default>
                    {{ $t('no') }}
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('label')" prop="label">
              <el-input v-model="form.label"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1 relative">
            <el-form-item :label="$t('variety')" prop="variety_id">
              <el-select-v2
                v-model="form.variety_id"
                class="w-full"
                clearable
                filterable
                :options="varietyStore.getVarieties"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="varietyField?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_variety_field')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useDialog } from '@/helpers/index'
import { ref, reactive, watch } from 'vue'
import { useVarietyFieldStore } from '@/stores/varietyField'
import { useVarietyStore } from '@/stores/variety'
import { t } from '@/plugins'

const props = defineProps({
  varietyField: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const form = ref({
  code: null,
  label: null,
  status: true,
  variety_id: null,
})
const formRef = ref(null)

const varietyFieldStore = useVarietyFieldStore()
const varietyStore = useVarietyStore()

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
  variety_id: [
    {
      required: true,
      message: t('please-select-variety'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.varietyField,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = {
        code: null,
        label: null,
        status: true,
        variety_id: null,
      }
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        varietyFieldStore
          .update(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        varietyFieldStore
          .create(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_variety_field')
  loading.value = false
  form.value = {
    code: null,
    label: null,
    status: true,
    variety_id: null,
  }
  emit('reload')
}
</script>
