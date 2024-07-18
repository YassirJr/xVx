import { defineStore } from 'pinia'

export const usePackhousePointingTaskStore = defineStore('packhouse-pointing-task', {
  state: () => ({
    packhousePointingTask: [],
  }),
  actions: {
    fetch(query) {
      return new Promise((resolve) => {
        axios
          .get('packhouse-pointing-task', { params: query })
          .then(({ data }) => {
            this.packhousePointingTask = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('packhouse-pointing-task', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    update(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`packhouse-pointing-task/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`packhouse-pointing-task/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
})
