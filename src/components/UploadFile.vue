<template>
  <el-button
    v-if="showUploadButton && isUploadedFile"
    type="success"
    plain
    class="!px-4 !w-full !m-0"
    @click="handleUpload"
  >
    <i-el-upload-filled />
    <div class="ml-2">{{ $t('select-file') }}</div>
  </el-button>

  <el-popconfirm
    v-if="showUploadButton && !isUploadedFile"
    :title="$t('are-you-sure-to-delete-this')"
    @confirm="emits('on-file-deleted')"
  >
    <template #reference>
      <el-button type="danger" plain class="!px-4 !w-full">
        <i-el-delete />
        <div class="ml-2">{{ $t('delete-file') }}</div>
      </el-button>
    </template>
  </el-popconfirm>

  <el-upload
    ref="uploadFile"
    :key="uploadKey"
    class="el-upload [&>*]:max-w-[200px] [&>*]:!m-0"
    :show-file-list="true"
    :accept="acceptedFiles"
    :on-change="onUploadChange"
    :auto-upload="false"
    :on-remove="handleRemove"
    :limit="1"
  ></el-upload>
</template>

<script setup>
import { t } from '@/plugins'
import Compressor from 'compressorjs'
import { ElNotification } from 'element-plus'
import { ref, watch } from 'vue'

const props = defineProps({
  maxSize: {
    type: Number,
    default: 2,
  },
  imgOptions: {
    type: Object,
    default: () => {},
  },
  isUploadedFile: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['reload', 'on-file-uploaded', 'on-file-deleted'])

const uploadFile = ref(null)
const showUploadButton = ref(true)
const uploadKey = ref(0)
const acceptedImgFiles = ['.png', '.jpg', '.jpeg', '.webp']
const acceptedFiles = [...acceptedImgFiles, '.pdf', '.xlsx', '.xls', '.txt'].toString()

watch(
  () => props.isUploadedFile,
  () => {
    handleRemove()
  },
)

const onUploadChange = (file) => {
  const extension = file.name.split('.').pop()

  if (acceptedFiles.includes(`.${extension}`)) {
    if (file.size / 1024 / 1024 > props.maxSize) {
      const msg = `${t('file-size-can-not-exceed')} ${props.maxSize}MB`

      displayError(msg)
    } else {
      const isImage = acceptedImgFiles.includes(`.${extension}`)

      if (isImage) {
        new Compressor(file.raw, {
          ...props.imgOptions,
          success: (result) => {
            showUploadButton.value = false
            emits('on-file-uploaded', result)
          },
          error: () => displayError(t('error')),
        })
      } else {
        try {
          const result = new File([file.raw], file.raw.name, { type: file.raw.type })
          showUploadButton.value = false
          emits('on-file-uploaded', result)
        } catch (error) {
          displayError(t('error'))
        }
      }
    }
  } else {
    displayError(t('file-type-not-allowed'))
  }
}

const handleRemove = () => {
  uploadFile.value?.clearFiles()
  uploadKey.value++
  showUploadButton.value = true
  emits('on-file-uploaded', null)
}

const displayError = (message) => {
  uploadFile.value?.clearFiles()
  ElNotification.error({
    title: t('error'),
    message,
    position: 'bottom-right',
    showClose: true,
    duration: 3000,
  })
}

const handleUpload = () => uploadFile.value.$el.querySelector('input[type=file]').click()

const objToFormData = (obj) => {
  const formData = new FormData()

  for (const key in obj) formData.append(key, obj[key])

  return formData
}

defineExpose({ objToFormData })
</script>
