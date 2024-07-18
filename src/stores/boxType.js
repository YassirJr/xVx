import { defineStore } from 'pinia'

export const useBoxTypeStore = defineStore('box-type', {
  state: () => ({ boxTypes: [] }),
  actions: {
    fetchBoxTypes(query) {
      return new Promise((resolve) => {
        axios
          .get('box-type', { params: query })
          .then(({ data }) => {
            if (query?.list) this.boxTypes = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newBoxType(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('box-type', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateBoxType(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`box-type/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeBoxType(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`box-type/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
