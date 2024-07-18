import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    login(credentials) {
      return new Promise((resolve, reject) => {
        axios
          .post('login', credentials)
          .then(({ data }) => {
            Cookies.set('token', data.token)
            resolve()
          })
          .catch(() => reject())
      })
    },
    initUser() {
      return new Promise((resolve) => {
        if (this.user) return resolve(this.user)

        const loader = ElLoading.service({ lock: true })
        let token = Cookies.get('token')
        this.user = null

        if (token) {
          axios
            .get('init')
            .then(({ data }) => {
              this.user = data
              resolve(data)
              this.closeLoader(loader)
            })
            .catch(() => {
              resolve(null)
              this.closeLoader(loader)
            })
        } else {
          Cookies.remove('token')
          resolve(null)
          this.closeLoader(loader)
        }
      })
    },
    logout() {
      ElLoading.service({ lock: true })

      return axios.post('logout').finally(() => {
        Cookies.remove('token')
        window.location.href = '/'
      })
    },
    closeLoader(loader) {
      const timeout = setTimeout(() => {
        loader.close()
        clearTimeout(timeout)
      }, 100)
    },
  },
})
