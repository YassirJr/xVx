import { defineStore } from 'pinia'

export const useIncomeTaxStore = defineStore('incomeTax', {
  state: () => ({ incomeTaxBrackets: [] }),
  actions: {
    fetchIncomeTaxBrackets(query) {
      return new Promise((resolve) => {
        axios
          .get('income-tax', { params: query })
          .then(({ data }) => {
            if (query?.list) this.incomeTaxBrackets = data

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newIncomeTaxBracket(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('income-tax', form)
          .then(() => {
            this.fetchIncomeTaxBrackets({ list: true })
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateIncomeTaxBracket(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`income-tax/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeIncomeTaxBracket(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`income-tax/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
