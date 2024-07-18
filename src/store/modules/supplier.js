export default {
  namespaced: true,
  state: {
    suppliers: [],
  },
  getters: {
    suppliers: (state) => state.suppliers,
  },
  mutations: {
    SET_SUPPLIER(state, value) {
      state.suppliers = value
    },
  },
  actions: {
    fetchSuppliers({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('supplier', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              commit('SET_SUPPLIER', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newSupplier(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('supplier', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateSupplier(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`supplier/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeSupplier(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`supplier/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
