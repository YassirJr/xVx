export default {
  computed: {
    $dialog() {
      return {
        open: (modal) => {
          this.$store.state.modals[modal] = true
        },
        close: (modal) => {
          this.$store.state.modals[modal] = false
        },
        visible: (modal) => {
          return Boolean(this.$store.state.modals[modal])
        },
      }
    },
  },
}
