export default {
  namespaced: true,
  state: {
    pointingTasks: [],
  },
  getters: {
    pointingTasks: (state) => state.pointingTasks,
  },
  mutations: {
    SET_POINTING_TASKS(state, value) {
      state.pointingTasks = value
    },
  },
  actions: {
    fetchPointingTasks(_, query) {
      return new Promise((resolve) => {
        axios
          .get('pointing-task', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPointingTasks(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('pointing-task', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePointingTasks(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`pointing-task/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePointingTasks(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`pointing-task/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    processPointingTasks(_, query) {
      return new Promise((resolve, reject) => {
        axios
          .post('pointing-task-process', query)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
