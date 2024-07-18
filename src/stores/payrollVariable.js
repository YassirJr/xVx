import { defineStore } from 'pinia'

export const usePayrollVariableStore = defineStore('payrollVariable', {
  state: () => ({ payrollVariables: [] }),
  actions: {
    fetchPayrollVariables(query) {
      return new Promise((resolve) => {
        axios
          .get('payroll-variable', { params: query })
          .then(({ data }) => {
            if (query?.list) this.payrollVariables = data

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPayrollVariable(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('payroll-variable', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePayrollVariable(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`payroll-variable/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePayrollVariable(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`payroll-variable/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
