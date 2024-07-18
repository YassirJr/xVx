export default {
  namespaced: true,
  state: {
    permissions: [],
  },
  getters: {
    permissions: (state) => state.permissions,
  },
  mutations: {
    SET_PERMISSIONS(state, value) {
      state.permissions = value
    },
  },
  actions: {
    fetchPermissions({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('permission', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              commit('SET_PERMISSIONS', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPermission(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('permission', form)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    updatePermission(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`permission/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePermission(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`permission/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
