<template>
  <el-dialog
    draggable
    :title="$t(productCaliber?.id ? 'update-product-caliber' : 'add-new-product-caliber')"
    :model-value="useDialog.visible('create_edit_product_caliber')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_product_caliber')"
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
                :disabled="Boolean(productCaliber?.id)"
              ></el-input-number>
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
          :type="productCaliber?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_product_caliber')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useDialog } from '@/helpers'
import { t } from '@/plugins'
import { useProductCaliberStore } from '@/stores/productCaliber'

const props = defineProps({
  productCaliber: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const formRef = ref(null)
const form = ref({
  code: null,
  label: null,
})

const productCaliberStore = useProductCaliberStore()

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
  () => props.productCaliber,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = {
        code: null,
        label: null,
      }
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        productCaliberStore
          .updateProductCaliber(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        productCaliberStore
          .newProductCaliber(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_product_caliber')
  loading.value = false
  form.value = {
    code: null,
    label: null,
  }
  emit('reload')
}
</script>
