import { defineStore } from 'pinia'

export const useStadeStore = defineStore('stade', {
  state: () => ({ stades: [] }),
  actions: {
    fetchStades(query) {
      return new Promise((resolve) => {
        axios
          .get('stade', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newStade(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('stade', form)
          .then(() => {
            this.fetchAllStades()
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateStade(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`stade/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeStade(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`stade/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchAllStades() {
      return new Promise((resolve) => {
        axios
          .get('stades')
          .then(({ data }) => {
            this.stades = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
})
