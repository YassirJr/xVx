<template>
  <el-dialog
    :title="$t('download-print-docs')"
    :model-value="$dialog.visible('print_download_docs')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="5vh"
    width="75%"
    @close="$dialog.close('print_download_docs')"
    @closed="$emit('closed', +new Date())"
  >
    <div v-loading="loading">
      <template v-if="labels.length">
        <div :class="`grid grid-cols-${labels.length > 3 ? 3 : labels.length} gap-4 m-auto`">
          <div
            v-for="(label, i) in labels"
            :key="i"
            class="col-span-1 text-center cursor-pointer"
            @click="onLabelClicked(label.name)"
          >
            <div
              class="h-40 border-2 rounded-xl flex justify-center items-center"
              :class="{ 'border-primary': activeLabel === label.name }"
            >
              <span class="inline-block" :class="{ 'text-primary': activeLabel === label.name }">
                <span>
                  <i class="iconify w-20 h-20" :data-icon="`tabler:${label.icon}`"></i>
                </span>
              </span>
            </div>
            <div class="mt-2" :class="{ 'text-primary': activeLabel === label.name }">
              {{ $t(label.name) }}
            </div>
          </div>
        </div>
        <el-divider />
      </template>
      <template v-else>
        <slot name="custom_labels" />
        <el-divider />
      </template>
      <div>
        <div class="grid grid-cols-1 gap-4">
          <strong>{{ $t('downloading') }} :</strong>
          <el-button class="w-full" type="primary" size="large" :disabled="disabled" @click="handleDownload">
            {{ $t('download-pdf-file') }}
          </el-button>
        </div>
        <template v-if="availablePrinters.length">
          <el-divider class="" />
          <div class="grid grid-cols-3 gap-4">
            <strong class="col-span-3">{{ $t('printing') }} :</strong>
            <el-select v-model="selectedPrinter" class="col-span-2">
              <el-option
                v-for="(printer, i) in availablePrinters"
                :key="i"
                :value="printer.value"
                :label="printer.name"
              ></el-option>
            </el-select>
            <el-button type="primary" :disabled="disabled || !selectedPrinter" @click="handlePrint">
              {{ $t('print') }}
            </el-button>
          </div>
        </template>
      </div>
    </div>
    <template #footer>
      <div class="flex">
        <el-button type="info" @click="$dialog.close('print_download_docs')">
          {{ $t('close') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { downloadDocs } from '@/helpers/docs'
import { printLabel, getAvailablePrinters, setSelectedDevice } from '@/helpers/zibra'
import { loadFont } from '@/assets/fonts/Amiri-Regular'
import { useDialog } from '@/helpers/index'

export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    labels: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: ['closed'],
  data() {
    return {
      loading: true,
      activeLabel: this.labels[0]?.name || null,
      selectedPrinter: null,
      availablePrinters: [],
    }
  },
  watch: {
    selectedPrinter(newVal) {
      this.loading = true
      setSelectedDevice(newVal).finally(() => (this.loading = false))
    },
  },
  mounted() {
    this.setAvailablePrinters()
  },
  methods: {
    async setAvailablePrinters() {
      try {
        const printers = await getAvailablePrinters()

        if (Array.isArray(printers)) {
          this.availablePrinters = printers.map((el) => ({ ...el, label: el.name, value: el.uid }))
          this.selectedPrinter = printers[0].uid
        }

        this.loading = false
      } catch (_) {
        this.loading = false
      }
    },
    handlePrint() {
      printLabel({ data: this.data, docType: this.activeLabel, ...this.options })
    },
    async handleDownload() {
      this.loading = true
      await loadFont()

      downloadDocs({
        data: this.data,
        docType: this.activeLabel,
        ...this.options,
      })
        .then(() => useDialog.close('print_download_docs'))
        .finally(() => (this.loading = false))
    },
    onLabelClicked(label) {
      this.activeLabel = label
    },
  },
}
</script>
