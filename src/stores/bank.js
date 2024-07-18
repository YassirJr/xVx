import { defineStore } from 'pinia'

export const useBankStore = defineStore('bank', {
  state: () => ({ banks: [] }),
  actions: {
    fetchBanks(query) {
      return new Promise((resolve) => {
        axios
          .get('bank', { params: query })
          .then(({ data }) => {
            if (query?.list) this.banks = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newBank(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('bank', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateBank(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`bank/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeBank(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`bank/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
