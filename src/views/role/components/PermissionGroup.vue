<template>
  <div class="mb-2">
    <div class="font-semibold py-1 text-sm">{{ $t(group.name) }}</div>
    <div class="flex">
      <el-checkbox
        v-if="group.permissions.length > 1"
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        class="pr-6"
        :label="group.name"
        @change="handleCheck({ all: true })"
      >
        {{ $t('all') }}
      </el-checkbox>
      <el-checkbox-group v-model="permissions">
        <el-checkbox
          v-for="permission in group.permissions"
          :key="permission.id"
          :label="permission.id"
          @change="handleCheck({ all: false })"
        >
          {{ permission?.skip_translate ? permission.label : $t(permission.label) }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  group: {
    type: Object,
    default: () => {},
  },
  selectPerms: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['handleCheck'])

const permissions = ref([])
const checkAll = ref(false)
const isIndeterminate = ref(false)

const groupPermissions = computed(() => {
  return props.group.permissions.map(({ id }) => id)
})

onMounted(() => updateGroupSelectedPerms())

watch(
  () => props.selectPerms,
  () => updateGroupSelectedPerms(),
)

const handleCheck = ({ all }) => {
  isIndeterminate.value =
    permissions.value.length > 0 && permissions.value.length < groupPermissions.value.length
  if (all) permissions.value = checkAll.value ? groupPermissions.value : []
  else checkAll.value = groupPermissions.value.length === permissions.value.length
  emit('handleCheck', { group: groupPermissions.value, perms: permissions.value })
}

const updateGroupSelectedPerms = () => {
  permissions.value = props.selectPerms.filter((perm) => groupPermissions.value.includes(perm))
  checkAll.value = groupPermissions.value.length === permissions.value.length
  isIndeterminate.value =
    permissions.value.length > 0 && permissions.value.length < groupPermissions.value.length
}
</script>
