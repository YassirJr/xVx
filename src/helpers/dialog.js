import store from '@/store'

export default {
  open: (modal) => (store.state.modals[modal] = true),
  close: (modal) => (store.state.modals[modal] = false),
  visible: (modal) => Boolean(store.state.modals[modal]),
}
