export default {
  namespaced: true,
  state: {
    packhousePointingTask: [],
  },
  getters: {
    packhousePointingTask: (state) => state.packhousePointingTask,
  },
  mutations: {
    SET_PACKHOUSE_POINTING_TASK(state, value) {
      state.packhousePointingTask = value
    },
  },
  actions: {
    fetchPackhousePointingTasks({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('packhouse-pointing-task', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              commit('SET_PACKHOUSE_POINTING_TASK', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPackhousePointingTask(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('packhouse-pointing-task', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePackhousePointingTask(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`packhouse-pointing-task/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePackhousePointingTask(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`packhouse-pointing-task/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    prossecPackhousePointingTask(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('packhouse-pointing-task/process', form)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
