import { defineStore } from 'pinia'

export const useVehicleTypeStore = defineStore('vehicle-type', {
  state: () => ({
    vehicleTypes: [],
    rates: [],
    vehicleTypeGroups: [
      { value: 0, label: 'staff' },
      { value: 1, label: 'merchandise' },
      { value: 2, label: 'function' },
      { value: 3, label: 'service' },
      { value: 4, label: 'export' },
    ],
  }),
  getters: {
    getFilteredGroups: (state) => state.vehicleTypeGroups.filter(({ value }) => [0, 2, 3].includes(value)),
  },
  actions: {
    fetchVehicleTypes(query) {
      return new Promise((resolve) => {
        axios
          .get('vehicle-type', { params: query })
          .then(({ data }) => {
            if (query.list) this.vehicleTypes = data

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newVehicleType(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('vehicle-type', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateVehicleType(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`vehicle-type/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeVehicleType(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`vehicle-type/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchRates(query) {
      return new Promise((resolve) => {
        axios
          .get('vehicle-type-rate', { params: query })
          .then(({ data }) => {
            if (query.list) this.rates = data

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newRate(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('vehicle-type-rate', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateRate(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`vehicle-type-rate/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeRate(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`vehicle-type-rate/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
