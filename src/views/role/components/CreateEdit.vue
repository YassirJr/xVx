<template>
  <el-dialog
    draggable
    :title="$t(role?.id ? 'edit-role' : 'create-new-role')"
    :model-value="$dialog.visible('create_edit_role')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    @close="$dialog.close('create_edit_role')"
  >
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-position="top" @keypress.enter="save()">
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-2">
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <div class="mb-3">{{ $t('permissions') }}</div>
            <div class="flex justify-end pr-8 py-2">
              <el-button class="mr-0" @click="toggleAllPermissions()">
                {{ checkAllPermissions ? $t('uncheck-all') : $t('check-all') }}
              </el-button>
            </div>
            <el-form-item prop="permissions">
              <div class="w-full">
                <vxe-list :height="256" :data="groupedPermissions">
                  <template #default="{ items }">
                    <permission-group
                      v-for="(item, index) in items"
                      :key="index"
                      :group="item"
                      :select-perms="form.permissions"
                      @handle-check="handleCheck"
                    />
                  </template>
                </vxe-list>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="role?.id ? 'warning' : 'primary'"
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
          @click="$dialog.close('create_edit_role')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PermissionGroup from './PermissionGroup.vue'

export default {
  components: {
    PermissionGroup,
  },
  props: {
    role: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['reload'],
  data() {
    return {
      loading: false,
      checkAllPermissions: false,
      form: {
        name: null,
        permissions: [],
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('please-input-label'),
            trigger: 'blur',
          },
        ],
        permissions: [
          {
            required: true,
            message: this.$t('please-select-one-permission-at-least'),
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters('employeeTypes', ['types']),
    ...mapGetters('permission', ['permissions']),

    groupedPermissions() {
      let perms = this.permissions.reduce((prevVal, currVal) => {
        let name = currVal.name.slice(0, currVal.name.lastIndexOf('-'))
        prevVal[name] = prevVal[name] ?? {
          name,
          permissions: [],
        }
        prevVal[name].permissions.push({
          id: currVal.id,
          label: currVal.name.slice(currVal.name.lastIndexOf('-') + 1),
        })
        return prevVal
      }, [])

      let keys = Object.keys(perms)
      let permissions = keys.map((key) => perms[key])
      let typePermission = permissions.find(({ name }) => name === 'permission-type')

      if (typePermission?.permissions?.length) {
        typePermission.permissions = typePermission.permissions.map((el) => {
          const label = this.types.find((type) => type.slug == el.label.replaceAll('_', '-'))?.name
          return { ...el, label: label ?? el.label, skip_translate: true }
        })
      }

      permissions = permissions.filter(({ name }) => name !== 'permission-type')
      permissions.unshift(typePermission)

      return permissions
    },
  },
  watch: {
    role(newVal) {
      if (newVal?.id) {
        this.form = Object.assign({}, { ...newVal, permissions: newVal.permissions.map(({ id }) => id) })
      } else {
        this.form = {
          name: null,
          permissions: [],
        }
      }
    },
  },
  created() {
    this.fetchEmployeeTypes({ list: true })
    this.fetchPermissions({ list: true })
  },
  methods: {
    ...mapActions('role', ['newRole', 'updateRole']),
    ...mapActions('permission', ['fetchPermissions']),
    ...mapActions('employeeTypes', ['fetchEmployeeTypes']),

    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.form?.id) {
            this.updateRole(this.form)
              .then(() => this.reset())
              .finally(() => (this.loading = false))
          } else {
            this.newRole(this.form)
              .then(() => this.reset())
              .finally(() => (this.loading = false))
          }
        }
      })
    },
    reset() {
      this.$dialog.close('create_edit_role')
      this.loading = false
      this.form = {
        label: null,
        permissions: [],
      }
      this.$emit('reload')
    },
    handleCheck({ group, perms }) {
      this.form.permissions = this.form.permissions.filter((perm) => !group.includes(perm))
      this.form.permissions = [...this.form.permissions, ...perms]
    },
    toggleAllPermissions() {
      this.loading = true
      this.checkAllPermissions = !this.checkAllPermissions
      this.form.permissions = this.checkAllPermissions ? this.permissions.map(({ id }) => id) : []
      this.$nextTick(() => {
        this.loading = false
      })
    },
  },
}
</script>
