export default {
  namespaced: true,
  state: {
    expeditions: [],
    status: [
      { label: 'on-hold', value: false, class: 'text-orange-500' },
      { label: 'shipped', value: true, class: 'text-green-500' },
    ],
  },
  getters: {
    expeditions: (state) => state.expeditions,
    status: (state) => state.status,
  },
  mutations: {
    SET_EXPEDITIONS(state, value) {
      state.expeditions = value
    },
  },
  actions: {
    fetchExpeditions({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('expedition', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_EXPEDITIONS', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newExpedition(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('expedition', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateExpedition(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`expedition/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeExpedition(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`expedition/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateExpeditionStatus(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`expedition/${form.id}`, { is_shipped: !form.is_shipped })
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
