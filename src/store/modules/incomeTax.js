export default {
  namespaced: true,
  state: {
    incomeTaxBrackets: [],
  },
  getters: {
    incomeTaxBrackets: (state) => state.incomeTaxBrackets,
  },
  mutations: {
    SET_INCOME_TAX_BRACKETS(state, value) {
      state.incomeTaxBrackets = value
    },
  },
  actions: {
    fetchIncomeTaxBrackets({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('income-tax', { params: query })
          .then(({ data }) => {
            if (query) {
              commit('SET_INCOME_TAX_BRACKETS', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newIncomeTaxBracket({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('income-tax', form)
          .then(() => {
            dispatch('fetchIncomeTaxBrackets', { list: true })
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateIncomeTaxBracket(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`income-tax/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeIncomeTaxBracket(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`income-tax/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
