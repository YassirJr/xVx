import { defineStore } from 'pinia'

export const useDepartureStore = defineStore('departure', {
  state: () => ({ departures: [] }),
  actions: {
    fetchDepartures(query) {
      return new Promise((resolve) => {
        axios
          .get('departure', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newDeparture(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('departure', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateDeparture(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`departure/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeDeparture(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`departure/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchAllDepartures() {
      return new Promise((resolve) => {
        axios
          .get('departures')
          .then(({ data }) => {
            this.departures = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
})
