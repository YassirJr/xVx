export default {
  namespaced: true,
  state: {
    stades: [],
  },
  getters: {
    stades: (state) => state.stades,
  },
  mutations: {
    SET_STADES(state, value) {
      state.stades = value
    },
  },
  actions: {
    fetchStades(_, query) {
      return new Promise((resolve) => {
        axios
          .get('stade', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newStade({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('stade', form)
          .then(() => {
            dispatch('fetchAllStades')
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateStade(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`stade/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeStade(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`stade/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    fetchAllStades({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('stades')
          .then(({ data }) => {
            commit('SET_STADES', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
}
