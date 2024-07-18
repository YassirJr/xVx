import { defineStore } from 'pinia'

export const useProductCategoryStore = defineStore('product-category', {
  state: () => ({ productCategories: [] }),
  getters: {
    getProductCategories: (state) => {
      return state.productCategories.map(({ id, label }) => ({ id, label: label, value: label }))
    },
  },
  actions: {
    fetchProductCategories(query) {
      return new Promise((resolve) => {
        axios
          .get('product-category', { params: query })
          .then(({ data }) => {
            if (query.list) this.productCategories = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newProductCategory(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('product-category', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateProductCategory(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`product-category/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeProductCategory(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`product-category/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
