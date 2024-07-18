export default {
  namespaced: true,
  state: {
    transporters: [],
  },
  getters: {
    transporters: (state) => state.transporters,
  },
  mutations: {
    SET_TRANSPORTERS(state, value) {
      state.transporters = value
    },
  },
  actions: {
    fetchTransporters(_, query) {
      return new Promise((resolve) => {
        axios
          .get('transporter', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newTransporter({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('transporter', form)
          .then(() => {
            resolve()
            dispatch('fetchAllTransporters')
          })
          .catch(() => reject())
      })
    },
    updateTransporter(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`transporter/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeTransporter(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`transporter/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    fetchAllTransporters({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('transporters')
          .then(({ data }) => {
            commit('SET_TRANSPORTERS', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
}
