import { defineStore } from 'pinia'

export const useSubFamilyItemStore = defineStore('subfamily-item', {
  state: () => ({ subfamilyItems: [] }),
  actions: {
    fetchSubfamilyItems(query) {
      return new Promise((resolve) => {
        axios
          .get('subfamily-item', { params: query })
          .then(({ data }) => {
            if (query?.list) this.subfamilyItems = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newSubfamilyItem(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('subfamily-item', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateSubfamilyItem(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`subfamily-item/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeSubfamilyItem(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`subfamily-item/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
