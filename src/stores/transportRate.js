import { defineStore } from 'pinia'

export const useTransportRateStore = defineStore('transport-rate', {
  state: () => ({
    transportRates: [],
  }),
  actions: {
    fetch(query) {
      return new Promise((resolve) => {
        axios
          .get('transport-rate', { params: query })
          .then(({ data }) => {
            if (query.list) this.transportRates = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    new(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('transport-rate', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    update(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`transport-rate/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`transport-rate/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
