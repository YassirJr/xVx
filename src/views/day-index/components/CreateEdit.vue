<template>
  <el-dialog
    draggable
    :title="$t(dayIndex?.id ? 'update-day-index' : 'add-new-day-index')"
    :model-value="$dialog.visible('create_edit_day_index')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_day_index')"
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
                :disabled="Boolean(dayIndex?.id)"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('index-date')" prop="index_date">
              <el-date-picker v-model="form.index_date" class="!w-full" format="DD-MM-YYYY"></el-date-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="dayIndex?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_day_index')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useDayIndexStore } from '@/stores/dayIndex'
import { useDialog } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { ref, watch } from 'vue'

const dayIndexStore = useDayIndexStore()
const props = defineProps({
  dayIndex: {
    type: Object,
    default: null,
  },
})

const loading = ref(false)
const formRef = ref(null)
const initForm = {
  code: null,
  index_date: null,
}

const form = ref(initForm)
const emit = defineEmits(['reload'])

const rules = {
  code: [
    {
      required: true,
      message: t('please-input-code'),
      trigger: 'blur',
    },
  ],
  index_date: [
    {
      required: true,
      message: t('please-input-index-date'),
      trigger: 'blur',
    },
  ],
}

watch(
  () => props.dayIndex,
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
      const newForm = { ...form.value, index_date: dayjs(form.value.index_date).format() }

      if (newForm?.id) {
        dayIndexStore
          .updateDayIndex(newForm)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        dayIndexStore
          .newDayIndex(newForm)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_day_index')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
