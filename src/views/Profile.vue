<template>
  <div class="h-full">
    <div class="grid grid-cols-5 gap-x-5">
      <div class="col-span-1 rounded-2xl bg-white h-60 flex flex-col items-center justify-center">
        <div class="w-40 h-40 flex items-center justify-center">
          <avatar class="scale-[4]" />
        </div>
        <div class="text-center capitalize pt-2">{{ user.username }}</div>
      </div>
      <div class="col-span-4">
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <div class="bg-white p-5 rounded-2xl">
            <h3 class="mb-4 text-2xl font-bold uppercase">{{ $t('change-password') }}</h3>
            <div class="flex items-center">
              <div class="flex-1">
                <el-form-item :label="$t('current-password')" prop="current_password">
                  <el-input
                    v-model="form.current_password"
                    type="password"
                    show-password
                    class="w-full outline-none"
                  ></el-input>
                </el-form-item>
                <el-form-item :label="$t('new-password')" prop="password">
                  <el-input
                    v-model="form.password"
                    type="password"
                    show-password
                    class="w-full outline-none"
                  ></el-input>
                </el-form-item>
                <el-form-item :label="$t('confirm-new-password')" prop="password_confirmation">
                  <div class="flex items-center rounded w-full relative">
                    <el-input
                      v-model="form.password_confirmation"
                      type="password"
                      show-password
                      class="w-full outline-none"
                    ></el-input>
                  </div>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="flex justify-end my-4 pr-5">
            <el-button
              plain
              type="warning"
              :loading="loading"
              :disabled="loading || edit_password"
              @click="save()"
            >
              {{ $t('update-password') }}
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import Avatar from '@/components/Avatar.vue'
import { mapActions, mapGetters } from 'vuex'
import { ElNotification } from 'element-plus'

export default {
  components: {
    Avatar,
  },
  data() {
    return {
      edit_password: false,
      loading: false,
      form: {
        current_password: null,
        password: null,
        password_confirmation: null,
      },
      rules: {
        current_password: [
          {
            required: true,
            message: this.$t('please-input-current-password'),
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: this.$t('please-input-new-password'),
            trigger: 'blur',
          },
          { min: 6, trigger: 'blur', message: this.$t('the-password-must-be-at-least-6-characters') },
        ],
        password_confirmation: [
          {
            required: true,
            message: this.$t('please-confirm-new-password'),
            trigger: 'blur',
          },
          {
            validator: (_, value) => value === this.form.password,
            message: this.$t('the-two-password-not-matching'),
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
  },
  methods: {
    ...mapActions('profile', ['changePassword']),

    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.changePassword(this.form).catch(({ status }) => {
            if (status === 401) {
              this.form.password_confirmation = null
              ElNotification.error({
                title: this.$t('error'),
                message: this.$t('the-current-or-new-password-entered-is-invalid'),
                position: 'bottom-right',
                showClose: true,
                duration: 3000,
              })
            }
          })
        }
      })
    },
  },
}
</script>
