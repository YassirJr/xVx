import store from '@/store'

export default async function permissions(to, _, next) {
  const permissions = await store.getters['auth/user']?.permissions?.map(({ name }) => name)

  if (
    !to.meta.permission ||
    (to.meta?.permission && permissions.includes(to.meta?.permission)) ||
    to.name === '404'
  ) {
    next()
  } else if (!to.meta.guest) next({ name: '404' })
}
