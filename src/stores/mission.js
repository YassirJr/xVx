import { defineStore } from 'pinia'

export const useMissionStore = defineStore('mission', {
  state: () => ({ missions: [] }),
  actions: {
    fetchMissions(query) {
      return new Promise((resolve) => {
        axios
          .get('mission', { params: query })
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },
    newMission(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('mission', form)
          .then(() => {
            this.fetchAllMissions()
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateMission(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`mission/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeMission(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`mission/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchAllMissions() {
      return new Promise((resolve) => {
        axios
          .get('missions')
          .then(({ data }) => {
            this.missions = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
})
