<template>
  <el-dialog
    draggable
    :title="$t(reception?.id ? 'update-reception' : 'add-new-reception')"
    :model-value="useDialog.visible('create_edit_reception')"
    top="5vh"
    width="95%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_reception')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="grid grid-cols-8 gap-x-5">
          <div class="col-span-2">
            <el-form-item :label="$t('reception-code')" prop="code">
              <el-input-number
                v-model="form.code"
                class="!w-full"
                :controls="false"
                :disabled="Boolean(reception?.id)"
              />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('added-at')" prop="added_at">
              <el-date-picker v-model="form.added_at" class="!w-full" :format="DATE_FORMAT"></el-date-picker>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('depart-hour')" prop="depart_hour">
              <el-time-picker v-model="form.depart_hour" class="!w-full" format="HH:mm"></el-time-picker>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('arrival-hour')" prop="arrival_hour">
              <el-time-picker v-model="form.arrival_hour" class="!w-full" format="HH:mm"></el-time-picker>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('station')" prop="site_id">
              <el-select-v2
                v-model="form.site_id"
                filterable
                :reserve-keyword="false"
                :options="siteStore.getStationSites.map((el) => ({ ...el, label: el.name }))"
                value-key="id"
                class="w-full"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('vehicle')" prop="vehicle_id">
              <el-select-v2
                v-model="form.vehicle_id"
                filterable
                :reserve-keyword="false"
                :options="getMerchandiseVehicles"
                value-key="id"
                class="w-full"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('vehicle-type')">
              <label>{{ getVehicleType }}</label>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('transporter')">
              <label>{{ getTransporter }}</label>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('import')">
              <upload-file
                :is-uploaded-file="!form.media_uuid"
                @on-file-uploaded="onFileUploaded"
                @on-file-deleted="onFileDeleted"
              ></upload-file>
            </el-form-item>
          </div>
        </div>
        <div>
          <el-divider>{{ $t('internal') }}</el-divider>
          <div class="flex justify-end items-center">
            <div>
              <el-button type="primary" plain @click="addNewRow(receptionStore.type.internal)">
                <i-el-plus class="mr-2" />
                {{ $t('add-internal') }}
              </el-button>
            </div>
          </div>
          <reception-child
            ref="internalTable"
            :key="reception?.id"
            :type="receptionStore.type.internal"
            :data="internalData"
            @update="updateChildValidation"
          ></reception-child>
        </div>
        <div>
          <el-divider>{{ $t('external') }}</el-divider>
          <div class="flex justify-end items-center">
            <div>
              <el-button type="primary" plain @click="addNewRow(receptionStore.type.external)">
                <i-el-plus class="mr-2" />
                {{ $t('add-external') }}
              </el-button>
            </div>
          </div>
          <reception-child
            ref="externalTable"
            :key="reception?.id"
            :type="receptionStore.type.external"
            :data="externalData"
            @update="updateChildValidation"
          ></reception-child>
        </div>
        <el-divider class="!mb-0" />
        <div>
          <el-affix position="bottom" :offset="10">
            <div class="bg-gray-100 p-2 text-gray-500 border border-gray-200">
              <div class="flex justify-center items-center text-base">
                <div class="px-6 py-2">
                  <span class="inline-block mr-2">{{ $t('internal-net-weight') }}:</span>
                  <strong class="inline-block">{{ internal.total.toFixed(2) }}</strong>
                </div>
                <div class="px-6 py-2">
                  <span class="inline-block mr-2">{{ $t('external-net-weight') }}:</span>
                  <strong class="inline-block">{{ external.total.toFixed(2) }}</strong>
                </div>
                <div class="px-6 py-2">
                  <span class="inline-block mr-2">{{ $t('difference') }}:</span>
                  <strong class="inline-block">
                    {{ (internal.total - external.total).toFixed(2) }}
                  </strong>
                </div>
              </div>
            </div>
          </el-affix>

          <el-divider class="!my-0" />
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="reception?.id ? 'warning' : 'primary'"
          :loading="loading"
          :disabled="isSaveBtnDisabled"
          @click="save()"
        >
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="useDialog.close('create_edit_reception')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { DATE_FORMAT } from '@/constants'
import { dayjs, t } from '@/plugins'
import { computed, reactive, ref, watch } from 'vue'
import { useDialog } from '@/helpers'
import { useSiteStore } from '@/stores/site'
import { useVehicleStore } from '@/stores/vehicle'
import ReceptionChild from './ReceptionChild'
import UploadFile from '@/components/UploadFile'
import { useReceptionStore } from '@/stores/reception'
import { useTransporterStore } from '@/stores/transporter'
import { useVehicleTypeStore } from '@/stores/vehicleTypes'

const initForm = {
  code: null,
  added_at: dayjs().toString(),
  depart_hour: null,
  arrival_hour: null,
  site_id: null,
  vehicle_id: null,
  pallets: [],
}
const initChildValidation = { is_valid: true, total: 0 }

const props = defineProps({
  reception: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const formRef = ref(null)
const externalTable = ref(null)
const internalTable = ref(null)
const internal = ref(initChildValidation)
const external = ref(initChildValidation)
const form = ref(initForm)

const siteStore = useSiteStore()
const vehicleStore = useVehicleStore()
const receptionStore = useReceptionStore()
const transporterStore = useTransporterStore()
const vehicleTypeStore = useVehicleTypeStore()

const rules = reactive({
  code: [
    {
      required: true,
      message: t('please-input-code'),
      trigger: 'blur',
    },
  ],
  added_at: [
    {
      required: true,
      message: t('please-select-date'),
      trigger: 'blur',
    },
  ],
  site_id: [
    {
      required: true,
      message: t('please-select-station'),
      trigger: 'blur',
    },
  ],
  depart_hour: [
    {
      required: true,
      message: t('please-select-depart-hour'),
      trigger: 'blur',
    },
  ],
  arrival_hour: [
    {
      required: true,
      message: t('please-select-arrival-hour'),
      trigger: 'blur',
    },
  ],
  vehicle_id: [
    {
      required: true,
      message: t('please-select-vehicle'),
      trigger: 'blur',
    },
  ],
})

watch(
  () => props.reception,
  (newVal) => {
    internal.value = Object.assign({}, initChildValidation)
    external.value = Object.assign({}, initChildValidation)

    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = Object.assign({}, initForm)
      form.value.code = receptionStore.latestReception.code
    }
  },
  { immediate: true },
)

const getMerchandiseVehicles = computed(() => {
  const merchandiseTypeIds = vehicleTypeStore.vehicleTypes
    .filter(({ group }) => group == 1)
    .map(({ id }) => id)

  return vehicleStore.vehicles
    .filter(({ type_id }) => merchandiseTypeIds.includes(type_id))
    .map((el) => ({ ...el, label: el.registration_nbr }))
})

const internalData = computed(() => {
  return form.value.pallets.filter(({ type }) => type == receptionStore.type.internal)
})

const externalData = computed(() => {
  return form.value.pallets.filter(({ type }) => type == receptionStore.type.external)
})

const vehicle = computed(() => vehicleStore.vehicles.find(({ id }) => id == form.value.vehicle_id))
const getVehicleType = computed(() => {
  return vehicleTypeStore.vehicleTypes.find(({ id }) => id == vehicle.value?.type_id)?.name ?? ''
})
const getTransporter = computed(() => {
  return transporterStore.transporters.find(({ id }) => id == vehicle.value?.transporter_id)?.name ?? ''
})

const isSaveBtnDisabled = computed(() => {
  return loading.value || !internal.value.is_valid || !external.value.is_valid
})

const addNewRow = (type) => {
  type == receptionStore.type.external
    ? externalTable.value.addDuplicateRow()
    : internalTable.value.addDuplicateRow()
}

const updateChildValidation = ({ type, is_valid, total }) => {
  const types = receptionStore.type

  if (type == types.internal) {
    internal.value = Object.assign({}, { is_valid, total })
  }

  if (type == types.external) {
    external.value = Object.assign({}, { is_valid, total })
  }
}

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      const { added_at, depart_hour, arrival_hour } = form.value
      const data = {
        ...form.value,
        added_at: dayjs(added_at).format(),
        depart_hour: dayjs(depart_hour).format(),
        arrival_hour: dayjs(arrival_hour).format(),
        pallets: [...internalTable.value.getData(), ...externalTable.value.getData()],
      }

      if (form.value?.id) {
        receptionStore
          .updateReception(data)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        receptionStore
          .newReception(data)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_reception')

  form.value = Object.assign({}, initForm)

  internalTable.value.reset()
  externalTable.value.reset()

  emit('reload')
}

const onFileUploaded = (file) => (form.value.file = file)

const onFileDeleted = () => delete form.value.media_uuid
</script>
