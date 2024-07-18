export default {
  namespaced: true,
  actions: {
    changePassword({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .put('profile/change-password', form)
          .then(() => {
            dispatch('auth/logout', null, { root: true })
            resolve()
          })
          .catch(({ response }) => reject(response))
      })
    },
  },
}
