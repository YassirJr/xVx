export default {
  namespaced: true,
  state: {
    tasks: [],
  },
  getters: {
    tasks: (state) => state.tasks,
  },
  mutations: {
    SET_TASKS(state, value) {
      state.tasks = value
    },
  },
  actions: {
    fetchTasks(_, query) {
      return new Promise((resolve) => {
        axios
          .get('task', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newTask(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('task', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateTask(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`task/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeTask(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`task/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    fetchAllTasks({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('tasks')
          .then(({ data }) => {
            commit('SET_TASKS', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
}
