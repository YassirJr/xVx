export default {
  namespaced: true,
  state: {
    planning: [],
  },
  getters: {
    planning: (state) => state.planning,
  },
  mutations: {},
  actions: {
    fetchPlanning(_, query) {
      return new Promise((resolve) => {
        axios
          .get('planning-employee', { params: query })
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },
    newPlanning(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('planning-employee', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePlanning(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`planning-employee/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
