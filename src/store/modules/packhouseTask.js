export default {
  namespaced: true,
  state: {
    packhouseTasks: [],
  },
  getters: {
    packhouseTasks: (state) => state.packhouseTasks,
  },
  mutations: {
    SET_PACKHOUSE_TASKS(state, value) {
      state.packhouseTasks = value
    },
  },
  actions: {
    fetchPackhouseTasks({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('packhouse-task', { params: query })
          .then(({ data }) => {
            if (query.list) {
              commit('SET_PACKHOUSE_TASKS', data)
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPackhouseTask(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('packhouse-task', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePackhouseTask(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`packhouse-task/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePackhouseTask(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`packhouse-task/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
