export default {
  namespaced: true,
  state: {
    reasons: [],
  },
  getters: {
    reasons: (state) => state.reasons,
  },
  mutations: {
    SET_REASONS(state, value) {
      state.reasons = value
    },
  },
  actions: {
    fetchPointingReasons() {
      return new Promise((resolve) => {
        axios
          .get('pointing-reason')
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },
    newPointingReason(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('pointing-reason', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePointingReason(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`pointing-reason/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePointingReason(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`pointing-reason/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchAllReasons({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('pointing-reasons')
          .then(({ data }) => {
            commit('SET_REASONS', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
}
