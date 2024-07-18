import { defineStore } from 'pinia'

export const useBrandStore = defineStore('brand', {
  state: () => ({ brands: [] }),
  getters: {
    getBrands: (state) => {
      return state.brands?.map(({ id, label }) => ({ id, label, value: label }))
    },
  },
  actions: {
    fetchBrands(query) {
      return new Promise((resolve) => {
        axios
          .get('brand', { params: query })
          .then(({ data }) => {
            if (query?.list) this.brands = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newBrand(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('brand', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateBrand(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`brand/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeBrand(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`brand/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
