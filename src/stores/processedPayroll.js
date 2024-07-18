import { defineStore } from 'pinia'

export const useProcessedPayrollStore = defineStore('processed-payroll', {
  actions: {
    fetch(query) {
      return new Promise((resolve) => {
        axios
          .get('processed-payroll', { params: query })
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },
    launchProcessing(form) {
      return new Promise((resolve) => {
        axios.post('processed-payroll', form).finally(() => resolve([]))
      })
    },
  },
})
