import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', {
  state: () => ({ tasks: [] }),
  actions: {
    fetchTasks(query) {
      return new Promise((resolve) => {
        axios
          .get('task', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newTask(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('task', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateTask(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`task/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeTask(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`task/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchAllTasks() {
      return new Promise((resolve) => {
        axios
          .get('tasks')
          .then(({ data }) => {
            this.tasks = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
})
