import { defineStore } from 'pinia'

export const useTransporterStore = defineStore('transporter', {
  state: () => ({ transporters: [], latestCode: null }),
  getters: {
    getLatestCode: (state) => {
      return isNaN(+state.latestCode) ? 1 : +state.latestCode + 1
    },
  },
  actions: {
    fetch(query) {
      return new Promise((resolve) => {
        axios
          .get('transporter', { params: query })
          .then(({ data }) => {
            if (query?.list) this.transporters = data
            else this.latestCode = data.latest_code

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('transporter', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    update(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`transporter/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`transporter/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
