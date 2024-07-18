import { createStore } from 'vuex'
const files = import.meta.glob('./modules/*.js', { eager: true })

const modules = {}
for (const key in files) {
  modules[
    key
      .replace('modules/', '')
      .replace(/(\.\/|\.js)/g, '')
      .replace('/', '_')
  ] = files[key].default
}

export default createStore({
  state: {
    modals: {},
  },
  modules,
})
