import { defineStore } from 'pinia'

export const useCompanyStore = defineStore('company', {
  state: () => ({ companies: [] }),
  actions: {
    fetchCompanies(query) {
      return new Promise((resolve) => {
        axios
          .get('company', { params: query })
          .then(({ data }) => {
            if (query?.list) this.companies = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newCompany(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('company', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateCompany(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`company/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeCompany(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`company/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
