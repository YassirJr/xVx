<template>
  <el-dialog
    draggable
    :title="$t(item?.id ? 'update-item' : 'add-new-item')"
    :model-value="useDialog.visible('create_edit_item')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="60%"
    @close="useDialog.close('create_edit_item')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-3 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('code')" prop="code">
              <el-input v-model="form.code" class="!w-full" :disabled="Boolean(item?.id)"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('label')" prop="label">
              <el-input v-model="form.label" class="!w-full"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('storable')" prop="storable">
              <el-radio-group v-model="form.storable" class="!w-full">
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
            <el-form-item :label="$t('family')" prop="family_item_id">
              <el-select v-model="form.family_item_id" class="!w-full" @change="onFamilyItemChange()">
                <el-option
                  v-for="(familyItem, i) in familyItemStore.familyItems"
                  :key="i"
                  :label="familyItem.label"
                  :value="familyItem.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('sub-family')" prop="sub_family_item_id">
              <el-select v-model="form.sub_family_item_id" class="!w-full">
                <el-option
                  v-for="(subFamily, i) in filtredSubFalimy"
                  :key="i"
                  :label="subFamily.label"
                  :value="subFamily.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('brand')" prop="brand_id">
              <el-select v-model="form.brand_id" class="!w-full">
                <el-option
                  v-for="(brand, i) in brandStore.brands"
                  :key="i"
                  :label="brand.label"
                  :value="brand.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('measure-unit')" prop="unit">
              <el-select v-model="form.unit" class="!w-full">
                <el-option
                  v-for="(unit, i) in itemStore.itemUnities"
                  :key="i"
                  :label="$t(unit.label)"
                  :value="unit.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('stock-min')" prop="min_stock">
              <el-input-number v-model="form.min_stock" class="!w-full"></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('stock-evaluation-mode')" prop="stock_evaluation_mode">
              <el-select v-model="form.stock_evaluation_mode" class="!w-full">
                <el-option
                  v-for="(evaluationMode, i) in itemStore.evaluationModes"
                  :key="i"
                  :label="$t(evaluationMode.label)"
                  :value="evaluationMode.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('price')" prop="unit_cost">
              <el-input-number
                v-model="form.unit_cost"
                :precision="2"
                :step="0.1"
                :min="0"
                class="!w-full"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('vat-rates')" prop="vat_rate">
              <el-select v-model="form.vat_rate" class="!w-full">
                <el-option
                  v-for="(rate, i) in itemStore.vatRates"
                  :key="i"
                  :label="rate.label"
                  :value="rate.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('status')" prop="is_active">
              <el-switch v-model="form.is_active" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="item?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_item')"
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
import { ref, watch, reactive, computed } from 'vue'
import { useItemStore } from '@/stores/item'
import { useSubFamilyItemStore } from '@/stores/subfamilyItem'
import { useFamilyItemStore } from '@/stores/familyItem'
import { useBrandStore } from '@/stores/brand'

const initForm = {
  code: null,
  label: null,
  storable: true,
  sub_family_item_id: null,
  family_item_id: null,
  brand_id: null,
  unit: null,
  min_stock: null,
  stock_evaluation_mode: null,
  unit_cost: null,
  vat_rate: null,
  is_active: true,
}

const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const formRef = ref(null)
const form = ref(initForm)

const itemStore = useItemStore()
const subfamilyItemStore = useSubFamilyItemStore()
const familyItemStore = useFamilyItemStore()
const brandStore = useBrandStore()

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
  family_item_id: [
    {
      required: true,
      message: t('please-select-family'),
      trigger: 'blur',
    },
  ],
  sub_family_item_id: [
    {
      required: true,
      message: t('please-select-sub-family'),
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
  unit: [
    {
      required: true,
      message: t('please-select-measure-unit'),
      trigger: 'blur',
    },
  ],
  min_stock: [
    {
      required: true,
      message: t('please-input-stock-min'),
      trigger: 'blur',
    },
  ],
  stock_evaluation_mode: [
    {
      required: true,
      message: t('please-input-stock-evaluation-mode'),
      trigger: 'blur',
    },
  ],
  unit_cost: [
    {
      required: true,
      message: t('please-input-price'),
      trigger: 'blur',
    },
  ],
  vat_rate: [
    {
      required: true,
      message: t('please-select-vat-rate'),
      trigger: 'blur',
    },
  ],
})

const filtredSubFalimy = computed(() => {
  return subfamilyItemStore.subfamilyItems.filter((item) => item.family_item_id == form.value.family_item_id)
})

watch(
  () => props.item,
  (newVal) => {
    if (newVal?.id) {
      const { subfamily_item } = newVal
      form.value = Object.assign(
        {},
        {
          ...newVal,
          family_item_id: subfamily_item.family_item_id,
        },
      )
    } else {
      form.value = {
        ...initForm,
        code: (parseInt(itemStore.latestItem) + 1).toString(),
      }
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        itemStore
          .updateItem(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        itemStore
          .newItem(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_item')
  loading.value = false
  form.value = initForm
  emit('reload')
}

const onFamilyItemChange = () => {
  form.value.sub_family_item_id = null
}
</script>
