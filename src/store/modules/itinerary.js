export default {
  namespaced: true,
  state: {
    itineraries: [],
  },
  getters: {
    itineraries: (state) => state.itineraries,
  },
  mutations: {
    SET_ITINERARIES(state, value) {
      state.itineraries = value
    },
  },
  actions: {
    fetchItineraries({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('itinerary', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_ITINERARIES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newItinerary(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('itinerary', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateItinerary(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`itinerary/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeItinerary(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`itinerary/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
