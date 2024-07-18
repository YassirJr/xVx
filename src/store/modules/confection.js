export default {
  namespaced: true,
  state: {
    confections: [],
    latestPalletCode: 0,
    statusOptions: [
      { label: 'in-stock', value: 0, class: 'text-green-500' },
      { label: 'prepare', value: 1, class: 'text-orange-500' },
      { label: 'charged', value: 2, class: 'text-red-500' },
    ],
  },
  getters: {
    confections: (state) => state.confections,
    latestPalletCode: (state) => state.latestPalletCode,
    statusOptions: (state) => state.statusOptions,
  },
  mutations: {
    SET_CONFECTIONS(state, value) {
      state.confections = value
    },
    SET_LATEST_PALLET_CODE(state, value) {
      state.latestPalletCode = value + 1
    },
  },
  actions: {
    fetchConfections({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('confection', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_CONFECTIONS', data)
            } else if (data.current_page == 1 && data.data.length) {
              commit('SET_LATEST_PALLET_CODE', data.latest_pallet_code ?? 0)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newConfection(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('confection', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateConfection(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`confection/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeConfection(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`confection/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
