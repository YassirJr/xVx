<template>
  <el-dialog
    draggable
    :title="$t(stade?.id ? 'edit-stade' : 'create-new-stade')"
    :model-value="useDialog.visible('create_edit_stade')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_stade')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <el-form-item :label="$t('name')" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="stade?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_stade')"
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
import { reactive, ref, watch } from 'vue'
import { useStadeStore } from '@/stores/stade'

const props = defineProps({
  stade: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['reload'])

const loading = ref(false)
const formRef = ref()
const form = ref({
  name: null,
})
const stadeStore = useStadeStore()

const rules = reactive({
  name: [
    {
      required: true,
      message: t('please-input-name'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.stade,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = Object.assign(
        {},
        {
          name: null,
        },
      )
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        stadeStore
          .updateStade(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        stadeStore
          .newStade(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}
const reset = () => {
  useDialog.close('create_edit_stade')
  loading.value = false
  form.value = Object.assign(
    {},
    {
      name: null,
    },
  )
  emit('reload')
}
</script>
