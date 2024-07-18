export default {
  namespaced: true,
  state: {
    roles: [],
  },
  getters: {
    roles: (state) => state.roles,
  },
  mutations: {
    SET_ROLES(state, value) {
      state.roles = value
    },
  },
  actions: {
    fetchRoles({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('role', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              commit('SET_ROLES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newRole({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('role', form)
          .then(() => {
            dispatch('fetchRoles', { list: true })
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateRole(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`role/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeRole(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`role/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
