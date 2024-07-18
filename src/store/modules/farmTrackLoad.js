export default {
  namespaced: true,
  state: {
    farmTrackLoads: [],
  },
  getters: {
    farmTrackLoads: (state) => state.farmTrackLoads,
  },
  mutations: {
    FARM_TRACK_LOADS(state, value) {
      state.farmTrackLoads = value
    },
  },
  actions: {
    fetchFarmTrackLoads({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('farm-track-load', { params: query })
          .then(({ data }) => {
            if (query) {
              commit('FARM_TRACK_LOADS', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newFarmTrackLoad(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('farm-track-load', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateFarmTrackLoad(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`farm-track-load/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeFarmTrackLoad(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`farm-track-load/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
