export default {
  namespaced: true,
  state: {
    payClosures: [],
  },
  getters: {
    payClosures: (state) => state.payClosures,
    period: (state) => state.period,
  },
  mutations: {
    SET_PAY_CLOSURES(state, value) {
      state.payClosures = value
    },
  },
  actions: {
    fetchPayClosures({ commit }, query) {
      commit('SET_PAY_CLOSURES', [])

      return new Promise((resolve) => {
        axios
          .get('pay-closure', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              commit('SET_PAY_CLOSURES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPayClosure(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('pay-closure', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePayClosure(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`pay-closure/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    toggleClosureStatus(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`pay-closure/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
