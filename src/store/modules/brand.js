export default {
  namespaced: true,
  state: {
    brands: [],
  },
  getters: {
    brands: (state) => state.brands,
  },
  mutations: {
    SET_BRANDS(state, value) {
      state.brands = value
    },
  },
  actions: {
    fetchBrands({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('brand', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_BRANDS', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newBrand(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('brand', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateBrand(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`brand/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeBrand(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`brand/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
