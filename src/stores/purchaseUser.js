import { defineStore } from 'pinia'

export const usePurchaseUserStore = defineStore('purchase-user', {
  state: () => ({
    purchaseUsers: [],
    natures: [
      { label: 'all', value: 'all' },
      { label: 'opex', value: 'opex' },
      { label: 'capex', value: 'capex' },
    ],
    status: [
      { label: 'yes', value: true },
      { label: 'no', value: false },
    ],
  }),
  actions: {
    fetchPurchaseUsers(query) {
      return new Promise((resolve) => {
        axios
          .get('purchase-user', { params: query })
          .then(({ data }) => {
            if (query?.list) this.purchaseUsers = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPurchaseUser(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('purchase-user', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePurchaseUser(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`purchase-user/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePurchaseUser(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`purchase-user/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
