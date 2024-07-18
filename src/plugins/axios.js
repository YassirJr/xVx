import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'
import { ElNotification } from 'element-plus'
import i18n from './i18n'
import dayjs from './dayjs'

window.axios = axios.create({
  baseURL: import.meta.env.VITE_APP_API,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-lang': i18n.global.locale,
    'X-tz': dayjs.tz.guess(),
  },
})

window.axios.interceptors.request.use((config) => {
  const token = Cookies.get('token')

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  config.paramsSerializer = {
    serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  }

  return Promise.resolve(config)
})

let hasNotify = false

// Response interceptor
window.axios.interceptors.response.use(
  (request) => request,
  (error) => {
    const { status, data, config } = error.response

    if (status == 500) {
      if (!hasNotify) {
        hasNotify = true
        const isDelete = config.method == 'delete'
        const message = isDelete
          ? i18n.global.t('this-item-is-being-used-in-another-page-and-cannot-be-deleted')
          : i18n.global.t('something-went-wrong')
        const type = isDelete ? 'warning' : 'error'

        ElNotification({
          title: i18n.global.t('error'),
          message,
          type,
          position: 'bottom-right',
          showClose: true,
          duration: 5000,
          onClose: () => (hasNotify = false),
        })
      }
    }

    if (status === 401 && window.location.pathname !== '/login') {
      Cookies.remove('token')
      window.location.href = '/'
    }

    if (status === 422 && data?.errors) {
      const errors = Object.keys(data.errors)
      if (errors?.length) {
        let message = ''

        errors.forEach((err) => {
          message = `${message}● ${data.errors[err][0]}</br>`
        })

        if (message && message.trim() != '') {
          ElNotification.error({
            title: i18n.global.t('error'),
            message: message,
            showClose: true,
            dangerouslyUseHTMLString: true,
            duration: 5000,
            position: 'bottom-right',
          })
        }
      }
    }

    return Promise.reject(error)
  },
)

export default window.axios
