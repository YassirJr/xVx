export default {
  namespaced: true,
  state: {
    seniorities: [],
  },
  getters: {
    seniorities: (state) => state.seniorities,
  },
  mutations: {
    SET_SENIORITIES(state, value) {
      state.seniorities = value
    },
  },
  actions: {
    fetchSeniorities({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('seniority', { params: query })
          .then(({ data }) => {
            if (query) {
              commit('SET_SENIORITIES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newSeniority({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('seniority', form)
          .then(() => {
            dispatch('fetchSeniorities', { list: true })
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateSeniority(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`seniority/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeSeniority(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`seniority/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
