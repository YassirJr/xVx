import { defineStore } from 'pinia'

export const usePayrollStore = defineStore('payroll', {
  state: () => ({}),
  actions: {
    processPayroll(query) {
      return new Promise((resolve) => {
        axios
          .get('payroll', { params: query })
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },
  },
})
