export default {
  namespaced: true,
  state: {
    productCalibers: [],
  },
  getters: {
    productCalibers: (state) => state.productCalibers,
  },
  mutations: {
    SET_PRODUCT_CALIBERS(state, value) {
      state.productCalibers = value
    },
  },
  actions: {
    fetchProductCalibers({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('product-caliber', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_PRODUCT_CALIBERS', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newProductCaliber(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('product-caliber', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateProductCaliber(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`product-caliber/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeProductCaliber(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`product-caliber/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
