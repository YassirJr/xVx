import { defineStore } from 'pinia'

export const useVarietyFieldStore = defineStore('variety-field', {
  state: () => ({ varietyFields: [] }),
  actions: {
    fetch(query) {
      return new Promise((resolve) => {
        axios
          .get('variety-field', { params: query })
          .then(({ data }) => {
            if (query?.list) this.varietyFields = data

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('variety-field', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    update(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`variety-field/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`variety-field/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
