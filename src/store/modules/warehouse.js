export default {
  namespaced: true,
  state: {
    warehouses: [],
  },
  getters: {
    warehouses: (state) => state.warehouses,
  },
  mutations: {
    SET_WAREHOUSES(state, value) {
      state.warehouses = value
    },
  },
  actions: {
    fetchWarehouses({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('warehouse', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_WAREHOUSES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newWarehouse(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('warehouse', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateWarehouse(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`warehouse/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeWarehouse(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`warehouse/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
