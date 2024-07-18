export default {
  namespaced: true,
  state: {
    departures: [],
  },
  getters: {
    departures: (state) => state.departures,
  },
  mutations: {
    SET_DEPARTURES(state, value) {
      state.departures = value
    },
  },
  actions: {
    fetchDepartures(_, query) {
      return new Promise((resolve) => {
        axios
          .get('departure', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newDeparture({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('departure', form)
          .then(() => {
            dispatch('fetchAllDepartures')
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateDeparture(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`departure/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeDeparture(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`departure/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    fetchAllDepartures({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('departures')
          .then(({ data }) => {
            commit('SET_DEPARTURES', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
}
