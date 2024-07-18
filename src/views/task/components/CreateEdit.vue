<template>
  <el-dialog
    draggable
    :title="$t(task?.id ? 'edit-task' : 'create-new-task')"
    :model-value="$dialog.visible('create_edit_task')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_task')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('code')" prop="code">
              <el-input v-model="form.code" :disabled="Boolean(task?.id)"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1 relative">
            <el-form-item :label="$t('stade')" prop="stade_id">
              <el-select v-model="form.stade_id" clearable filterable class="w-full">
                <el-option
                  v-for="stade in stadeStore.stades"
                  :key="stade.id"
                  :label="stade.name"
                  :value="stade.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="absolute right-0 top-0">
              <el-button type="primary" text size="small" @click="$dialog.open('create_edit_stade')">
                {{ $t('new-stade') }}
              </el-button>
            </div>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('task-bonus')" prop="task_bonus">
              <el-input-number
                v-model="form.task_bonus"
                class="!w-full"
                :precision="2"
                :min="0"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1 relative">
            <el-form-item :label="$t('varieties')" prop="variety_ids">
              <el-select v-model="form.variety_ids" clearable filterable class="w-full" multiple>
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
            <el-form-item :label="$t('direct')" prop="is_direct">
              <el-switch v-model="form.is_direct" />
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('hours-only')" prop="accept_hours_only">
              <el-switch v-model="form.accept_hours_only" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="task?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_task')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>

    <new-variety></new-variety>
    <new-stade></new-stade>
  </el-dialog>
</template>

<script setup>
import { useDialog } from '@/helpers'
import { t } from '@/plugins'
import { ref, reactive, watch } from 'vue'
import { useTaskStore } from '@/stores/task'
import NewVariety from '@/views/variety/components/CreateEdit'
import NewStade from '@/views/stade/components/CreateEdit'
import { useStadeStore } from '@/stores/stade'
import { useVarietyStore } from '@/stores/variety'

const taskStore = useTaskStore()
const stadeStore = useStadeStore()
const varietyStore = useVarietyStore()

const props = defineProps({
  task: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const initForm = reactive({
  name: null,
  code: null,
  task_bonus: 0,
  is_direct: false,
  accept_hours_only: true,
  variety_ids: [],
})

const loading = ref(false)
const formRef = ref()
const form = ref(initForm)

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
      message: t('please-input-code'),
      trigger: 'blur',
    },
  ],
  stade_id: [
    {
      required: true,
      message: t('please-select-stade'),
      trigger: 'change',
    },
  ],
  variety_ids: [
    {
      required: true,
      type: 'array',
      min: 1,
      message: t('please-select-variety'),
      trigger: 'change',
    },
  ],
})

watch(
  () => props.task,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
      form.value.variety_ids = newVal.varieties.map(({ id }) => id)
    } else {
      form.value = Object.assign({}, initForm)
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      if (form.value?.id) {
        taskStore
          .updateTask(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        taskStore
          .newTask(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_task')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
