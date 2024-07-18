import { defineStore } from 'pinia'

export const useDepartmentStore = defineStore('department', {
  state: () => ({ departments: [] }),
  actions: {
    fetchDepartments(query) {
      return new Promise((resolve) => {
        axios
          .get('department', { params: query })
          .then(({ data }) => {
            if (query?.list) this.departments = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newDepartment(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('department', form)
          .then(() => {
            this.fetchDepartments()
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateDepartment(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`department/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeDepartment(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`department/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
