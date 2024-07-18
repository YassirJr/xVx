<template>
  <el-dialog
    draggable
    :title="$t(familyItem?.id ? 'update-family-item' : 'add-new-family-item')"
    :model-value="$dialog.visible('create_edit_family_item')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_family_item')"
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
                :disabled="Boolean(familyItem?.id)"
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
          :type="familyItem?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_family_item')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import { useDialog } from '@/helpers'
import { t } from '@/plugins'
import { useFamilyItemStore } from '@/stores/familyItem'

const emit = defineEmits(['reload'])
const familyItemStore = useFamilyItemStore()
const props = defineProps({
  familyItem: {
    type: Object,
    default: null,
  },
})
const loading = ref(false)
const initForm = {
  code: null,
  label: null,
}
const form = ref(initForm)
const formRef = ref(null)
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
  () => props.familyItem,
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

      if (props.familyItem?.id) {
        familyItemStore
          .updateFamilyItem(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        familyItemStore
          .newFamilyItem(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_family_item')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
