export default {
  namespaced: true,
  state: {
    clients: [],
  },
  getters: {
    clients: (state) => state.clients,
  },
  mutations: {
    SET_CLIENTS(state, value) {
      state.clients = value
    },
  },
  actions: {
    fetchClients({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('client', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_CLIENTS', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newClient(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('client', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateClient(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`client/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeClient(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`client/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
