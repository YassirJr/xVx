import { defineStore } from 'pinia'

export const useWarehouseStore = defineStore({
  id: 'warehouse',
  state: () => ({
    warehouses: [],
  }),
  actions: {
    fetchWarehouses(query) {
      return new Promise((resolve) => {
        axios
          .get('warehouse', { params: query })
          .then(({ data }) => {
            if (query?.list) this.warehouses = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newWarehouse(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('warehouse', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },

    updateWarehouse(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`warehouse/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },

    removeWarehouse(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`warehouse/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
