import { defineStore } from 'pinia'

export const useSeniorityStore = defineStore('seniority', {
  state: () => ({ seniorities: [] }),
  actions: {
    fetchSeniorities(query) {
      return new Promise((resolve) => {
        axios
          .get('seniority', { params: query })
          .then(({ data }) => {
            if (query?.list) this.seniorities = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newSeniority(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('seniority', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateSeniority(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`seniority/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeSeniority(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`seniority/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
