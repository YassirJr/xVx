import { defineStore } from 'pinia'

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [],
    statusList: [
      { label: 'active', value: true },
      { label: 'inactive', value: false },
    ],
    marketTypes: [
      { label: 'international', value: true },
      { label: 'local-market', value: false },
    ],
  }),
  actions: {
    fetchClients(query) {
      return new Promise((resolve) => {
        axios
          .get('client', { params: query })
          .then(({ data }) => {
            if (query?.list) this.clients = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newClient(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('client', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateClient(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`client/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeClient(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`client/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
