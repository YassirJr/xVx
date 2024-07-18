import { isQFS } from '@/helpers'

export default {
  namespaced: true,
  state: {
    socialFunds: [],
    fundsList: [
      { value: 'cnss', label: 'cnss', qfs: false },
      { value: 'amo', label: 'amo', qfs: false },
      { value: 'cimr', label: 'cimr', qfs: false },
      { value: 'ipres-rc', label: 'ipres-rc', qfs: true },
      { value: 'ipres-rg', label: 'ipres-rg', qfs: true },
      { value: 'css', label: 'css', qfs: true },
      { value: 'ipm', label: 'ipm', qfs: true },
      { value: 'cfce', label: 'cfce', qfs: true },
    ],
    frequencyDeclaration: [
      { value: 'monthly', label: 'monthly' },
      { value: 'quarterly', label: 'quarterly' },
    ],
    rate_types: [
      { label: 'percent', value: true },
      { label: 'value', value: false },
    ],
  },
  getters: {
    socialFunds: (state) => state.socialFunds,
    fundsList: (state) => state.fundsList.filter((el) => el.qfs == isQFS),
    frequencyDeclaration: (state) => state.frequencyDeclaration,
    getFund: (state) => (fund) => {
      return state.fundsList.find(({ value }) => value == fund)?.label
    },
    getFrequencyDeclaration: (state) => (frequency) => {
      return state.frequencyDeclaration.find(({ value }) => value == frequency)?.label
    },
    rateTypes: (state) => state.rate_types,
  },
  mutations: {
    SET_SOCIAL_FUNDS(state, value) {
      state.socialFunds = value
    },
  },
  actions: {
    fetchSocialFunds({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('social-fund', { params: query })
          .then(({ data }) => {
            if (query) {
              commit('SET_SOCIAL_FUNDS', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newSocialFund({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('social-fund', form)
          .then(() => {
            dispatch('fetchSocialFunds', { list: true })
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateSocialFund(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`social-fund/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeSocialFund(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`social-fund/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
