import { defineStore } from 'pinia'

export const useDayIndexStore = defineStore('day-index', {
  state: () => ({ dayIndex: [] }),
  actions: {
    fetchDayIndexes(query) {
      return new Promise((resolve) => {
        axios
          .get('day-index', { params: query })
          .then(({ data }) => {
            if (query?.list) this.dayIndex = data
            if (data?.active_day_index?.length) this.activeDayIndex = data.active_day_index

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newDayIndex(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('day-index', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateDayIndex(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`day-index/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeDayIndex(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`day-index/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
