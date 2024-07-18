<template>
  <el-dialog
    draggable
    :title="$t(unity?.id ? 'edit-unity' : 'create-new-unity')"
    :model-value="$dialog.visible('create_edit_unity')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_unity')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-4 gap-x-5">
          <div class="col-span-2">
            <el-form-item :label="$t('code')" prop="code">
              <el-input-number
                v-model="form.code"
                class="!w-full"
                :controls="false"
                :disabled="Boolean(unity?.id)"
              />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('label')" prop="label">
              <el-input v-model="form.label"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-2 relative">
            <el-form-item :label="$t('varieties')" prop="variety_id">
              <el-select v-model="form.variety_id" clearable filterable class="w-full">
                <el-option
                  v-for="variety in varietyStore.varieties"
                  :key="variety.id"
                  :label="variety.name"
                  :value="variety.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="absolute right-0 top-0">
              <el-button type="primary" text size="small" @click="$dialog.open('create_edit_variety')">
                {{ $t('new-variety') }}
              </el-button>
            </div>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('value')" prop="weight">
              <el-input-number
                v-model="form.weight"
                class="!w-full"
                :min="0"
                controls-position="right"
                :precision="2"
              />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('unit')" prop="by_kilogram">
              <el-radio-group v-model="form.by_kilogram" class="!w-full">
                <el-radio-button
                  v-for="(item, index) in unityStore.measureUnits"
                  :key="index"
                  class="!w-1/2"
                  :label="item.value"
                >
                  <template #default>
                    {{ $t(item.label) }}
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('price')" prop="price">
              <el-input-number v-model="form.price" class="!w-full" :min="1" controls-position="right" />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('status')" prop="status">
              <el-radio-group v-model="form.status" class="!w-full">
                <el-radio-button
                  v-for="(item, i) in unityStore.status"
                  :key="i"
                  class="!w-1/2"
                  :label="item.value"
                >
                  {{ $t(item.label) }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="unity?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_unity')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>

    <new-variety></new-variety>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { useDialog } from '@/helpers'
import { t } from '@/plugins'
import NewVariety from '@/views/variety/components/CreateEdit'
import { useUnityStore } from '@/stores/unity'
import { useVarietyStore } from '@/stores/variety'

const props = defineProps({
  unity: {
    type: Object,
    default: () => ({}),
  },
})

const unityStore = useUnityStore()
const varietyStore = useVarietyStore()

const emit = defineEmits(['reload'])

const initForm = reactive({
  code: null,
  label: null,
  variety_id: null,
  weight: null,
  by_kilogram: true,
  price: null,
  status: true,
})
const loading = ref(false)
const formRef = ref()
const form = ref(initForm)
const rules = {
  label: [
    {
      required: true,
      message: t('please-input-label'),
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
  variety_id: [
    {
      required: true,
      message: t('please-select-variety'),
      trigger: 'change',
    },
  ],
  weight: [
    {
      required: true,
      message: t('please-input-weight'),
      trigger: 'blur',
    },
  ],
  by_kilogram: [
    {
      required: true,
      message: t('please-select-measure-unit'),
      trigger: 'blur',
    },
  ],
  price: [
    {
      required: true,
      message: t('please-input-price'),
      trigger: 'blur',
    },
  ],
  status: [
    {
      required: true,
      message: t('please-select-status'),
      trigger: 'blur',
    },
  ],
}

onMounted(() => {
  varietyStore.fetchAllVarieties()
})

watch(
  () => props.unity,
  (newVal) => {
    form.value = Object.assign({}, newVal?.id ? newVal : initForm)
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    loading.value = true
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        unityStore.updateUnity(form.value).finally(() => {
          loading.value = false
          reset()
        })
      } else {
        unityStore.newUnity(form.value).finally(() => {
          loading.value = false
          reset()
        })
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_unity')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
