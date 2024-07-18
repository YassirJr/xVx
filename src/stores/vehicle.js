import { defineStore } from 'pinia'

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    types: [],
    vehicles: [],
    calcModes: [
      { label: 'per-seat-limited', value: 0 },
      { label: 'per-seat-unlimited', value: 1 },
      { label: 'per-trip-with-min-seats', value: 2 },
      { label: 'per-fixed-trip-rate', value: 3 },
    ],
  }),
  getters: {
    getVehicles: (state) => {
      return state.vehicles?.map(({ id, registration_nbr }) => ({ id, label: registration_nbr }))
    },
  },
  actions: {
    fetchTypes(query) {
      return new Promise((resolve) => {
        axios
          .get('vehicle-type', { params: query })
          .then(({ data }) => {
            if (query?.list) this.types = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    fetchVehicles(query) {
      return new Promise((resolve) => {
        axios
          .get('vehicle', { params: query })
          .then(({ data }) => {
            if (query?.list) this.vehicles = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newType(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('vehicle-type', form)
          .then(() => {
            this.fetchTypes({ list: true })
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateType(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`vehicle-type/${form.id}`, form)
          .then(() => {
            this.types.find((el) => el.id == form.id).name = form.name
            resolve()
          })
          .catch(() => reject())
      })
    },
    removeType(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`vehicle-type/${id}`)
          .then(() => {
            const types = this.types.filter((el) => el.id != id)
            this.types = types
            resolve()
          })
          .catch(() => reject())
      })
    },
    newVehicle(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('vehicle', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateVehicle(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`vehicle/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeVehicle(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`vehicle/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchAllVehicles() {
      return new Promise((resolve) => {
        axios
          .get('vehicles')
          .then(({ data }) => {
            this.vehicles = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
})
