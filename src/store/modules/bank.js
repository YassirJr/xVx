export default {
  namespaced: true,
  state: {
    banks: [],
  },
  getters: {
    banks: (state) => state.banks,
  },
  mutations: {
    SET_BANKS(state, value) {
      state.banks = value
    },
  },
  actions: {
    fetchBanks({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('bank')
          .then(({ data }) => {
            commit('SET_BANKS', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newBank({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('bank', form)
          .then(() => {
            resolve()
            dispatch('fetchBanks')
          })
          .catch(() => reject())
      })
    },
    updateBank(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`bank/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeBank(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`bank/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
