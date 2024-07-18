import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permission', {
  state: () => ({ permissions: [] }),
  actions: {
    fetchPermissions(query) {
      return new Promise((resolve) => {
        axios
          .get('permission', { params: query })
          .then(({ data }) => {
            if (query?.list) this.permissions = data

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPermission(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('permission', form)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    updatePermission(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`permission/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePermission(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`permission/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
})
