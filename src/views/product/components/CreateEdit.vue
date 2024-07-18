<template>
  <el-dialog
    draggable
    :title="$t(product?.id ? 'update-product' : 'add-new-product')"
    :model-value="$dialog.visible('create_edit_product')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    @close="$dialog.close('create_edit_product')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-12 gap-x-5">
          <div class="col-span-6">
            <el-form-item :label="$t('code')" prop="code">
              <el-input v-model="form.code" class="!w-full" :disabled="Boolean(product?.id)"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-6">
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="form.name" class="!w-full"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-6">
            <el-form-item :label="$t('destination')" prop="destination">
              <el-radio-group v-model="form.destination" class="!w-full">
                <el-radio-button
                  v-for="destination in productStore.destinations"
                  :key="destination.value"
                  :label="destination.value"
                  class="w-1/3"
                >
                  <template #default>
                    <div class="px-8">{{ $t(destination.label) }}</div>
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="col-span-6">
            <el-form-item :label="$t('sales-unit')">
              <el-radio-group v-model="form.sales_unit" class="!w-full">
                <el-radio-button
                  v-for="destination in productStore.salesUnit"
                  :key="destination.value"
                  :label="destination.value"
                  class="w-1/3"
                >
                  <template #default>
                    <div class="px-8">{{ $t(destination.label) }}</div>
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="col-span-4">
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
          <div class="col-span-4">
            <el-form-item :label="$t('unity-measure')" prop="unity_measure">
              <el-select-v2
                v-model="form.unity_measure"
                class="w-full"
                clearable
                filterable
                :options="productStore.measureUnits.map((el) => ({ ...el, label: $t(el.label) }))"
                value-key="value"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item :label="$t('nbr-unit')" prop="nbr_unities">
              <el-input-number v-model="form.nbr_unities" class="!w-full" :min="0" />
            </el-form-item>
          </div>

          <div class="col-span-4">
            <el-form-item :label="$t('net-weight')" prop="net_weight">
              <el-input-number v-model="form.net_weight" class="!w-full" :min="0" />
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item :label="$t('commercial-restraint')" prop="commercial_weight">
              <el-input-number v-model="form.commercial_weight" class="!w-full" :min="0" />
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item :label="$t('packaging-price')" prop="packaging_price">
              <el-input-number v-model="form.packaging_price" class="!w-full" :min="0" />
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item :label="$t('brand')" prop="brand_id">
              <el-select-v2
                v-model="form.brand_id"
                class="w-full"
                clearable
                filterable
                :options="brandStore.getBrands"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item :label="$t('category')" prop="product_category_id">
              <el-select-v2
                v-model="form.product_category_id"
                class="w-full"
                clearable
                filterable
                :options="productCategoryStore.getProductCategories"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item :label="$t('product-caliber')" prop="product_caliber_id">
              <el-select-v2
                v-model="form.product_caliber_id"
                class="w-full"
                clearable
                filterable
                :options="productCaliberStore.getProductCalibers"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item :label="$t('pallet-type')" prop="pallet_type_id">
              <el-select-v2
                v-model="form.pallet_type_id"
                class="w-full"
                clearable
                filterable
                :options="palletTypesStore.palletTypes.map((el) => ({ ...el, label: el.label }))"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item :label="$t('packaging-type')" prop="packhouse_unity_id">
              <el-select-v2
                v-model="form.packhouse_unity_id"
                class="!w-full"
                :options="packagingTypesStore.packagingTypes.map((el) => ({ ...el, label: el.label }))"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item :label="$t('nbr-box-pallet')" prop="nbr_box_per_pallet">
              <el-input-number v-model="form.nbr_box_per_pallet" class="!w-full" :min="1" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="product?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_product')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { t } from '@/plugins'
import { useDialog } from '@/helpers'

import { useProductStore } from '@/stores/product'
import { useVarietyStore } from '@/stores/variety'
import { useBrandStore } from '@/stores/brand'
import { useProductCategoryStore } from '@/stores/productCategory'
import { useProductCaliberStore } from '@/stores/productCaliber'
import { usePalletTypeStore } from '@/stores/palletType'
import { usePackagingTypesStore } from '@/stores/packagingTypes'

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['reload'])

const productStore = useProductStore()
const varietyStore = useVarietyStore()
const brandStore = useBrandStore()
const productCategoryStore = useProductCategoryStore()
const productCaliberStore = useProductCaliberStore()
const palletTypesStore = usePalletTypeStore()
const packagingTypesStore = usePackagingTypesStore()

const initForm = {
  code: null,
  name: null,
  destination: 0,
  variety_id: null,
  unity_measure: null,
  nbr_unities: 0,
  sales_unit: 0,
  commercial_weight: 0,
  net_weight: 0,
  packaging_price: 0,
  brand_id: null,
  product_category_id: null,
  product_caliber_id: null,
  pallet_type_id: null,
  packhouse_unity_id: null,
  nbr_box_per_pallet: 1,
}

const formRef = ref(null)
const form = ref(initForm)
const loading = ref(false)

const rules = reactive({
  code: [
    {
      required: true,
      message: t('please-input-code'),
      trigger: 'blur',
    },
  ],
  name: [
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
  unity_measure: [
    {
      required: true,
      message: t('please-select-measure-unit'),
      trigger: 'blur',
    },
  ],
  nbr_unities: [
    {
      required: true,
      message: t('please-input-nbr-unities'),
      trigger: 'blur',
    },
  ],
  commercial_weight: [
    {
      required: true,
      message: t('please-input-commercial-restraint'),
      trigger: 'blur',
    },
  ],
  net_weight: [
    {
      required: true,
      message: t('please-input-net-weight'),
      trigger: 'blur',
    },
  ],
  packaging_price: [
    {
      required: true,
      message: t('please-select-packaging-price'),
      trigger: 'blur',
    },
  ],
  brand_id: [
    {
      required: true,
      message: t('please-select-brand'),
      trigger: 'blur',
    },
  ],
  product_category_id: [
    {
      required: true,
      message: t('please-select-product-category'),
      trigger: 'blur',
    },
  ],
  product_caliber_id: [
    {
      required: true,
      message: t('please-select-product-caliber'),
      trigger: 'blur',
    },
  ],
  pallet_type_id: [
    {
      required: true,
      message: t('please-select-pallet-type'),
      trigger: 'blur',
    },
  ],
  packhouse_unity_id: [
    {
      required: true,
      message: t('please-select-packaging-type'),
      trigger: 'blur',
    },
  ],
  nbr_box_per_pallet: [
    {
      required: true,
      message: t('please-input-nbr-box-per-pallet'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.product,
  (newVal) => {
    form.value = Object.assign({}, newVal?.id ? newVal : initForm)
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        productStore
          .update(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        productStore
          .create(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_product')

  loading.value = false
  form.value = Object.assign({}, initForm)

  emit('reload')
}
</script>
