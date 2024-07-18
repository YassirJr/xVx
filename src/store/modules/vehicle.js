export default {
  namespaced: true,
  state: {
    vehicles: [],
    calcModes: [
      { label: 'per-seat-limited', value: 0 },
      { label: 'per-seat-unlimited', value: 1 },
      { label: 'per-trip-with-min-seats', value: 2 },
      { label: 'per-fixed-trip-rate', value: 3 },
    ],
  },
  getters: {
    vehicles: (state) => state.vehicles,
    getCalcModes: (state) => state.calcModes,
  },
  mutations: {
    SET_VEHICLES(state, value) {
      state.vehicles = value
    },
  },
  actions: {
    fetchVehicles(_, query) {
      return new Promise((resolve) => {
        axios
          .get('vehicle', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newVehicle(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('vehicle', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateVehicle(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`vehicle/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeVehicle(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`vehicle/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    fetchAllVehicles({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('vehicles')
          .then(({ data }) => {
            commit('SET_VEHICLES', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
}
