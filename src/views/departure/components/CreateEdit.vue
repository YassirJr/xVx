<template>
  <el-dialog
    draggable
    :title="$t(departure?.id ? 'update-departure' : 'create-new-departure')"
    :model-value="useDialog.visible('create_edit_departure')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_departure')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('code')" prop="code">
              <el-input v-model="form.code" :disabled="Boolean(departure?.id)"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('label')" prop="label">
              <el-input v-model="form.label"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="departure?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_departure')"
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
import { useDepartureStore } from '@/stores/departure'

const props = defineProps({
  departure: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['reload'])

const departureStore = useDepartureStore()

const loading = ref(false)
const formRef = ref()
const form = ref({
  label: null,
  code: null,
})

const rules = reactive({
  label: [
    {
      required: true,
      message: t('please-input-name'),
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: t('please-input-code'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.departure,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = Object.assign(
        {},
        {
          label: null,
          code: null,
        },
      )
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        departureStore
          .updateDeparture(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        departureStore
          .newDeparture(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_departure')
  loading.value = false
  form.value = Object.assign(
    {},
    {
      label: null,
      code: null,
    },
  )
  emit('reload')
}
</script>
