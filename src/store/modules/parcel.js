export default {
  namespaced: true,
  state: {
    parcels: [],
    latestParcelCode: 1,
  },
  getters: {
    parcels: (state) => state.parcels,
    latestParcelCode: (state) => state.latestParcelCode,
  },
  mutations: {
    SET_PARCELS(state, value) {
      state.parcels = value
    },
    SET_LATEST_PARCEL_CODE(state, value) {
      state.latestParcelCode = value
    },
  },
  actions: {
    fetchParcels({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('parcel', { params: query })
          .then(({ data }) => {
            if (data?.latest_parcel) {
              commit('SET_LATEST_PARCEL_CODE', data.latest_parcel + 1)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newParcel({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('parcel', form)
          .then(() => {
            dispatch('fetchAllParcels')
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateParcel(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`parcel/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeParcel(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`parcel/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    fetchAllParcels({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('parcels')
          .then(({ data }) => {
            commit('SET_PARCELS', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
}
