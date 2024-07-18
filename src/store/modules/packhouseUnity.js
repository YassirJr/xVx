export default {
  namespaced: true,
  state: {
    packhouseUnities: [],
  },
  getters: {
    packhouseUnities: (state) => state.packhouseUnities,
  },
  mutations: {
    SET_PACKHOUSE_UNITIES(state, value) {
      state.packhouseUnities = value
    },
  },
  actions: {
    fetchPackhouseUnities({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('packhouse-unity')
          .then(({ data }) => {
            if (query.list) {
              commit('SET_PACKHOUSE_UNITIES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPackhouseUnity(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('packhouse-unity', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePackhouseUnity(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`packhouse-unity/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePackhouseUnity(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`packhouse-unity/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
