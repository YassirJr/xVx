export default {
  namespaced: true,
  state: {
    varieties: [],
  },
  getters: {
    varieties: (state) => state.varieties,
  },
  mutations: {
    SET_VARIETIES(state, value) {
      state.varieties = value
    },
  },
  actions: {
    fetchVarieties(_, query) {
      return new Promise((resolve) => {
        axios
          .get('variety', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newVariety({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('variety', form)
          .then(() => {
            dispatch('fetchAllVarieties')
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateVariety(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`variety/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeVariety(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`variety/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    fetchAllVarieties({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('varieties')
          .then(({ data }) => {
            commit('SET_VARIETIES', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
}
