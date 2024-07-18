import { defineStore } from 'pinia'

export const useSiteStore = defineStore('site', {
  state: () => ({
    types: [],
    sites: [],
    groups: [
      { label: 'farm', value: 0 },
      { label: 'grower', value: 1 },
      { label: 'pack-house', value: 2 },
    ],
    latestSiteCode: 1,
  }),
  getters: {
    getStationSites: (state) => {
      return state.sites.filter(({ group }) => group == state.groups[2].value)
    },
    getSites: (state) => {
      return state.sites?.map(({ name, id }) => ({ id, label: name, value: name }))
    },
  },
  actions: {
    fetchTypes(query) {
      return new Promise((resolve) => {
        axios
          .get('site-type', { params: query })
          .then(({ data }) => {
            if (query?.list) this.types = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    fetchSites(query) {
      return new Promise((resolve) => {
        axios
          .get('site', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              this.sites = data
            }
            if (data?.latest_code) {
              this.latestSiteCode = data.latest_code + 1
            }
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newType(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('site-type', form)
          .then(() => {
            this.fetchTypes({ list: true })
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateType(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`site-type/${form.id}`, form)
          .then(() => {
            this.types = this.types.map((el) => (el.id == form.id ? { ...el, type: form.type } : el))
            resolve()
          })
          .catch(() => reject())
      })
    },
    removeType(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`site-type/${id}`)
          .then(() => {
            this.types = this.types.filter((el) => el.id != id)
            resolve()
          })
          .catch(() => reject())
      })
    },
    newSite(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('site', form)
          .then(() => {
            this.fetchAllSites()
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateSite(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`site/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeSite(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`site/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchAllSites() {
      return new Promise((resolve) => {
        axios
          .get('sites')
          .then(({ data }) => {
            this.sites = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
})
