import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    measureUnits: [
      { label: 'box', value: 'box' },
      { label: 'piece', value: 'piece' },
      { label: 'bunch', value: 'bunch' },
      { label: 'bag', value: 'bag' },
      { label: 'kg', value: 'kg' },
    ],
    destinations: [
      { value: 0, label: 'export' },
      { value: 1, label: 'confection' },
      { value: 2, label: 'local-market' },
    ],
    salesUnit: [
      { value: 0, label: 'box' },
      { value: 1, label: 'unity-measure' },
      { value: 2, label: 'net-weight' },
    ],
  }),
  getters: {
    getProducts: (state) => {
      return state.products?.map(({ name, id }) => ({ id, label: name, value: name }))
    },
  },
  actions: {
    fetch(query) {
      return new Promise((resolve, reject) => {
        axios
          .get('final-product', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              this.products = data
            }
            resolve(data)
          })
          .catch(() => reject())
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('final-product', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    update(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`final-product/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`final-product/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
