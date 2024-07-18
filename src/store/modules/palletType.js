export default {
  namespaced: true,
  state: {
    palletTypes: [],
  },
  getters: {
    palletTypes: (state) => state.palletTypes,
  },
  mutations: {
    SET_PALLET_TYPES(state, value) {
      state.palletTypes = value
    },
  },
  actions: {
    fetchPalletTypes({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('pallet-type', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_PALLET_TYPES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPalletType(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('pallet-type', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePalletType(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`pallet-type/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePalletType(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`pallet-type/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
