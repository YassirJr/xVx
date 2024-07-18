export default {
  namespaced: true,
  state: {
    users: [],
  },
  getters: {
    users: (state) => state.users,
  },
  mutations: {
    SET_USERS(state, value) {
      state.users = value
    },
  },
  actions: {
    fetchUsers(_, query) {
      return new Promise((resolve) => {
        axios
          .get('user', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newUser(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('user', form)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateUser(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`user/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeUser(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`user/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
