import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ users: [] }),
  actions: {
    fetchUsers(query) {
      return new Promise((resolve) => {
        axios
          .get('user', { params: query })
          .then(({ data }) => {
            if (query?.list) this.users = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newUser(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('user', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateUser(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`user/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeUser(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`user/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
