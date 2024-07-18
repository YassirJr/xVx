export default {
  namespaced: true,
  state: {
    pointingTransporter: [],
    barcodePageFormats: [
      { value: 'format-44', label: 'format-44', step: 4, maxCopies: 44 },
      { value: 'format-65', label: 'format-65', step: 5, maxCopies: 65 },
      { value: 'format-rouloux', label: 'format-rouloux', step: 2, maxCopies: undefined },
    ],
  },
  getters: {
    pointingTransporter: (state) => state.pointingTransporter,
    getBarcodePageFormats: (state) => state.barcodePageFormats,
    getPageFormatByValue: (state) => (key) => state.barcodePageFormats.find(({ value }) => value == key),
  },
  mutations: {
    SET_POINTING_TRANSPORTER(state, value) {
      state.pointingTransporter = value
    },
  },
  actions: {
    fetchPointingTransporter(_, query) {
      return new Promise((resolve) => {
        axios
          .get('pointing-transporter', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPointingTransporter(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('pointing-transporter', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePointingTransporter(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`pointing-transporter/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePointingTransporter(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`pointing-transporter/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
