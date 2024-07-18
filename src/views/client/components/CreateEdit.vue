<template>
  <el-dialog
    draggable
    :title="$t(client?.id ? 'update-client' : 'add-new-client')"
    :model-value="$dialog.visible('create_edit_client')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="$dialog.close('create_edit_client')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('code')" prop="code">
              <el-input
                v-model="form.code"
                class="!w-full"
                :controls="false"
                :disabled="Boolean(client?.id)"
              ></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('active')" prop="is_active">
              <el-radio-group v-model="form.is_active" class="w-full">
                <el-radio-button
                  v-for="option in clientStatus"
                  :key="option.value"
                  :label="option.value"
                  class="w-1/2"
                >
                  <template #default>
                    <div class="px-8">{{ $t(option.label) }}</div>
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('phone-number')" prop="phone_number">
              <el-input v-model="form.phone_number" maxlength="11" clearable></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('address')" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1 grid grid-cols-2 gap-x-5">
            <div class="col-span-1">
              <el-form-item :label="$t('city')" prop="city">
                <el-input v-model="form.city"></el-input>
              </el-form-item>
            </div>
            <div class="col-span-1">
              <el-form-item :label="$t('country')" prop="country">
                <el-select-v2
                  v-model="form.country"
                  filterable
                  :reserve-keyword="false"
                  :options="countries.map((el) => ({ label: el.name, value: el.code }))"
                  class="w-full"
                ></el-select-v2>
              </el-form-item>
            </div>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('market')" prop="is_international">
              <el-radio-group v-model="form.is_international" class="w-full">
                <el-radio-button
                  v-for="option in clientStore.marketTypes"
                  :key="option.value"
                  :label="option.value"
                  class="w-1/2"
                >
                  <template #default>
                    <div class="px-8">{{ $t(option.label) }}</div>
                  </template>
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('currency')" prop="currency">
              <el-select-v2
                v-model="form.currency"
                filterable
                :reserve-keyword="false"
                :options="currencies.map((el) => ({ label: $t(el), value: el }))"
                class="w-full"
              ></el-select-v2>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="client?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_client')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useClientStore } from '@/stores/client'
import { useDialog, PhoneNumRegex, phoneNumberFormat } from '@/helpers'
import { countries, currencies } from '@/constants'
import { t } from '@/plugins'
import { reactive, ref, watch } from 'vue'

const initForm = {
  code: null,
  name: null,
  is_active: true,
  phone_number: null,
  address: null,
  city: null,
  country: null,
  currency: null,
  is_international: true,
}

const props = defineProps({
  client: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const form = ref(initForm)
const formRef = ref(null)
const clientStatus = ref([
  { label: 'yes', value: true },
  { label: 'no', value: false },
])

const clientStore = useClientStore()

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
      message: t('please-input-name-client'),
      trigger: 'blur',
    },
  ],
  phone_number: [
    {
      pattern: PhoneNumRegex,
      message: t('please-input-correct-phone-number'),
      trigger: 'blur',
    },
  ],
  address: [
    {
      required: true,
      message: t('please-input-address'),
      trigger: 'blur',
    },
  ],
  city: [
    {
      required: true,
      message: t('please-input-city'),
      trigger: 'blur',
    },
  ],
  country: [
    {
      required: true,
      message: t('please-select-country'),
      trigger: 'blur',
    },
  ],
  currency: [
    {
      required: true,
      message: t('please-select-currency'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.client,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = Object.assign({}, initForm)
    }
  },
)

watch(
  () => form.value.phone_number,
  (newVal) => {
    form.value.phone_number = phoneNumberFormat(newVal, form.value.phone_number)
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      if (props.client?.id) {
        clientStore
          .updateClient(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        clientStore
          .newClient(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_client')
  loading.value = false
  form.value = Object.assign({}, initForm)
  emit('reload')
}
</script>
