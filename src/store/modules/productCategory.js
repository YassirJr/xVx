export default {
  namespaced: true,
  state: {
    productCategories: [],
  },
  getters: {
    productCategories: (state) => state.productCategories,
  },
  mutations: {
    SET_PRODUCT_CATEGORIES(state, value) {
      state.productCategories = value
    },
  },
  actions: {
    fetchProductCategories({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('product-category', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_PRODUCT_CATEGORIES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newProductCategory(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('product-category', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateProductCategory(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`product-category/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeProductCategory(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`product-category/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
