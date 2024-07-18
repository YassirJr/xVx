<template>
  <el-dialog
    draggable
    :title="$t('edit-pointing-in-out')"
    :model-value="useDialog.visible('edit_processed_in_out')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('edit_processed_in_out')"
  >
    <div v-loading="loading" class="py-5">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="grid grid-cols-1 gap-10">
          <div class="col-span-1">
            <el-form-item :label="$t('date-time')" prop="added_at">
              <el-date-picker
                v-model="form.added_at"
                class="!w-full"
                type="datetime"
                format="DD-MM-YYYY HH:mm"
                :placeholder="$t('date-time')"
                :disabled-date="disabledDate"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <template #footer>
      <div>
        <el-button plain type="warning" :loading="loading" :disabled="loading" @click="save()">
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="useDialog.close('edit_processed_in_out')"
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
import { t, dayjs } from '@/plugins'
import { usePointingInOutStore } from '@/stores/pointingInOut'

const props = defineProps({
  pointing: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const form = ref({ added_at: null })
const formRef = ref(null)

const pointingInOutStore = usePointingInOutStore()

const rules = reactive({
  added_at: [
    {
      required: true,
      message: t('please-select-start-date'),
      trigger: 'blur',
      type: 'date',
    },
  ],
})

watch(
  () => props.pointing,
  (newVal) => {
    form.value = Object.assign({}, newVal)
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      form.value.added_at = dayjs(form.value.added_at).format()

      pointingInOutStore.updatePointingInOut(form.value).finally(() => {
        loading.value = false
        emit('reload')
        useDialog.close('edit_processed_in_out')
        useDialog.close('processed_in_out_data_details')
      })
    }
  })
}

const disabledDate = (date) => {
  return date > new Date()
}
</script>
