<template>
  <el-dialog
    draggable
    :title="$t(subfamilyItem?.id ? 'update-subfamily-item' : 'add-new-subfamily-item')"
    :model-value="useDialog.visible('create_edit_subfamily_item')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_subfamily_item')"
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
                :disabled="Boolean(subfamilyItem?.id)"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('label')" prop="label">
              <el-input v-model="form.label"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('family')" prop="family_item_id">
              <el-select v-model="form.family_item_id" class="!w-full">
                <el-option
                  v-for="familyItem in familyItemStore.familyItems"
                  :key="familyItem.id"
                  :label="familyItem.label"
                  :value="familyItem.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="subfamilyItem?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_subfamily_item')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useSubFamilyItemStore } from '@/stores/subfamilyItem'
import { useFamilyItemStore } from '@/stores/familyItem'
import { useDialog } from '@/helpers'
import { t } from '@/plugins'

const props = defineProps({
  subfamilyItem: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['reload'])

const loading = ref(false)
const formRef = ref()
const form = ref({
  code: null,
  label: null,
  family_item_id: null,
})

const subFamilyItemStore = useSubFamilyItemStore()
const familyItemStore = useFamilyItemStore()

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
  family_item_id: [
    {
      required: true,
      message: t('please-select-family'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.subfamilyItem,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = Object.assign(
        {},
        {
          code: null,
          label: null,
          family_item_id: null,
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
        subFamilyItemStore
          .updateSubfamilyItem(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        subFamilyItemStore
          .newSubfamilyItem(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_subfamily_item')
  loading.value = false
  form.value = {
    code: null,
    label: null,
    family_item_id: null,
  }
  emit('reload')
}
</script>
