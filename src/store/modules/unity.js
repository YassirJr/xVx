export default {
  namespaced: true,
  state: {
    unities: [],
    measureUnits: [
      { label: 'kg', value: true },
      { label: 'pieces', value: false },
    ],
  },
  getters: {
    unities: (state) => state.unities,
    measureUnits: (state) => state.measureUnits,
  },
  mutations: {
    SET_UNITIES(state, value) {
      state.unities = value
    },
  },
  actions: {
    fetchUnities({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('unity', { params: query })
          .then(({ data }) => {
            if (query) {
              commit('SET_UNITIES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newUnity({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('unity', form)
          .then(() => {
            dispatch('fetchUnities', { list: true })
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateUnity(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`unity/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeUnity(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`unity/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
