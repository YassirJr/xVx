<template>
  <div v-loading="loading" :class="{ 'bg-white p-5 rounded-xl': isSiteTypeRoute }">
    <div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :inline="true"
        label-position="top"
        @submit.prevent="form?.id ? update() : save()"
      >
        <el-form-item prop="type">
          <div class="flex">
            <el-input v-model="form.type" :placeholder="$t('new-type')"></el-input>
            <el-button
              class="ml-3"
              :type="form?.id ? 'warning' : 'primary'"
              :disabled="loading"
              @click="form?.id ? update() : save()"
            >
              {{ $t('save') }}
            </el-button>
            <el-button
              v-if="form?.id"
              class="ml-3"
              plain
              type="info"
              @click="form = Object.assign({}, { type: null })"
            >
              {{ $t('cancel') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="types" border stripe>
      <el-table-column prop="type" :label="$t('type')"></el-table-column>
      <el-table-column prop="created_at" :label="$t('created-at')">
        <template #default="{ row }">
          {{ $dayjs(row.created_at).fromNow() }}
        </template>
      </el-table-column>
      <el-table-column prop="actions" :label="$t('actions')" width="150">
        <template #default="{ row }">
          <el-button plain type="warning" :disabled="loading" @click="form = Object.assign({}, row)">
            <i-el-edit />
          </el-button>
          <el-popconfirm :title="$t('are-you-sure-to-delete-this')" @confirm="remove(row)">
            <template #reference>
              <el-button plain type="danger" :disabled="loading"><i-el-delete /></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useSiteStore } from '@/stores/site'
import { t } from '@/plugins'
import { useRoute } from 'vue-router'

const loading = ref(false)
const typesLoading = ref(false)
const route = useRoute()

const formRef = ref()
const form = ref({
  type: null,
})

const siteStore = useSiteStore()
const types = computed(() => siteStore.types)

const isSiteTypeRoute = computed(() => route.name == 'site-types')

onMounted(() => {
  typesLoading.value = true
  siteStore.fetchTypes({ list: true }).finally(() => (typesLoading.value = false))
})

const rules = computed(() => ({
  type: [
    {
      required: true,
      message: t('please-input-site-type'),
      trigger: 'blur',
    },
  ],
}))

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      siteStore
        .newType(form.value)
        .then(() => {
          form.value = Object.assign({}, { type: null })
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

const update = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      siteStore
        .updateType(form.value)
        .then(() => {
          form.value = Object.assign({}, { type: null })
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

const remove = ({ id }) => {
  loading.value = true

  siteStore.removeType(id).finally(() => {
    loading.value = false
  })
}
</script>
