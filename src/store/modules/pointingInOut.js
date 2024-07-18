export default {
  namespaced: true,
  state: {
    pointingInOut: [],
    statistics: null,
  },
  getters: {
    pointingInOut: (state) => state.pointingInOut,
    statistics: (state) => state.statistics,
  },
  mutations: {
    SET_POINTING_IN_OUT(state, value) {
      state.pointingInOut = value
    },
    SET_STATISTICS(state, value) {
      state.statistics = value
    },
  },
  actions: {
    fetchPointingInOut(_, query) {
      return new Promise((resolve) => {
        axios
          .get('pointing-in-out', { params: query })
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },
    newPointingInOut(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('pointing-in-out', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePointingInOut(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`pointing-in-out/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePointingInOut(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`pointing-in-out/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    fetchProcessedInOut(_, query) {
      return new Promise((resolve) => {
        axios
          .get('processed-in-out', { params: query })
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },
    processingInOut(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('processed-in-out', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    newProcessedPointing(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('new-pointing', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
