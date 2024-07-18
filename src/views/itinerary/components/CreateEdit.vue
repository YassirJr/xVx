<template>
  <el-dialog
    draggable
    :title="$t(itinerary?.id ? 'update-itinerary' : 'add-new-itinerary')"
    :model-value="useDialog.visible('create_edit_itinerary')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_itinerary')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('departure')" prop="departure_id">
              <el-select-v2
                v-model="form.departure_id"
                class="w-full"
                clearable
                filterable
                :options="departureStore.departures.map((el) => ({ ...el, label: el.label }))"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('arrival')" prop="site_id">
              <el-select-v2
                v-model="form.site_id"
                class="w-full"
                clearable
                filterable
                :options="siteStore.getSites"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item :label="$t('distance')" prop="distance">
              <el-input-number v-model="form.distance" :min="0" class="!w-full" />
            </el-form-item>
          </div>
          <template v-if="itineraryCode">
            <div class="col-span-1 h-12 flex items-center">
              <span class="pr-2">{{ $t('code') }} :</span>
              <span>{{ itineraryCode }}</span>
            </div>
            <div class="col-span-1 h-12 flex items-center">
              <span class="pr-2">{{ $t('label') }} :</span>
              <span>{{ itineraryLabel }}</span>
            </div>
          </template>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="itinerary?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_itinerary')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { t } from '@/plugins'
import { useDialog } from '@/helpers'
import { useItineraryStore } from '@/stores/itinerary'
import { useSiteStore } from '@/stores/site'
import { useDepartureStore } from '@/stores/departure'

const props = defineProps({
  itinerary: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const formRef = ref(null)
const form = ref({
  site_id: null,
  departure_id: null,
  distance: null,
})

const itineraryStore = useItineraryStore()
const departureStore = useDepartureStore()
const siteStore = useSiteStore()

const rules = reactive({
  site_id: [
    {
      required: true,
      message: t('please-select-site'),
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
  distance: [
    {
      required: true,
      message: t('please-input-distance'),
      trigger: 'blur',
    },
  ],
})

const itineraryCode = computed(() => {
  const { site_id, departure_id } = form.value

  return site_id && departure_id ? `${departure_id}-${site_id}` : null
})

const itineraryLabel = computed(() => {
  const { site_id, departure_id } = form.value

  return site_id && departure_id
    ? `${departureStore.departures.find(({ id }) => id == departure_id)?.label}-${
        siteStore.sites.find(({ id }) => id == site_id)?.name
      }`
    : null
})

watch(
  () => props.itinerary,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign({}, newVal)
    } else {
      form.value = {
        site_id: null,
        departure_id: null,
        distance: null,
      }
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      if (form.value?.id) {
        itineraryStore
          .updateItinerary(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        itineraryStore
          .newItinerary(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_itinerary')
  emit('reload')
  loading.value = false
  form.value = {
    site_id: null,
    departure_id: null,
    distance: null,
  }
}
</script>
