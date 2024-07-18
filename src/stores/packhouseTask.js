import { defineStore } from 'pinia'

export const usePackhouseTaskStore = defineStore('packhouse-task', {
  state: () => ({
    packhouseTasks: [],
    isDirect: [
      { label: 'yes', value: true },
      { label: 'no', value: false },
    ],
    hoursOnly: [
      { label: 'yes', value: true },
      { label: 'no', value: false },
    ],
  }),
  actions: {
    fetchPackhouseTasks(query) {
      return new Promise((resolve) => {
        axios
          .get('packhouse-task', { params: query })
          .then(({ data }) => {
            if (query?.list) this.packhouseTasks = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPackhouseTask(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('packhouse-task', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePackhouseTask(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`packhouse-task/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePackhouseTask(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`packhouse-task/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
