import { defineStore } from 'pinia'

export const usePlanningEmployeeStore = defineStore('planning-employee', {
  state: () => ({ plannings: [] }),
  actions: {
    fetch(query) {
      return new Promise((resolve) => {
        axios
          .get('planning-employee', { params: query })
          .then(({ data }) => {
            if (query?.list) this.plannings = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('planning-employee', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`planning-employee/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
