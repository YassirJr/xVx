export default {
  namespaced: true,
  state: {
    products: [],
    measureUnits: [
      { label: 'box', value: 'box' },
      { label: 'piece', value: 'piece' },
      { label: 'bunch', value: 'bunch' },
      { label: 'bag', value: 'bag' },
    ],
    destinations: [
      { value: 0, label: 'export' },
      { value: 1, label: 'confection' },
      { value: 2, label: 'local-market' },
    ],
  },
  getters: {
    products: (state) => state.products,
    measureUnits: (state) => state.measureUnits,
    destinations: (state) => state.destinations,
  },
  mutations: {
    SET_PRODUCTS(state, value) {
      state.products = value
    },
  },
  actions: {
    fetchProducts({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('final-product', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              commit('SET_PRODUCTS', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newProduct(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('final-product', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateProduct(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`final-product/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeProduct(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`final-product/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
