<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table ref="table" :ajax="ajax" :columns="columns">
      <template #toolbar>
        <el-button
          plain
          type="primary"
          :loading="loading"
          :disabled="loading"
          @click="useDialog.open('create_withholding_scales')"
        >
          <i-el-plus class="mr-2" />
          {{ $t('add') }}
        </el-button>
      </template>
    </vx-table>
  </div>
  <create @reload="table.refresh()"></create>
</template>

<script setup>
import create from './components/Create'
import { computed, ref } from 'vue'
import { t } from '@/plugins'
import { useQuery, useDialog } from '@/helpers'
import { useWithholdingScaleStore } from '@/stores/withholdingScale'

const table = ref(null)
const loading = ref(false)

const withholdingScaleStore = useWithholdingScaleStore()

const ajax = computed(() => ({
  query: (params) => {
    const query = useQuery(params)

    return new Promise((resolve) => {
      withholdingScaleStore.fetch(query).then(({ data, meta }) => {
        resolve({
          page: { total: meta.total },
          result: data,
        })
      })
    })
  },
}))

const columns = computed(() => {
  const fields = [
    { field: 'gross_salary', title: t('gross-salary') },
    { field: 'trimf', title: t('trimf') },
  ]

  return fields.concat(
    Array.from({ length: 5 }, (_, i) => i + 1)
      .map((number) => [
        { field: `part_${number}`, title: t('part-sn', { suffix: number }) },
        { field: `part_${number}_5`, title: t('part-sn', { suffix: `${number}.5` }) },
      ])
      .flat()
      .slice(0, -1),
  )
})
</script>
