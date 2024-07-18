import { defineStore } from 'pinia'

export const useFamilyItemStore = defineStore({
  id: 'family-item',
  state: () => ({
    familyItems: null,
  }),
  actions: {
    fetchFamilyItems(query) {
      return new Promise((resolve) => {
        axios
          .get('family-item', { params: query })
          .then(({ data }) => {
            if (query?.list) this.familyItems = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newFamilyItem(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('family-item', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateFamilyItem(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`family-item/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeFamilyItem(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`family-item/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
