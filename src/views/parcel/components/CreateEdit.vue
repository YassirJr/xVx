<template>
  <el-dialog
    draggable
    :title="$t(parcel?.id ? 'edit-parcel' : 'create-new-parcel')"
    :model-value="$dialog.visible('create_edit_parcel')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_parcel')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('code')" prop="code">
              <el-input-number
                v-model="form.code"
                class="!w-full"
                :disabled="Boolean(parcel?.id)"
                controls-position="right"
              />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('surface')" prop="surface">
              <el-input-number
                v-model="form.surface"
                class="!w-full"
                :precision="2"
                :step="0.1"
                :disabled="Boolean(parcel?.id)"
              />
            </el-form-item>
          </div>
          <div class="col-span-1 relative">
            <el-form-item :label="$t('site')" prop="site_id">
              <el-select v-model="form.site_id" clearable filterable class="w-full">
                <el-option
                  v-for="site in siteStore.sites"
                  :key="site.id"
                  :label="site.name"
                  :value="site.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="absolute right-0 top-0">
              <el-button type="primary" text size="small" @click="$dialog.open('create_edit_site')">
                {{ $t('new-site') }}
              </el-button>
            </div>
          </div>
          <div class="col-span-1 relative">
            <el-form-item :label="$t('status')" prop="status">
              <el-switch v-model="form.status"></el-switch>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="parcel?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_parcel')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>

    <new-site></new-site>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { useDialog } from '@/helpers'
import { t } from '@/plugins'
import { useParcelStore } from '@/stores/parcel'
import { useSiteStore } from '@/stores/site'
import NewSite from '@/views/site/components/CreateEdit'

const siteStore = useSiteStore()
const parcelStore = useParcelStore()
const emit = defineEmits(['reload'])

const props = defineProps({
  parcel: {
    type: Object,
    default: () => ({}),
  },
})

const initForm = reactive({
  name: null,
  code: null,
  surface: null,
  status: true,
  site_id: null,
})

const rules = reactive({
  name: [
    {
      required: true,
      message: t('please-input-name'),
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: t('please-input-parcel-code'),
      trigger: 'blur',
      type: 'integer',
      min: 1,
    },
  ],
  surface: [
    {
      required: true,
      message: t('please-input-surface'),
      trigger: 'blur',
      type: 'number',
      min: 0.01,
    },
  ],
  site_id: [
    {
      required: true,
      message: t('please-select-site'),
      trigger: 'blur',
    },
  ],
})

const loading = ref(false)
const formRef = ref()
const form = ref(initForm)

onMounted(() => {
  siteStore.fetchAllSites()
})

watch(
  () => props.parcel,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = Object.assign({}, { code: parcelStore.latestParcelCode, ...initForm })
    }
  },
)

watch(
  () => parcelStore.latestParcelCode,
  (newVal) => {
    if (!props.parcel?.id) form.value.code = newVal
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        parcelStore
          .updateParcel(form.value)
          .then(() => reset())
          .finally(() => {
            loading.value = false
          })
      } else {
        parcelStore
          .newParcel(form.value)
          .then(() => reset())
          .finally(() => {
            loading.value = false
          })
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_parcel')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
