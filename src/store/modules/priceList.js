export default {
  namespaced: true,
  state: {
    priceLists: [],
    priceTypes: [
      { label: 'sell', value: 0 },
      { label: 'purchase', value: 1 },
    ],
  },
  getters: {
    priceLists: (state) => state.priceLists,
    getPriceTypes: (state) => state.priceTypes,
  },
  mutations: {
    SET_PRICE_LISTS(state, value) {
      state.priceLists = value
    },
  },
  actions: {
    fetchPriceLists({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('price-list', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_PRICE_LISTS', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPriceList(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('price-list', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePriceList(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`price-list/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePriceList(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`price-list/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
