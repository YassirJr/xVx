<template>
  <el-dialog
    draggable
    :title="$t(palletType?.id ? 'update-pallet-type' : 'add-new-pallet-type')"
    :model-value="$dialog.visible('create_edit_pallet_type')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_pallet_type')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('code')" prop="code">
              <el-input-number
                v-model="form.code"
                class="!w-full"
                :min="1"
                :disabled="Boolean(palletType?.id)"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('label')" prop="label">
              <el-input v-model="form.label"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('tare-weight')" prop="tare_weight">
              <el-input-number
                v-model="form.tare_weight"
                class="!w-full"
                :precision="2"
                :min="1"
                :max="1000"
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
          :type="palletType?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_pallet_type')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useDialog } from '@/helpers'
import { ref, watch } from 'vue'
import { usePalletTypeStore } from '@/stores/palletType'
import { t } from '@/plugins'

const palletTypeStore = usePalletTypeStore()
const props = defineProps({
  palletType: {
    type: Object,
    default: null,
  },
})
const emit = defineEmits(['reload'])

const loading = ref(false)
const initForm = {
  code: null,
  label: null,
  tare_weight: null,
}
const form = ref(initForm)
const formRef = ref(null)
const rules = {
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
  tare_weight: [
    {
      required: true,
      message: t('please-input-tare-weight'),
      trigger: 'blur',
    },
  ],
}

watch(
  () => props.palletType,
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

      if (props.palletType?.id) {
        palletTypeStore
          .updatePalletType(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        palletTypeStore
          .newPalletType(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
      reset()
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_pallet_type')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
