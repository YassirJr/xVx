import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('device', {
  state: () => ({
    devices: [],
  }),
  actions: {
    fetchDevices(query) {
      return new Promise((resolve) => {
        axios
          .get('device', { params: query })
          .then(({ data }) => {
            if (query?.list) this.devices = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newDevice(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('device', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateDevice(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`device/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeDevice(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`device/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    syncEmployees(form) {
      return new Promise((resolve, reject) => {
        axios
          .post(`device-sync-employees/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
