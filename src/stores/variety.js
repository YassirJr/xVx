import { defineStore } from 'pinia'

export const useVarietyStore = defineStore('variety', {
  state: () => ({ varieties: [] }),
  getters: {
    getVarieties: (state) => {
      return state.varieties?.map(({ name, id }) => ({ id, label: name, value: name }))
    },
  },
  actions: {
    fetchVarieties(query) {
      return new Promise((resolve) => {
        axios
          .get('variety', { params: query })
          .then(({ data }) => {
            if (query?.list) this.varieties = data

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newVariety(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('variety', form)
          .then(() => {
            this.fetchAllVarieties()
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateVariety(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`variety/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeVariety(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`variety/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchAllVarieties() {
      return new Promise((resolve) => {
        axios
          .get('varieties')
          .then(({ data }) => {
            this.varieties = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
})
