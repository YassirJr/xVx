import store from '@/store'
import { i18n } from '@/plugins'

export default async function auth(to, _, next) {
  const isAuthenticated = await store.dispatch('auth/initUser')

  // Change the title of the page
  const title = to?.meta?.label ?? null
  document.title = title ? `${i18n.global.t(title)} - Agriwise` : 'Agriwise'

  if (isAuthenticated) {
    to.meta.guest ? next({ name: 'home' }) : next()
  } else {
    if (!to.meta.guest) {
      next({ name: 'login' })
    } else next()
  }
}
