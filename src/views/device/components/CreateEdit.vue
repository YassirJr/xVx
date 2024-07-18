<template>
  <el-dialog
    draggable
    :title="$t(device?.id ? 'update-device' : 'add-new-device')"
    :model-value="useDialog.visible('create_edit_device')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_device')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="form.name" class="!w-full"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('tag-id')" prop="tag_id">
              <el-input v-model="form.tag_id" class="!w-full"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('token')" prop="token">
              <el-input v-model="form.token" class="!w-full"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('site')" prop="site_id">
              <el-select-v2
                v-model="form.site_id"
                class="w-full"
                clearable
                filterable
                :options="siteStore.getSites"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
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
          :type="device?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_device')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useDeviceStore } from '@/stores/device'
import { useSiteStore } from '@/stores/site'
import { t } from '@/plugins'
import { useDialog } from '@/helpers'

const props = defineProps({
  device: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const form = ref({
  name: null,
  tag_id: null,
  token: null,
  site_id: null,
  status: true,
})
const formRef = ref(null)

const deviceStore = useDeviceStore()
const siteStore = useSiteStore()

const rules = reactive({
  name: [
    {
      required: true,
      message: t('please-input-name'),
      trigger: 'blur',
    },
  ],
  tag_id: [
    {
      required: true,
      message: t('please-input-tag-id'),
      trigger: 'blur',
    },
  ],
  token: [
    {
      required: true,
      message: t('please-input-token'),
      trigger: 'blur',
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

watch(
  () => props.device,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = {
        name: null,
        tag_id: null,
        token: null,
        site_id: null,
        status: true,
      }
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        deviceStore
          .updateDevice(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        deviceStore
          .newDevice(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_device')
  loading.value = false
  form.value = {
    name: null,
    tag_id: null,
    token: null,
    site_id: null,
    status: true,
  }
  emit('reload')
}
</script>
