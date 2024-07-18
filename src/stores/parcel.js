import { defineStore } from 'pinia'

export const useParcelStore = defineStore('parcel', {
  state: () => ({ parcels: [], latestParcelCode: 1 }),
  actions: {
    fetchParcels(query) {
      return new Promise((resolve) => {
        axios
          .get('parcel', { params: query })
          .then(({ data }) => {
            if (data?.latest_parcel) this.latestParcelCode = data.latest_parcel + 1

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newParcel(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('parcel', form)
          .then(() => {
            this.fetchAllParcels()
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateParcel(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`parcel/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeParcel(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`parcel/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchAllParcels() {
      return new Promise((resolve) => {
        axios
          .get('parcels')
          .then(({ data }) => {
            this.parcels = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
})
