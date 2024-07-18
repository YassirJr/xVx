<template>
  <el-dialog
    draggable
    :title="$t(packhouseLine?.id ? 'update-packhouse-line' : 'add-new-packhouse-line')"
    :model-value="useDialog.visible('create_edit_packhouse_line')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_packhouse_line')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div>
            <el-form-item :label="$t('code')" prop="code">
              <el-input-number
                v-model="form.code"
                :disabled="Boolean(packhouseLine?.id)"
                class="!w-full"
                :min="1"
              ></el-input-number>
            </el-form-item>
          </div>
          <div>
            <el-form-item :label="$t('label')" prop="label">
              <el-input v-model="form.label"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-5">
          <div>
            <el-form-item :label="$t('station')" prop="site_id">
              <el-select-v2
                v-model="form.site_id"
                :reserve-keyword="false"
                :options="siteStore.getStationSites?.map((el) => ({ ...el, label: el.name }))"
                value-key="id"
                class="w-full"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div>
            <el-form-item :label="$t('status')" prop="is_active">
              <el-radio-group v-model="form.is_active" class="!w-full">
                <el-radio-button class="!w-1/2" :label="true">{{ $t('active') }}</el-radio-button>
                <el-radio-button class="!w-1/2" :label="false">
                  {{ $t('inactive') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button plain :type="packhouseLine?.id ? 'warning' : 'primary'" :loading="loading" @click="save()">
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="$dialog.close('create_edit_packhouse_line')"
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
import { ref, watch } from 'vue'
import { usePackhouseLineStore } from '@/stores/packhouseLine'
import { useSiteStore } from '@/stores/site'

const props = defineProps({
  packhouseLine: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const initForm = {
  code: null,
  label: null,
  site_id: null,
  is_active: true,
}

const siteStore = useSiteStore()
const packhouseLineStore = usePackhouseLineStore()

const loading = ref(false)
const formRef = ref(null)
const form = ref(initForm)
const rules = ref({
  code: [
    {
      required: true,
      message: t('please-input-code'),
      trigger: 'blur',
    },
  ],
  site_id: [
    {
      required: true,
      message: t('please-select-station'),
      trigger: 'blur',
    },
  ],
  label: [
    {
      required: true,
      message: t('please-input-label'),
      trigger: 'blur',
    },
  ],
  is_active: [
    {
      required: true,
      message: t('please-select-status'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.packhouseLine,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = { ...initForm }
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        packhouseLineStore
          .update(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        packhouseLineStore
          .create(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_packhouse_line')
  loading.value = false
  form.value = initForm
  emit('reload')
}
</script>
