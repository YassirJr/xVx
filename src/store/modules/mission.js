export default {
  namespaced: true,
  state: {
    missions: [],
  },
  getters: {
    missions: (state) => state.missions,
  },
  mutations: {
    SET_MISSIONS(state, value) {
      state.missions = value
    },
  },
  actions: {
    fetchMissions(_, query) {
      return new Promise((resolve) => {
        axios
          .get('mission', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newMission({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('mission', form)
          .then(() => {
            dispatch('fetchAllMissions')
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateMission(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`mission/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeMission(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`mission/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    fetchAllMissions({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('missions')
          .then(({ data }) => {
            commit('SET_MISSIONS', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
}
