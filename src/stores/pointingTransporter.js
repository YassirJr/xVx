import { defineStore } from 'pinia'

export const usePointingTransporterStore = defineStore('pointingTransporter', {
  state: () => ({
    pointingTransporter: [],
    barcodePageFormats: [
      { value: 'format-44', label: 'format-44', step: 4, maxCopies: 44 },
      { value: 'format-65', label: 'format-65', step: 5, maxCopies: 65 },
      { value: 'format-rouloux', label: 'format-rouloux', step: 2, maxCopies: undefined },
    ],
  }),
  getters: {
    getPageFormatByValue: (state) => (key) => state.barcodePageFormats.find(({ value }) => value == key),
  },
  actions: {
    fetchPointing(query) {
      return new Promise((resolve) => {
        axios
          .get('pointing-transporter', { params: query })
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },
    newPointing(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('pointing-transporter', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePointing(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`pointing-transporter/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePointing(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`pointing-transporter/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchProcessed(query) {
      return new Promise((resolve) => {
        axios
          .get('processed-pointing-transporter', { params: query })
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },
    process(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('processed-pointing-transporter', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
