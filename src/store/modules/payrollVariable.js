export default {
  namespaced: true,
  state: {
    payrollVariables: [],
  },
  getters: {
    payrollVariables: (state) => state.payrollVariables,
  },
  mutations: {
    SET_PAYROLL_VARIABLES(state, value) {
      state.payrollVariables = value
    },
  },
  actions: {
    fetchPayrollVariables({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('payroll-variable', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              commit('SET_PAYROLL_VARIABLES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPayrollVariable(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('payroll-variable', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePayrollVariable(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`payroll-variable/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePayrollVariable(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`payroll-variable/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
