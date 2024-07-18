import { defineStore } from 'pinia'
import { dayjs } from '@/plugins'

export const useReportStore = defineStore('report-hub', {
  state: () => ({ openedReports: [] }),
  actions: {
    fetch(query) {
      const { endpoint } = query
      delete query.endpoint

      return new Promise((resolve) => {
        axios
          .get(`report/${endpoint}`, { params: query })
          .then(({ data }) => resolve(data))
          .catch(() => resolve([]))
      })
    },

    dataFetchingDelay(reportData) {
      return new Promise((resolve) => {
        const report = this.openedReports[reportData.title] || {}

        if (reportData.fetchData && (!report?.next_update || dayjs() > dayjs(report.next_update))) {
          const data = reportData

          data.next_update = dayjs().add(30, 'second')
          this.openedReports[reportData.title] = data

          resolve()
        }
      })
    },
  },
})
