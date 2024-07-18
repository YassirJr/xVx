import { defineStore } from 'pinia'

export const usePriceListStore = defineStore('price-list', {
  state: () => ({
    priceLists: [],
    priceTypes: [
      { label: 'sell', value: 0 },
      { label: 'purchase', value: 1 },
    ],
  }),
  actions: {
    fetch(query) {
      return new Promise((resolve, reject) => {
        axios
          .get('price-list', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              this.priceLists = data
            }
            resolve(data)
          })
          .catch(() => reject())
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('price-list', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    update(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`price-list/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`price-list/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
