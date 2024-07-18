export default {
  namespaced: true,
  state: {
    dayIndexes: [],
  },
  getters: {
    dayIndexes: (state) => state.dayIndexes,
  },
  mutations: {
    SET_DAY_INDEXES(state, value) {
      state.dayIndexes = value
    },
  },
  actions: {
    fetchDayIndexes({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('day-index', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_DAY_INDEXES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newDayIndex(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('day-index', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateDayIndex(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`day-index/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeDayIndex(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`day-index/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
