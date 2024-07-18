import { ElLoading } from 'element-plus'
import Cookies from 'js-cookie'

export default {
  namespaced: true,
  state: {
    user: null,
  },
  getters: {
    user: (state) => state.user,
  },
  mutations: {
    SET_USER(state, value) {
      state.user = value
    },
  },
  actions: {
    login(_, credentials) {
      return new Promise((resolve, reject) => {
        axios
          .post('login', credentials)
          .then(({ data }) => {
            Cookies.set('token', data.token)
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },

    initUser({ getters, commit, dispatch }) {
      return new Promise((resolve) => {
        if (getters.user) {
          return resolve(getters.user)
        } else {
          const loader = ElLoading.service({ lock: true })
          let token = Cookies.get('token')
          commit('SET_USER', null)

          if (token) {
            axios
              .get('init')
              .then(({ data }) => {
                commit('SET_USER', data)
                resolve(data)
                dispatch('closeLoader', loader)
              })
              .catch(() => {
                resolve(null)
                dispatch('closeLoader', loader)
              })
          } else {
            Cookies.remove('token')
            resolve(null)
            dispatch('closeLoader', loader)
          }
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
    closeLoader(_, loader) {
      const timeout = setTimeout(() => {
        loader.close()
        clearTimeout(timeout)
      }, 100)
    },
  },
}
