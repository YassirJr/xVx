import { defineStore } from 'pinia'

export const useRoleStore = defineStore('role', {
  state: () => ({ roles: [] }),
  actions: {
    fetchRoles(query) {
      return new Promise((resolve) => {
        axios
          .get('role', { params: query })
          .then(({ data }) => {
            if (query?.list) this.roles = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newRole(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('role', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateRole(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`role/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeRole(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`role/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
