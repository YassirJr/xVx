export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchProcessedPayroll(_, query) {
      return new Promise((resolve) => {
        axios
          .get('processed-payroll', { params: query })
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },
    launchProcessingPayroll(_, form) {
      return new Promise((resolve) => {
        axios.post('processed-payroll', form).finally(() => resolve([]))
      })
    },
  },
}
