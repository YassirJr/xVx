import { defineStore } from 'pinia'

export const useItineraryStore = defineStore('itinerary', {
  state: () => ({ itineraries: [] }),
  actions: {
    fetchItineraries(query) {
      return new Promise((resolve) => {
        axios
          .get('itinerary', { params: query })
          .then(({ data }) => {
            if (query.list) this.itineraries = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newItinerary(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('itinerary', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateItinerary(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`itinerary/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeItinerary(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`itinerary/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
