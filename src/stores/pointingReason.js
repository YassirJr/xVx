import { defineStore } from 'pinia'

export const usePointingReasonStore = defineStore('pointingReason', {
  state: () => ({ reasons: [] }),
  actions: {
    fetchPointingReasons(query) {
      return new Promise((resolve) => {
        axios
          .get('pointing-reason', { params: query })
          .then(({ data }) => {
            if (query?.list) this.reasons = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPointingReason(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('pointing-reason', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePointingReason(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`pointing-reason/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePointingReason(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`pointing-reason/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchAllReasons() {
      return new Promise((resolve) => {
        axios
          .get('pointing-reasons')
          .then(({ data }) => {
            this.reasons = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
})
