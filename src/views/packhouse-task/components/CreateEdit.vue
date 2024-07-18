<template>
  <el-dialog
    draggable
    :title="$t(packhouseTask?.id ? 'update-packhouse-task' : 'add-new-packhouse-task')"
    :model-value="$dialog.visible('create_edit_packhouse_task')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_packhouse_task')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('code')" prop="code">
              <el-input-number
                v-model="form.code"
                class="!w-full"
                :min="1"
                :disabled="Boolean(packhouseTask?.id)"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('department')" prop="department_id">
              <el-select v-model="form.department_id" class="!w-full" filterable>
                <el-option
                  v-for="(department, i) in departments"
                  :key="i"
                  :label="department.label"
                  :value="department.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('task-bonus')" prop="task_bonus">
              <el-input-number v-model="form.task_bonus" :min="0" class="!w-full" />
            </el-form-item>
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
          :type="packhouseTask?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_packhouse_task')"
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
import { ref, onMounted, watch, reactive } from 'vue'
import { usePackhouseTaskStore } from '@/stores/packhouseTask'
import { useDepartmentStore } from '@/stores/department'

const packhouseTaskStore = usePackhouseTaskStore()
const departmentStore = useDepartmentStore()

const emit = defineEmits(['reload'])

const props = defineProps({
  packhouseTask: {
    type: Object,
    default: () => null,
  },
})

const initForm = {
  code: null,
  name: null,
  department_id: null,
  task_bonus: 0,
  is_direct: false,
  accept_hours_only: false,
}

const form = ref(initForm)
const loading = ref(false)
const formRef = ref(null)
const departments = ref([])
const rules = reactive({
  code: [
    {
      required: true,
      message: t('please-input-code'),
      trigger: 'blur',
    },
  ],
  name: [
    {
      required: true,
      message: t('please-input-name'),
      trigger: 'blur',
    },
  ],
  department_id: [
    {
      required: true,
      message: t('please-select-department'),
      trigger: 'blur',
    },
  ],
  task_bonus: [
    {
      required: true,
      message: t('please-input-task-bonus'),
      trigger: 'blur',
    },
  ],
})

onMounted(() => {
  departmentStore.fetchDepartments({ list: true }).then((res) => {
    departments.value = Object.assign(
      [],
      res.map((department) => ({
        id: department.id,
        label: department.label,
      })),
    )
  })
})

watch(
  () => props.packhouseTask,
  (val) => {
    if (val?.id) {
      form.value = Object.assign(
        {},
        {
          ...val,
          department_id: val.department?.id,
        },
      )
    } else {
      form.value = Object.assign({}, initForm)
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      if (props.packhouseTask?.id) {
        packhouseTaskStore
          .updatePackhouseTask(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        packhouseTaskStore
          .newPackhouseTask(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_packhouse_task')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
