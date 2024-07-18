export default {
  namespaced: true,
  state: {
    packhouseLines: [],
  },
  getters: {
    packhouseLines: (state) => state.packhouseLines,
  },
  mutations: {
    SET_PACKHOUSE_LINES(state, data) {
      state.packhouseLines = data
    },
  },
  actions: {
    fetchPackhouseLines({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('packhouse-line', { params: query })
          .then(({ data }) => {
            if (query?.list) commit('SET_PACKHOUSE_LINES', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    create(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('packhouse-line', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    update(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`packhouse-line/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`packhouse-line/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
