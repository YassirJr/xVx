<template>
  <el-dialog
    draggable
    :title="$t('create-new-pointing-in-out')"
    :model-value="useDialog.visible('create_process_pointing')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    @close="useDialog.close('create_process_pointing')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('site')" prop="site_id">
              <el-select v-model="form.site_id" clearable filterable class="w-full">
                <el-option
                  v-for="(site, index) in siteStore.sites"
                  :key="index"
                  :label="site.name"
                  :value="site.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('reason')" prop="reason_id">
              <el-select v-model="form.reason_id" clearable filterable class="w-full">
                <el-option
                  v-for="(reason, index) in pointingReasonStore.reasons"
                  :key="index"
                  :label="reason.reason"
                  :value="reason.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item prop="added_at" :label="$t('date-time')">
              <el-date-picker
                v-model="form.added_at"
                class="!w-full"
                type="datetime"
                :format="DATE_TIME_FORMAT"
                :disabled-date="disabledDate"
                :default-value="defaultDate"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button plain type="primary" :loading="loading" :disabled="loading" @click="save()">
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="useDialog.close('create_process_pointing')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useDialog } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { DATE_TIME_FORMAT } from '@/constants'
import { usePointingInOutStore } from '@/stores/pointingInOut'
import { useSiteStore } from '@/stores/site'
import { usePointingReasonStore } from '@/stores/pointingReason'

const props = defineProps({
  processPointing: { type: Object, default: () => {} },
  multiplePointing: { type: Object, default: () => {} },
  payClosure: { type: Object, default: () => {} },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const form = ref({
  is_nature: false,
  site_id: null,
  processed_id: null,
  employee_id: null,
  reason_id: null,
  added_at: null,
})
const formRef = ref(null)

const pointingInOutStore = usePointingInOutStore()
const siteStore = useSiteStore()
const pointingReasonStore = usePointingReasonStore()

const rules = reactive({
  site_id: [
    {
      required: true,
      message: t('please-select-site'),
      trigger: 'blur',
    },
  ],
  reason_id: [
    {
      required: true,
      message: t('please-select-reason'),
      trigger: 'blur',
    },
  ],
  added_at: [
    {
      required: true,
      message: t('please-select-date-and-time'),
      trigger: 'blur',
    },
  ],
})

const defaultDate = computed(() => {
  return dayjs(props.payClosure.start_date).toDate()
})

watch(
  () => props.processPointing,
  (newVal) => {
    form.value = {
      is_nature: false,
      site_id: null,
      processed_id: newVal.id,
      employee_id: newVal.employee_id,
      reason_id: null,
      added_at: newVal.added_at,
      pay_closure_id: newVal.pay_closure_id,
    }
  },
  { deep: true },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      form.value.added_at = dayjs(form.value.added_at).format()
      if (props.multiplePointing?.length) {
        const newPointing = props.multiplePointing.map(({ id, employee_id }) => {
          const { is_nature, site_id, reason_id, added_at } = form.value

          return {
            is_nature,
            site_id,
            processed_id: id,
            employee_id,
            reason_id,
            pay_closure_id: props.payClosure.id,
            added_at,
          }
        })

        pointingInOutStore
          .newProcessedPointing(newPointing)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        pointingInOutStore
          .newProcessedPointing([form.value])
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_process_pointing')
  loading.value = false
  form.value = {
    is_nature: false,
    processed_id: null,
    site_id: null,
    employee_id: null,
    reason_id: null,
    added_at: null,
  }
  emit('reload')
}

const disabledDate = (date) => {
  const currentDate = dayjs(date)
  const addedAt = dayjs(props.processPointing?.added_at)

  if (props.multiplePointing?.length) {
    let start_date = +dayjs(props.payClosure.start_date).subtract(1, 'day')
    let end_date = +dayjs(props.payClosure.end_date).add(1, 'day')

    return date.getTime() > end_date || start_date > date.getTime()
  } else {
    return addedAt.subtract(-1, 'day') < currentDate || addedAt.subtract(1, 'day') > currentDate
  }
}
</script>
