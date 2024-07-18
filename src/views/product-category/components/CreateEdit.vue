<template>
  <el-dialog
    draggable
    :title="$t(productCategory?.id ? 'update-product-category' : 'add-new-product-category')"
    :model-value="useDialog.visible('create_edit_product_category')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_product_category')"
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
                :disabled="Boolean(productCategory?.id)"
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
          :type="productCategory?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_product_category')"
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
import { useProductCategoryStore } from '@/stores/productCategory'

const props = defineProps({
  productCategory: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const formRef = ref(null)
const form = ref({ code: null, label: null })

const productCategoryStore = useProductCategoryStore()

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
  () => props.productCategory,
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
        productCategoryStore
          .updateProductCategory(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        productCategoryStore
          .newProductCategory(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_product_category')
  loading.value = false
  form.value = {
    code: null,
    label: null,
  }
  emit('reload')
}
</script>
