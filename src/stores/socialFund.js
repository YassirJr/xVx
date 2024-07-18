import { isQFS } from '@/helpers/index'
import { defineStore } from 'pinia'

export const useSocialFundStore = defineStore('social-fund', {
  state: () => ({
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
    rateTypes: [
      { label: 'percent', value: true },
      { label: 'value', value: false },
    ],
  }),
  getters: {
    getFundsList: (state) => state.fundsList.filter((el) => el.qfs == isQFS),
    getFund: (state) => (fund) => {
      return state.fundsList.find(({ value }) => value == fund)?.label
    },
    getFrequencyDeclaration: (state) => (frequency) => {
      return state.frequencyDeclaration.find(({ value }) => value == frequency)?.label
    },
  },
  actions: {
    fetchSocialFunds(query) {
      return new Promise((resolve) => {
        axios
          .get('social-fund', { params: query })
          .then(({ data }) => {
            if (query?.list) this.socialFunds = data

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newSocialFund(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('social-fund', form)
          .then(() => {
            this.fetchSocialFunds({ list: true })
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateSocialFund(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`social-fund/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeSocialFund(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`social-fund/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
