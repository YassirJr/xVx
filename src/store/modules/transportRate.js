export default {
  namespaced: true,
  state: {
    transportRates: [],
  },
  getters: {
    transportRates: (state) => state.transportRates,
  },
  mutations: {
    SET_TRANSPORT_RATES(state, value) {
      state.transportRates = value
    },
  },
  actions: {
    fetchTransportRates({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('transport-rate', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_TRANSPORT_RATES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newTransportRate(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('transport-rate', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateTransportRate(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`transport-rate/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeTransportRate(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`transport-rate/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
