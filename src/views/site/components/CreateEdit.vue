<template>
  <el-dialog
    draggable
    :title="$t(site?.id ? 'edit-site' : 'create-new-site')"
    :model-value="useDialog.visible('create_edit_site')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_site')"
  >
    <div v-loading="loading">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-2">
            <el-form-item :label="$t('code')" prop="code">
              <el-input v-model="form.code" :disabled="form.id && form.code"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-1 relative">
            <el-form-item :label="$t('type')" prop="type_id">
              <el-select v-model="form.type_id" clearable filterable class="w-full">
                <el-option
                  v-for="(type, i) in siteStore.types"
                  :key="i"
                  :label="type.type"
                  :value="type.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="absolute right-0 top-0">
              <el-button type="primary" text size="small" @click="useDialog.open('create_edit_site_types')">
                {{ $t('new-type') }}
              </el-button>
            </div>
          </div>
          <div class="col-span-1 relative">
            <el-form-item :label="$t('group')" prop="group">
              <el-select v-model="form.group" clearable filterable class="w-full">
                <el-option
                  v-for="(group, i) in siteStore.groups"
                  :key="i"
                  :label="$t(group.label)"
                  :value="group.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <template v-if="form.group != siteStore.groups[2].value">
            <div class="col-span-1 relative">
              <el-form-item :label="$t('varieties')" prop="variety_ids">
                <el-select-v2
                  v-model="form.variety_ids"
                  class="w-full"
                  multiple
                  clearable
                  filterable
                  :options="varietyStore.getVarieties"
                  value-key="id"
                ></el-select-v2>
              </el-form-item>
              <div class="absolute right-0 top-0">
                <el-button type="primary" text size="small" @click="useDialog.open('create_edit_variety')">
                  {{ $t('new-variety') }}
                </el-button>
              </div>
            </div>
          </template>
          <div class="col-span-1">
            <el-form-item label="GGN" prop="global_gap_number">
              <el-input-number
                v-model="form.global_gap_number"
                class="!w-full"
                :controls="false"
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item label="GGL/COC" prop="green_gold_license">
              <el-input-number
                v-model="form.green_gold_license"
                class="!w-full"
                :controls="false"
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
          :type="site?.id ? 'warning' : 'primary'"
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
          @click="useDialog.close('create_edit_site')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>

    <new-variety></new-variety>
  </el-dialog>
</template>

<script setup>
import NewVariety from '@/views/variety/components/CreateEdit'
import { ref, reactive, watch, onMounted } from 'vue'
import { useDialog } from '@/helpers/index'
import { t } from '@/plugins'
import { useSiteStore } from '@/stores/site'
import { useVarietyStore } from '@/stores/variety'

const siteStore = useSiteStore()
const varietyStore = useVarietyStore()

onMounted(() => siteStore.fetchTypes({ list: true }))

const initFrom = {
  code: null,
  type_id: null,
  name: null,
  group: null,
  global_gap_number: null,
  green_gold_license: null,
  variety_ids: [],
}

const props = defineProps({
  site: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['reload'])

const loading = ref(false)
const form = ref(initFrom)
const formRef = ref(null)

const rules = reactive({
  name: [
    {
      required: true,
      message: t('please-input-site-name'),
      trigger: 'blur',
    },
  ],
  type_id: [
    {
      required: true,
      message: t('please-select-site-type'),
      trigger: 'change',
    },
  ],
  group: [
    {
      required: true,
      message: t('please-select-group'),
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
  () => props.site,
  (newVal) => {
    if (newVal?.id) {
      form.value = Object.assign(
        {},
        {
          ...newVal,
          global_gap_number: newVal?.global_gap_number ? +newVal.global_gap_number : null,
          green_gold_license: newVal?.green_gold_license ? +newVal.green_gold_license : null,
        },
      )

      if (newVal.group != siteStore.groups[2].value) {
        form.value.variety_ids = newVal.varieties.map(({ id }) => id)
      }
    } else {
      form.value = Object.assign({}, { ...initFrom, code: siteStore.latestSiteCode })
    }
  },
)

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (form.value.group == siteStore.groups[2].value) {
        delete form.value.variety_ids
      }

      loading.value = true
      form.value = { ...form.value }

      if (form.value?.id) {
        siteStore
          .updateSite(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      } else {
        siteStore
          .newSite(form.value)
          .then(() => reset())
          .finally(() => (loading.value = false))
      }
    }
  })
}

const reset = () => {
  useDialog.close('create_edit_site')

  loading.value = false
  form.value = Object.assign({}, initFrom)

  emit('reload')
}
</script>
