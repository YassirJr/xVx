export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    processPayroll(_, query) {
      return new Promise((resolve) => {
        axios
          .get('payroll', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
}
