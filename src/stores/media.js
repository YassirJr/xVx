import { defineStore } from 'pinia'

export const useMediaStore = defineStore('media', {
  actions: {
    download(uuid) {
      return new Promise((resolve, reject) => {
        axios
          .post(
            `media/${uuid}`,
            { is_download: true },
            {
              responseType: 'blob',
              headers: {
                'Access-Control-Expose-Headers': 'Content-Disposition',
              },
            },
          )
          .then(({ data, headers }) => {
            const filenameHeader = headers['content-disposition']
            const filenameMatch = filenameHeader?.match(/filename="(.+)"/)
            const filename = filenameMatch[1] || [uuid, data.type.split('/')[1]].join('.')
            const link = document.createElement('a')

            link.href = window.URL.createObjectURL(data)
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            link.remove()
            resolve()
          })
          .finally(() => reject())
      })
    },
    getUrl(uuid) {
      return new Promise((resolve, reject) => {
        axios
          .post(`media/${uuid}`, { is_download: false })
          .then(({ data }) => resolve(data.url))
          .catch(() => reject())
      })
    },
  },
})
