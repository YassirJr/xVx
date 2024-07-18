export default {
  namespaced: true,
  state: {
    lotInstallments: [],
    latestLotInstallment: 1,
  },
  getters: {
    lotInstallments: (state) => state.lotInstallments,
    latestLotInstallment: (state) => state.latestLotInstallment,
  },
  mutations: {
    SET_LOT_INSTALLMENTS(state, value) {
      state.lotInstallments = value
    },
    SET_LATEST_LOT_INSTALLMENT(state, value) {
      state.latestLotInstallment = value + 1
    },
  },
  actions: {
    fetchLotInstallments({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('lot-installment', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              commit('SET_LOT_INSTALLMENTS', data)
            } else if (data.current_page == 1 && data.data.length) {
              commit('SET_LATEST_LOT_INSTALLMENT', data.data.at(0).id)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newLotInstallment(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('lot-installment', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateLotInstallment(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`lot-installment/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeLotInstallment(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`lot-installment/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateStatus(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`lot-installment/${form.id}`, { status: !form.status })
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
