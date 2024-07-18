import { defineStore } from 'pinia'

export const usePackhouseLineStore = defineStore('packhouse-line', {
  state: () => ({
    packhouseLines: [],
    lineStatus: [
      { label: 'active', value: true },
      { label: 'inactive', value: false },
    ],
  }),
  actions: {
    fetch(query) {
      return new Promise((resolve) => {
        axios
          .get('packhouse-line', { params: query })
          .then(({ data }) => {
            if (query?.list) this.packhouseLines = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('packhouse-line', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    update(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`packhouse-line/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`packhouse-line/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
