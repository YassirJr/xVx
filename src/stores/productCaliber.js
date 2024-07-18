import { defineStore } from 'pinia'

export const useProductCaliberStore = defineStore('product-caliber', {
  state: () => ({ productCalibers: [] }),
  getters: {
    getProductCalibers: (state) => {
      return state.productCalibers.map(({ id, label }) => ({ id, label, value: label }))
    },
  },
  actions: {
    fetchProductCalibers(query) {
      return new Promise((resolve) => {
        axios
          .get('product-caliber', { params: query })
          .then(({ data }) => {
            if (query.list) this.productCalibers = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newProductCaliber(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('product-caliber', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateProductCaliber(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`product-caliber/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeProductCaliber(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`product-caliber/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
