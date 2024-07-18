import { defineStore } from 'pinia'

export const useFarmTrackLoadStore = defineStore('farm-track-load', {
  state: () => ({ farmTrackLoads: [] }),
  actions: {
    fetchFarmTrackLoads(query) {
      return new Promise((resolve) => {
        axios
          .get('farm-track-load', { params: query })
          .then(({ data }) => {
            if (query?.list) this.farmTrackLoads = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newFarmTrackLoad(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('farm-track-load', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateFarmTrackLoad(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`farm-track-load/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeFarmTrackLoad(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`farm-track-load/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
