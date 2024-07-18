import { defineStore } from 'pinia'

export const usePackagingTypesStore = defineStore('packaging-type', {
  state: () => ({ packagingTypes: [] }),
  actions: {
    fetch(query) {
      return new Promise((resolve) => {
        axios
          .get('packhouse-unity', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              this.packagingTypes = data
            }

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('packhouse-unity', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    update(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`packhouse-unity/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`packhouse-unity/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
