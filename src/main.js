import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import mix from '@/mixins/mix'
import VxTable from '@/components/VxTable'
import { initSentry } from '@/service/sentry'

import { VXETable, i18n, dayjs } from '@/plugins'
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-notification.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-dialog.css'

// Import tailwindcss
import '@/assets/styles/main.scss'

// Import generated icons
import '@purge-icons/generated'
import { vMaska } from 'maska'

const app = createApp(App)
const pinia = createPinia()

// Init Sentry
initSentry(app, router)

app.mixin(mix)

app.use(store)
app.use(pinia)
app.use(router)

app.use(i18n)
app.use(VXETable)
app.config.globalProperties.$XModal = VXETable.modal
app.config.globalProperties.$XPrint = VXETable.print
app.config.globalProperties.$XSaveFile = VXETable.saveFile
app.config.globalProperties.$XReadFile = VXETable.readFile
app.config.globalProperties.$dayjs = dayjs

app.component(VxTable.name, VxTable)

// Permission directive
app.directive('can', (el, binding, vnode) => {
  const permissions = store.getters['auth/user']?.permissions?.map(({ name }) => name)

  if (!permissions?.includes(binding.value)) {
    vnode.el.hidden = true
    vnode.el.remove()
  }
})

app.directive('maska', vMaska)

app.mount('#app')
