<template>
  <el-dialog
    draggable
    :title="$t(user?.id ? 'edit-user' : 'create-new-user')"
    :model-value="useDialog.visible('create_edit_user')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_user')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('username')" prop="username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('password')" prop="password">
              <el-input v-model="form.password" type="password" show-password :disabled="loading"></el-input>
              <div v-if="form.id" class="text-xs text-gray-400">
                {{ $t('leave-the-password-empty-to-keep-the-previous-one') }}
              </div>
            </el-form-item>
          </div>
          <div class="col-span-1 relative">
            <el-form-item :label="$t('role')" prop="role_id">
              <el-select v-model="form.role_id" clearable filterable class="w-full">
                <el-option
                  v-for="role in roles"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id"
                ></el-option>
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
          :type="user?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_user')"
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
import { useUserStore } from '@/stores/user'
import { useRoleStore } from '@/stores/role'
import { reactive, ref, watch, computed } from 'vue'

const initForm = { username: null, password: null, role_id: null }
const loading = ref(false)
const formRef = ref()
const form = ref(initForm)
const userStore = useUserStore()
const roleStore = useRoleStore()

const roles = computed(() => roleStore.roles)

const props = defineProps({
  user: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const rules = reactive({
  username: [
    {
      required: true,
      message: t('please-input-username'),
      trigger: 'blur',
    },
    {
      min: 6,
      trigger: 'blur',
      message: t('the-username-must-be-at-least-6-characters'),
    },
  ],
  password: [
    {
      required: form.value?.id,
      message: t('please-input-password'),
      trigger: 'blur',
    },
    { min: 6, trigger: 'blur', message: t('the-password-must-be-at-least-6-characters') },
  ],
  role_id: [
    {
      required: true,
      message: t('please-select-role'),
      trigger: 'change',
    },
  ],
})

watch(
  () => props.user,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign(
        {},
        {
          ...newVal,
          password: null,
          role_id: newVal.role.id,
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
      if (form.value?.id) {
        userStore
          .updateUser(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        userStore
          .newUser(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_user')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
