import { defineStore } from 'pinia'

export const usePointingInOutStore = defineStore('pointing-in-out', {
  state: () => ({ pointingInOut: [] }),
  actions: {
    fetchPointingInOut(query) {
      return new Promise((resolve) => {
        axios
          .get('pointing-in-out', { params: query })
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },
    newPointingInOut(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('pointing-in-out', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePointingInOut(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`pointing-in-out/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePointingInOut(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`pointing-in-out/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchProcessed(query) {
      return new Promise((resolve) => {
        axios
          .get('processed-in-out', { params: query })
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },
    process(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('processed-in-out', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    newProcessedPointing(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('new-pointing', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
