import { defineStore } from 'pinia'

export const useLotInstallmentStore = defineStore('lot-installment', {
  state: () => ({
    lotInstallments: [],
    latestLotInstallment: 1,
    limiters: [],
  }),
  getters: {
    getLotInstallments: (state) => state.lotInstallments.map(({ id, code }) => ({ value: id, label: code })),
  },
  actions: {
    fetch(query) {
      return new Promise((resolve) => {
        axios
          .get('lot-installment', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              this.lotInstallments = data
            } else if (data.current_page == 1 && data.data.length) {
              this.latestLotInstallment = data.data.at(0).id + 1
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('lot-installment', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    update(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`lot-installment/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`lot-installment/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateStatus(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`lot-installment/${form.id}`, { status: !form.status })
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchLimiters() {
      return new Promise((resolve, reject) => {
        axios
          .get('lot-installment/limiter')
          .then(({ data }) => {
            this.limiters = data
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
})
