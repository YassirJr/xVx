export default {
  namespaced: true,
  state: {
    devices: [],
  },
  getters: {
    devices: (state) => state.devices,
  },
  mutations: {
    SET_DEVICES(state, value) {
      state.devices = value
    },
  },
  actions: {
    fetchDevices({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('device', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_DEVICES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newDevice(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('device', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateDevice(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`device/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeDevice(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`device/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    syncEmployees(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post(`device-sync-employees/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
