export default {
  namespaced: true,
  state: {
    familyItems: [],
  },
  getters: {
    familyItems: (state) => state.familyItems,
  },
  mutations: {
    SET_FAMILY_ITEMS(state, value) {
      state.familyItems = value
    },
  },
  actions: {
    fetchFamilyItems({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('family-item', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              commit('SET_FAMILY_ITEMS', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newFamilyItem(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('family-item', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateFamilyItem(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`family-item/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeFamilyItem(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`family-item/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
