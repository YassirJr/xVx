export default {
  namespaced: true,
  state: {
    departments: [],
  },
  getters: {
    departments: (state) => state.departments,
  },
  mutations: {
    SET_DEPARTMENTS(state, value) {
      state.departments = value
    },
  },
  actions: {
    fetchDepartments({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('department')
          .then(({ data }) => {
            commit('SET_DEPARTMENTS', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newDepartment({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('department', form)
          .then(() => {
            dispatch('fetchDepartments')
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateDepartment(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`department/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeDepartment(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`department/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
