import { defineStore } from 'pinia'

export const usePointingTasksStore = defineStore('pointingTasks', {
  state: () => ({ pointingTasks: [] }),
  actions: {
    fetchPointingTasks(query) {
      return new Promise((resolve) => {
        axios
          .get('pointing-task', { params: query })
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },
    newPointingTasks(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('pointing-task', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePointingTasks(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`pointing-task/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePointingTasks(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`pointing-task/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    processPointingTasks(query) {
      return new Promise((resolve, reject) => {
        axios
          .post('pointing-task-process', query)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
