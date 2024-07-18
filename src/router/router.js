import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './routes'
import getView from '@/helpers/getView'

export const routes = [
  authRoutes,
  {
    path: '/login',
    name: 'login',
    component: 'Login',
    meta: {
      guest: true,
      label: 'login',
    },
  },
  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: '404',
    meta: {
      label: 'page-not-found',
    },
  },
]

const addViews = (routes) => {
  return routes.map((route) =>
    route?.children?.length
      ? { ...route, component: getView(route.component), children: addViews(route.children) }
      : { ...route, component: getView(route.component) },
  )
}

const router = createRouter({
  history: createWebHistory(),
  routes: addViews(routes),
})

export default router
