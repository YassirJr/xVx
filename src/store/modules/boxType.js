export default {
  namespaced: true,
  state: {
    boxTypes: [],
  },
  getters: {
    boxTypes: (state) => state.boxTypes,
  },
  mutations: {
    SET_BOX_TYPES(state, value) {
      state.boxTypes = value
    },
  },
  actions: {
    fetchBoxTypes({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('box-type', { params: query })
          .then(({ data }) => {
            if (query) {
              commit('SET_BOX_TYPES', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newBoxType(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('box-type', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateBoxType(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`box-type/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeBoxType(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`box-type/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
