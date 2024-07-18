<template>
  <el-dialog
    draggable
    :title="$t('list-of-site-types')"
    :model-value="useDialog.visible('create_edit_site_types')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="useDialog.close('create_edit_site_types')"
  >
    <site-types></site-types>
  </el-dialog>
</template>

<script setup>
import { useDialog } from '@/helpers'
import SiteTypes from '@/views/site/type'
</script>
