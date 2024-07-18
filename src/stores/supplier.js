import { defineStore } from 'pinia'

export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    suppliers: [],
  }),
  actions: {
    fetchSuppliers(query) {
      return new Promise((resolve) => {
        axios
          .get('supplier', { params: query })
          .then(({ data }) => {
            if (query?.list) this.suppliers = data

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newSupplier(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('supplier', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateSupplier(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`supplier/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeSupplier(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`supplier/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
