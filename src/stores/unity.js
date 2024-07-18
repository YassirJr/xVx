import { defineStore } from 'pinia'

export const useUnityStore = defineStore('unity', {
  state: () => ({
    unities: [],
    measureUnits: [
      { label: 'kg', value: true },
      { label: 'pieces', value: false },
    ],
    status: [
      { label: 'active', value: true },
      { label: 'inactive', value: false },
    ],
  }),
  getters: {
    getUnities: (state) => {
      return state.unities?.map(({ label, id }) => ({ id, label, value: label }))
    },
  },
  actions: {
    fetchUnities(query) {
      return new Promise((resolve) => {
        axios
          .get('unity', { params: query })
          .then(({ data }) => {
            if (query?.list) this.unities = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newUnity(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('unity', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateUnity(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`unity/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeUnity(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`unity/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
