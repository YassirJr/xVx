export default {
  namespaced: true,
  state: {
    subfamilyItems: [],
  },
  getters: {
    subfamilyItems: (state) => state.subfamilyItems,
  },
  mutations: {
    SET_SUBFAMILY_ITEMS(state, value) {
      state.subfamilyItems = value
    },
  },
  actions: {
    fetchSubfamilyItems({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('subfamily-item', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_SUBFAMILY_ITEMS', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newSubfamilyItem(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('subfamily-item', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateSubfamilyItem(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`subfamily-item/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeSubfamilyItem(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`subfamily-item/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
