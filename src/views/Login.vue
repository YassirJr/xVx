<template>
  <div
    v-loading="loading"
    class="flex justify-center items-center min-h-screen bg-slate-100 bg-[url('@/assets/images/login-background.webp')] bg-center bg-cover bg-no-repeat"
  >
    <div class="grid grid-cols-1 gap-5 w-11/12 md:w-3/5 xl:w-2/5 p-5 rounded-xl bg-white">
      <div class="col-span-1">
        <div class="mb-10">
          <img class="h-36 aspect-auto m-auto" src="@/assets/images/login-logo.svg" alt="" srcset="" />
        </div>
        <el-form ref="form" label-position="top" :model="form" @keypress.enter="loginHandler">
          <el-form-item prop="username" :label="$t('username')" :rules="formRules.username">
            <el-input v-model="form.username" :disabled="loading">
              <template #prefix>
                <i-el-message />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" :label="$t('password')" :rules="formRules.password">
            <el-input v-model="form.password" type="password" show-password :disabled="loading">
              <template #prefix>
                <i-el-lock />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <div class="w-full">
              <div v-if="showError" class="mb-2">
                <el-alert
                  :title="$t('username-or-password-is-incorrect')"
                  type="error"
                  show-icon
                  :closable="false"
                />
              </div>
              <div class="mt-2">
                <el-button
                  type="primary"
                  :disabled="loading"
                  :loading="loading"
                  @click.prevent="loginHandler"
                >
                  <i-el-right v-if="!loading" class="mr-2" />
                  {{ $t('login') }}
                </el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      form: { username: null, password: null },
      loading: false,
      showError: false,
      formRules: {
        username: [
          {
            required: true,
            message: this.$t('please-input-your-username'),
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: this.$t('please-input-your-password'),
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    ...mapActions('auth', ['login']),

    loginHandler() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.showError = false

          this.login(this.form)
            .then(() => {
              this.$router.push({ name: 'home' })
            })
            .catch(() => {
              this.loading = false
              this.showError = true
            })
            .finally(() => {
              this.form.password = null
            })
        } else return
      })
    },
  },
}
</script>
