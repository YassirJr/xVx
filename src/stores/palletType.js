import { defineStore } from 'pinia'

export const usePalletTypeStore = defineStore('pallet-type', {
  state: () => ({ palletTypes: [] }),

  actions: {
    fetchPalletTypes(query) {
      return new Promise((resolve) => {
        axios
          .get('pallet-type', { params: query })
          .then(({ data }) => {
            if (query?.list) this.palletTypes = data

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPalletType(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('pallet-type', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePalletType(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`pallet-type/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePalletType(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`pallet-type/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
