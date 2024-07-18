export default {
  namespaced: true,
  state: {
    items: [],
    latest_item: null,
    itemUnities: [
      { label: 'kg', value: 'kg' },
      { label: 'liter', value: 'litre' },
      { label: 'meter', value: 'metre' },
      { label: 'roll', value: 'roll' },
      { label: 'piece', value: 'piece' },
      { label: 'bag', value: 'bag' },
    ],
    evaluationModes: [
      { label: 'cump', value: 'cump' },
      { label: 'lifo', value: 'lifo' },
      { label: 'fifo', value: 'fifo' },
      { label: 'standard', value: 'standard' },
    ],
    vatRates: [
      { label: '7%', value: 7 },
      { label: '10%', value: 10 },
      { label: '14%', value: 14 },
      { label: '20%', value: 20 },
    ],
  },
  getters: {
    items: (state) => state.items,
    getUnities: (state) => state.itemUnities,
    getEvaluationModes: (state) => state.evaluationModes,
    getVatRates: (state) => state.vatRates,
    getLatestItem: (state) => state.latest_item,
  },
  mutations: {
    SET_ITEMS(state, value) {
      state.items = value
    },
    SET_LATEST_ITEM(state, value) {
      state.latest_item = value
    },
  },
  actions: {
    fetchItems({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('item')
          .then(({ data }) => {
            commit('SET_ITEMS', data)
            commit('SET_LATEST_ITEM', data.latest_item)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newItem({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('item', form)
          .then(() => resolve(), dispatch('fetchItems'))
          .catch(() => reject())
      })
    },
    updateItem(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`item/${form.id}`, form)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    removeItem(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`item/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
