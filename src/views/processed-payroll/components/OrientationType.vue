<template>
  <el-dialog
    :model-value="useDialog.visible('orientation_type')"
    :title="$t('choose-the-orientation-type')"
    width="50%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('orientation_type')"
  >
    <div v-loading="loading" class="flex items-center gap-x-4 m-auto">
      <div
        v-if="!isQFS"
        class="grow text-center cursor-pointer"
        @click="orientation = 'landscape-duplicated'"
      >
        <div
          class="h-44 border-2 rounded-xl flex justify-center items-center"
          :class="{ 'border-primary': orientation === 'landscape-duplicated' }"
        >
          <span
            class="inline-block -rotate-90"
            :class="{ 'text-primary': orientation === 'landscape-duplicated' }"
          >
            <i-tabler-file-text class="w-24 h-24" />
          </span>
        </div>
        <div class="mt-2" :class="{ 'text-primary': orientation === 'landscape-duplicated' }">
          {{ $t('landscape-duplicated') }}
        </div>
      </div>
      <div class="grow text-center cursor-pointer" @click="orientation = 'landscape'">
        <div
          class="h-44 border-2 rounded-xl flex justify-center items-center"
          :class="{ 'border-primary': orientation === 'landscape' }"
        >
          <span class="inline-block -rotate-90" :class="{ 'text-primary': orientation === 'landscape' }">
            <i-tabler-file-text class="w-24 h-24" />
          </span>
        </div>
        <div class="mt-2" :class="{ 'text-primary': orientation === 'landscape' }">{{ $t('landscape') }}</div>
      </div>

      <div class="grow text-center cursor-pointer" @click="orientation = 'portrait'">
        <div
          class="h-44 border-2 rounded-xl flex justify-center items-center"
          :class="{ 'border-primary': orientation === 'portrait' }"
        >
          <span class="inline-block" :class="{ 'text-primary': orientation === 'portrait' }">
            <i-tabler-file-text class="w-24 h-24" />
          </span>
        </div>
        <div class="mt-2" :class="{ 'text-primary': orientation === 'portrait' }">{{ $t('portrait') }}</div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="$emit('downloadPayrollCheck', orientation)">
          {{ $t('download') }}
        </el-button>
        <el-button @click="useDialog.close('orientation_type')">{{ $t('cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDialog, isQFS } from '@/helpers'

defineProps({
  loading: Boolean,
})

defineEmits(['downloadPayrollCheck'])

const orientation = ref('portrait')
</script>
