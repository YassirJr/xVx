<template>
  <el-dialog
    draggable
    :title="$t(purchaseUser?.id ? 'update-purchase-user-matrix' : 'add-new-purchase-user-matrix')"
    :model-value="$dialog.visible('create_edit_purchase_user')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="60%"
    @close="$dialog.close('create_edit_purchase_user')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('user')" prop="user_id">
              <el-select v-model="form.user_id" class="!w-full">
                <el-option
                  v-for="user in userStore.users"
                  :key="user.id"
                  :label="user.username"
                  :value="user.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('nature')" prop="nature">
              <status-component v-model="form.nature" :status="purchaseUsersStore.natures"></status-component>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('departments')" prop="departments">
              <el-select v-model="form.departments" clearable filterable class="!w-full" multiple>
                <el-option
                  v-for="(department, i) in departmentStore.departments"
                  :key="i"
                  :label="department.label"
                  :value="department.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-1 flex gap-6">
            <el-form-item :label="$t('is-applicant')" prop="is_applicant" class="!w-1/2">
              <status-component
                v-model="form.is_applicant"
                :status="purchaseUsersStore.status"
              ></status-component>
            </el-form-item>
            <el-form-item :label="$t('is-validator')" prop="is_validator" class="!w-1/2">
              <status-component
                v-model="form.is_validator"
                :status="purchaseUsersStore.status"
              ></status-component>
            </el-form-item>
          </div>
          <el-divider class="col-span-2 mb-8"></el-divider>
          <div class="col-span-1">
            <el-form-item :label="$t('is-order-validator')" prop="is_order_validator">
              <status-component
                v-model="form.is_order_validator"
                :status="purchaseUsersStore.status"
              ></status-component>
            </el-form-item>
          </div>
          <div class="col-span-1 flex gap-6">
            <el-form-item :label="$t('min-price')" prop="min_price">
              <el-input-number
                v-model="form.min_price"
                :min="0"
                :precision="2"
                class="!w-full"
              ></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('max-price')" prop="max_price">
              <el-input-number
                v-model="form.max_price"
                :min="0"
                :precision="2"
                class="!w-full"
              ></el-input-number>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="purchaseUser?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_purchase_user')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { t } from '@/plugins'
import { useDialog } from '@/helpers'
import StatusComponent from './StatusComponent'

import { usePurchaseUserStore } from '@/stores/purchaseUser'
import { useDepartmentStore } from '@/stores/department'
import { useUserStore } from '@/stores/user'

const purchaseUsersStore = usePurchaseUserStore()
const departmentStore = useDepartmentStore()
const userStore = useUserStore()

const props = defineProps({
  purchaseUser: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['reload'])

const initForm = reactive({
  nature: null,
  is_applicant: false,
  is_validator: false,
  is_order_validator: false,
  min_price: 0,
  max_price: 0,
  departments: [],
  user_id: null,
})

const loading = ref(false)
const form = ref(initForm)
const formRef = ref()

const rules = reactive({
  purchase_user_id: [{ required: true, message: t('please-select-user'), trigger: 'change' }],
  nature: [{ required: true, message: t('please-check-nature'), trigger: 'blur' }],
  departments: [
    { required: true, type: 'array', min: 1, message: t('please-select-department'), trigger: 'blur' },
  ],
  is_applicant: [{ required: true, message: t('please-check-is-applicant'), trigger: 'blur' }],
  is_validator: [{ required: true, message: t('please-check-is-validator'), trigger: 'blur' }],
  is_order_validator: [{ required: true, message: t('please-check-is-order-validator'), trigger: 'blur' }],
  min_price: [{ required: false, message: t('please-input-max-price'), trigger: 'blur' }],
  max_price: [{ required: false, message: t('please-input-min-price'), trigger: 'blur' }],
})

watch(
  () => props.purchaseUser,
  (value) => {
    if (value?.id) {
      form.value = Object.assign({}, value)
      form.value.departments = value.departments.map((department) => department.id)
    } else {
      form.value = Object.assign({}, initForm)
      form.value.nature = purchaseUsersStore.natures[0].value
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      if (form.value?.id) {
        purchaseUsersStore
          .updatePurchaseUser(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        purchaseUsersStore
          .newPurchaseUser(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_purchase_user')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
