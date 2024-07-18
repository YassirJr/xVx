<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
    <div class="grid grid-cols-2 gap-x-5">
      <div class="col-span-1">
        <el-form-item prop="name" :label="$t('label')">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item prop="cnss_scheme" :label="$t(isQFS ? 'css-scheme' : 'cnss-scheme')">
          <el-radio-group v-model="form.cnss_scheme" class="!w-full">
            <el-radio-button
              v-for="(item, index) in employeeTypeStore.cnssSchemes"
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
      <div class="col-span-1">
        <el-form-item prop="cnss_affiliation" :label="$t(isQFS ? 'css-affiliation' : 'cnss-affiliation')">
          <el-input-number
            v-model="form.cnss_affiliation"
            class="!w-full"
            :controls="false"
          ></el-input-number>
        </el-form-item>
      </div>
      <div class="col-span-1">
        <el-form-item prop="frequency_pay" :label="$t('frequency-pay')">
          <el-radio-group v-model="form.frequency_pay" class="!w-full">
            <el-radio-button
              v-for="(item, index) in employeeTypeStore.frequenciesPay"
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
    </div>
  </el-form>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { isQFS } from '@/helpers'
import { t } from '@/plugins'

const props = defineProps({
  type: {
    type: Object,
    default: () => {},
  },
})

const formRef = ref(null)
const form = ref({
  name: null,
  cnss_scheme: null,
  cnss_affiliation: null,
  frequency_pay: null,
})
const employeeTypeStore = useEmployeeTypeStore()

const rules = reactive({
  name: [
    {
      required: true,
      message: t('please-input-name'),
      trigger: 'blur',
    },
  ],
  cnss_scheme: [
    {
      required: true,
      message: t(isQFS ? 'please-select-css-scheme' : 'please-select-cnss-scheme'),
      trigger: 'blur',
    },
  ],
  cnss_affiliation: [
    {
      required: true,
      message: t(isQFS ? 'please-input-css-affiliation' : 'please-input-cnss-affiliation'),
      trigger: 'blur',
    },
    {
      type: 'integer',
      message: t(isQFS ? 'css-affiliation-invalid' : 'cnss-affiliation-invalid'),
      trigger: 'blur',
    },
    {
      trigger: 'blur',
      asyncValidator: (rule, value) => {
        return new Promise((resolve, reject) => {
          const validateLength = isQFS ? false : `${value}`.length != 7

          if (isNaN(value) || !value || validateLength) {
            reject(t(isQFS ? 'css-affiliation-invalid' : 'cnss-affiliation-invalid'))
          } else {
            resolve()
          }
        })
      },
    },
  ],
})

const setForm = (data) => {
  if (data?.id) {
    Object.keys(form.value).forEach((key) => {
      form.value[key] = data[key]
    })
  } else {
    form.value = {
      name: null,
      cnss_scheme: null,
      cnss_affiliation: null,
      frequency_pay: null,
    }
  }
}

onMounted(() => setForm(props.type))

watch(
  () => props.type,
  (newVal) => setForm(newVal),
)

defineExpose({
  form,
  formRef,
})
</script>
