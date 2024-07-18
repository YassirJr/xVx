import { defineStore } from 'pinia'

export const useItemStore = defineStore('item', {
  state: () => ({
    items: [],
    latestItem: null,
    itemUnities: [
      { label: 'kg', value: 'kg' },
      { label: 'liter', value: 'litre' },
      { label: 'meter', value: 'metre' },
      { label: 'roll', value: 'roll' },
      { label: 'piece', value: 'piece' },
      { label: 'bag', value: 'bag' },
    ],
    evaluationModes: [
      { label: 'cump', value: 'cump' },
      { label: 'lifo', value: 'lifo' },
      { label: 'fifo', value: 'fifo' },
      { label: 'standard', value: 'standard' },
    ],
    vatRates: [
      { label: '7%', value: 7 },
      { label: '10%', value: 10 },
      { label: '14%', value: 14 },
      { label: '20%', value: 20 },
    ],
  }),
  actions: {
    fetchItems(query) {
      return new Promise((resolve) => {
        axios
          .get('item', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              this.items = data
            }

            this.latestItem = data.latest_item
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newItem(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('item', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateItem(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`item/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeItem(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`item/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
