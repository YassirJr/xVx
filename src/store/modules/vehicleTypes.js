export default {
  namespaced: true,
  state: {
    vehicleTypes: [],
    rates: [],
    vehicleTypeGroups: [
      { value: 0, label: 'staff' },
      { value: 1, label: 'merchandise' },
      { value: 2, label: 'function' },
      { value: 3, label: 'service' },
      { value: 4, label: 'export' },
    ],
  },
  getters: {
    vehicleTypes: (state) => state.vehicleTypes,
    rates: (state) => state.rates,
    getVehicleTypeGroups: (state) => state.vehicleTypeGroups,
    getFilteredGroups: (state) => state.vehicleTypeGroups.filter(({ value }) => [0, 2, 3].includes(value)),
  },
  mutations: {
    SET_VEHICLE_TYPES(state, value) {
      state.vehicleTypes = value
    },
    SET_RATES(state, value) {
      state.rates = value
    },
  },
  actions: {
    fetchVehicleTypes({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('vehicle-type', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_VEHICLE_TYPES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newVehicleType(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('vehicle-type', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateVehicleType(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`vehicle-type/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeVehicleType(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`vehicle-type/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchRates({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('vehicle-type-rate')
          .then(({ data }) => {
            if (query.list) {
              commit('SET_RATES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newRate(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('vehicle-type-rate', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateRate(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`vehicle-type-rate/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeRate(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`vehicle-type-rate/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
