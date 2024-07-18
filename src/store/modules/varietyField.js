export default {
  namespaced: true,
  state: {
    varietiesField: [],
  },
  getters: {
    varietiesField: (state) => state.varietiesField,
  },
  mutations: {
    SET_VARIEYTY_FIELD(state, value) {
      state.varietiesField = value
    },
  },
  actions: {
    fetchVarietiesField({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('variety-field', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_VARIEYTY_FIELD', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newVarietyField(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('variety-field', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateVarietyField(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`variety-field/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeVarietyField(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`variety-field/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
