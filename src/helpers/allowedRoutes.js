import store from '@/store'

const permissions = store.getters['auth/user']?.permissions?.map(({ name }) => name)

const filteredRoutes = (routes) => {
  let filterRoutesWithoutChildren = [...routes.filter((route) => !route.children?.length)].filter(
    (route) => permissions.includes(route.meta.permission) || route.meta.permission === undefined,
  )
  let routesWithChildren = routes.filter((route) => route.children?.length)
  let filterRoutesWithChildren = routesWithChildren === [] ? [] : getAllowedRoutes(routesWithChildren)
  return [...filterRoutesWithChildren, ...filterRoutesWithoutChildren]
}
export const getAllowedRoutes = (routes) => {
  let allowedRoutes = []
  routes.forEach((route) => {
    let allowedRoute
    if (route.children?.length) {
      allowedRoute = { ...route, children: filteredRoutes(route.children) }
      if (allowedRoute?.children.length > 0) {
        allowedRoutes.push(allowedRoute)
      }
    } else {
      allowedRoute = { ...filteredRoutes([route])[0] }
      if (Object.keys(allowedRoute).length !== 0) {
        allowedRoutes.push(allowedRoute)
      }
    }
  })
  return allowedRoutes
}
