<template>
  <el-dialog
    draggable
    :title="$t(brand?.id ? 'update-brand' : 'add-new-brand')"
    :model-value="useDialog.visible('create_edit_brand')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_brand')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-5 gap-x-4">
          <div class="col-span-2">
            <el-form-item :label="$t('code')" prop="code">
              <el-input-number
                v-model="form.code"
                class="!w-full"
                :controls="false"
                :disabled="Boolean(brand?.id)"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item :label="$t('brand-for')">
              <el-radio-group v-model="form.is_for_sell">
                <el-radio-button
                  v-for="(status, index) in brandStatus"
                  :key="index"
                  class="!w-1/2"
                  :label="status.value"
                >
                  <template #default>
                    <div class="px-8">{{ $t(status.label) }}</div>
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="col-span-5">
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
          :type="brand?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_brand')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useBrandStore } from '@/stores/brand'
import { useDialog } from '@/helpers'
import { t } from '@/plugins'
import { ref, reactive, watch } from 'vue'

const brandStore = useBrandStore()
const props = defineProps({
  brand: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['reload'])
const loading = ref(false)
const brandStatus = [
  { value: false, label: 'purchased-products' },
  { value: true, label: 'sell-products' },
]
const initForm = {
  code: null,
  label: null,
  is_for_sell: false,
}
const formRef = ref(null)
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
      message: t('please-input-name'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.brand,
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
        brandStore
          .updateBrand(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        brandStore
          .newBrand(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_brand')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
