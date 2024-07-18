<template>
  <el-form ref="formRef" :model="form" :rules="personalRules" label-position="top">
    <div class="grid grid-cols-6 gap-x-5">
      <div class="col-span-4">
        <el-form-item :label="$t('code')" prop="uid">
          <el-input-number
            v-model="form.uid"
            class="!w-full"
            :controls="false"
            :min="1"
            :disabled="Boolean(employee?.id)"
          ></el-input-number>
        </el-form-item>
      </div>
      <div class="col-span-2">
        <el-form-item :label="$t('active')" prop="status">
          <el-radio-group v-model="form.status" class="!w-full">
            <el-radio-button :key="0" class="!w-1/2" :label="true">
              <template #default>
                {{ $t('yes') }}
              </template>
            </el-radio-button>
            <el-radio-button :key="1" class="!w-1/2" :label="false">
              <template #default>
                {{ $t('no') }}
              </template>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="col-span-2">
        <el-form-item :label="$t('firstname')" prop="firstname">
          <el-input v-model="form.firstname"></el-input>
        </el-form-item>
      </div>
      <div class="col-span-2">
        <el-form-item :label="$t('lastname')" prop="lastname">
          <el-input v-model="form.lastname"></el-input>
        </el-form-item>
      </div>
      <div class="col-span-2">
        <el-form-item :label="$t('gender')" prop="gender">
          <el-radio-group v-model="form.gender" class="!w-full">
            <el-radio-button
              v-for="(item, index) in employeeStore.genders"
              :key="index"
              class="!w-1/2"
              :label="item.value"
            >
              <template #default>
                {{ $t(item.label) }}
              </template>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
      <div :class="isQFS ? 'col-span-3' : 'col-span-2'">
        <el-form-item :label="$t('cin')" prop="cin">
          <el-input v-model="form.cin"></el-input>
        </el-form-item>
      </div>
      <div :class="isQFS ? 'col-span-3' : 'col-span-2'">
        <el-form-item :label="$t('phone-number')" prop="phone_number">
          <el-input v-model="form.phone_number" maxlength="11" clearable></el-input>
        </el-form-item>
      </div>
      <div :class="isQFS ? 'col-span-3' : 'col-span-2'">
        <el-form-item class="!w-full" :label="$t('date-of-birth')" prop="birth_date">
          <el-date-picker v-model="form.birth_date" class="!w-full" format="DD-MM-YYYY"></el-date-picker>
        </el-form-item>
      </div>
      <div v-if="isQFS" class="col-span-3">
        <el-form-item :label="$t('place-of-birth')" prop="place_of_birth">
          <el-input v-model="form.place_of_birth"></el-input>
        </el-form-item>
      </div>
      <div :class="isQFS ? 'col-span-2' : 'col-span-3'">
        <el-form-item prop="family_status" :label="$t('family-status')">
          <el-select v-model="form.family_status" class="!w-full" clearable filterable>
            <el-option
              v-for="status in employeeStore.familyStatus"
              :key="status.value"
              :label="$t(status.label)"
              :value="status.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div :class="isQFS ? 'col-span-2' : 'col-span-3'">
        <el-form-item :label="$t('number-of-children')" prop="nbr_children">
          <el-input-number
            v-model="form.nbr_children"
            class="!w-full"
            :min="0"
            :max="99"
            :value-on-clear="0"
          ></el-input-number>
        </el-form-item>
      </div>
      <div v-if="isQFS" class="col-span-2">
        <el-form-item :label="$t('number-of-wives')" prop="nbr_wives">
          <el-input-number
            v-model="form.nbr_wives"
            class="!w-full"
            :min="0"
            :max="99"
            :value-on-clear="0"
          ></el-input-number>
        </el-form-item>
      </div>
      <div class="col-span-3">
        <el-form-item :label="$t('address')" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </div>
      <div class="col-span-3 relative">
        <el-form-item :label="$t('departure')" prop="departure_id">
          <el-select v-model="form.departure_id" class="w-full" clearable filterable>
            <el-option
              v-for="departure in departureStore.departures"
              :key="departure.id"
              :label="departure.label"
              :value="departure.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="absolute right-0 top-0">
          <el-button type="primary" text size="small" @click="useDialog.open('create_edit_departure')">
            {{ $t('new-departure') }}
          </el-button>
        </div>
      </div>
      <div class="col-span-3 relative">
        <el-form-item :label="$t('bank')" prop="bank_id">
          <el-select v-model="form.bank_id" class="w-full" clearable filterable>
            <el-option
              v-for="bank in bankStore.banks"
              :key="bank.id"
              :label="bank.label"
              :value="bank.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="absolute right-0 top-0">
          <el-button type="primary" text size="small" @click="useDialog.open('create_edit_bank')">
            {{ $t('add-bank') }}
          </el-button>
        </div>
      </div>
      <div class="col-span-3">
        <el-form-item :label="$t('bank-statement')" prop="bank_statement">
          <el-input v-model="form.bank_statement" class="!w-full"></el-input>
        </el-form-item>
      </div>
    </div>
  </el-form>

  <new-departure></new-departure>
  <new-bank></new-bank>
</template>

<script setup>
import { isQFS, useDialog, PhoneNumRegex, phoneNumberFormat } from '@/helpers'
import { dayjs, t } from '@/plugins'
import NewDeparture from '@/views/departure/components/CreateEdit'
import NewBank from '@/views/bank/components/CreateEdit'
import { useBankStore } from '@/stores/bank'
import { useDepartureStore } from '@/stores/departure'
import { useEmployeeStore } from '@/stores/employee'
import { computed, ref, watch, defineProps, onMounted } from 'vue'
import { DATE_FORMAT } from '@/constants'

const formInit = {
  status: true,
  firstname: null,
  lastname: null,
  gender: null,
  cin: null,
  uid: null,
  birth_date: null,
  place_of_birth: null,
  family_status: null,
  nbr_children: 0,
  nbr_wives: 0,
  address: null,
  departure_id: null,
  bank_id: null,
  bank_statement: null,
  phone_number: null,
}
const form = ref({ ...formInit })
const formRef = ref(null)
const employeeStore = useEmployeeStore()
const departureStore = useDepartureStore()
const bankStore = useBankStore()

const props = defineProps({
  employee: {
    type: Object,
    default: () => {},
  },
})

watch(
  () => form.value.firstname,
  (newVal) => {
    const firstname = newVal ? newVal.toUpperCase() : newVal
    form.value = Object.assign({}, { ...form.value, firstname })
  },
)
watch(
  () => form.value.lastname,
  (newVal) => {
    const lastname = newVal ? newVal.toUpperCase() : newVal
    form.value = Object.assign({}, { ...form.value, lastname })
  },
)
watch(
  () => form.value.address,
  (newVal) => {
    const address = newVal ? newVal.toUpperCase() : newVal
    form.value = Object.assign({}, { ...form.value, address })
  },
)
watch(
  () => form.value.cin,
  (newVal, oldVal) => {
    const cin = newVal === null ? null : isQFS || newVal?.length <= 8 ? newVal?.toUpperCase() : oldVal

    form.value = Object.assign({}, { ...form.value, cin })
  },
)
watch(
  () => form.value.bank_statement,
  (newVal, oldVal) => {
    const bank_statement =
      newVal != null && newVal != '' && (newVal?.length > 24 || (!isQFS && isNaN(+newVal))) ? oldVal : newVal
    form.value = Object.assign({}, { ...form.value, bank_statement })
  },
)
watch(
  () => form.value.phone_number,
  (newVal) => {
    form.value.phone_number = phoneNumberFormat(newVal, form.value.phone_number)
  },
)

const setForm = (data) => {
  if (data?.id) {
    const { birth_date } = data
    let employee = {
      ...data,
      birth_date: dayjs(birth_date, DATE_FORMAT).toString(),
    }

    Object.keys(formInit).forEach((key) => {
      form.value[key] = employee[key]
    })
  } else {
    form.value = Object.assign({}, { ...formInit, uid: employeeStore.latest_uid })
  }
}
onMounted(() => setForm(props.employee))

watch(
  () => props.employee,
  (newVal) => setForm(newVal),
)

const cinRule = computed(() => {
  const rule = [
    {
      required: true,
      message: t('please-input-cin'),
      trigger: 'blur',
    },
  ]
  if (!isQFS) {
    rule.push({
      min: 4,
      max: 8,
      pattern: /^[A-Z]{1,3}[0-9]{2,6}$/g,
      message: t('cin-is-invalid'),
      trigger: 'blur',
    })
  }

  return rule
})

const personalRules = computed(() => ({
  firstname: [
    {
      required: true,
      message: t('please-input-firstname'),
      trigger: 'blur',
    },
  ],
  lastname: [
    {
      required: true,
      message: t('please-input-lastname'),
      trigger: 'blur',
    },
  ],
  gender: [
    {
      required: true,
      message: t('please-select-gender'),
      trigger: 'blur',
    },
  ],
  cin: cinRule.value,
  uid: [
    {
      required: true,
      message: t('please-input-code'),
      trigger: 'blur',
    },
  ],
  birth_date: [
    {
      required: true,
      message: t('please-select-birth-date'),
      trigger: 'blur',
    },
  ],
  place_of_birth: [
    {
      required: isQFS,
      message: t('please-input-birth-place'),
      trigger: 'blur',
    },
  ],
  family_status: [
    {
      required: true,
      message: t('please-select-family-status'),
      trigger: 'blur',
    },
  ],
  nbr_children: [
    {
      required: true,
      message: t('please-input-nbr-children'),
      trigger: 'blur',
    },
  ],
  nbr_wives: [
    {
      required: isQFS,
      message: t('please-input-nbr-wives'),
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
  departure_id: [
    {
      required: true,
      message: t('please-select-departure'),
      trigger: 'blur',
    },
  ],
  bank_statement: [
    {
      pattern: isQFS ? /^[a-zA-Z0-9]{24}$/ : /^[0-9]{24}/g,
      message: t('bank-statement-invalid'),
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
}))

defineExpose({
  formRef,
  form,
})
</script>
