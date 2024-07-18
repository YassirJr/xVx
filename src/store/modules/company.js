export default {
  namespaced: true,
  state: {
    companies: [],
  },
  getters: {
    companies: (state) => state.companies,
  },
  mutations: {
    SET_COMPANIES(state, value) {
      state.companies = value
    },
  },
  actions: {
    fetchCompanies({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('company', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              commit('SET_COMPANIES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newCompany(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('company', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateCompany(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`company/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeCompany(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`company/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
