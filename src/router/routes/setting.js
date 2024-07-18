export default {
  path: 'settings',
  name: 'settings',
  label: 'settings',
  meta: { icon: 'settings' },
  children: [
    {
      path: 'companies',
      name: 'companies',
      component: 'company/index',
      meta: {
        label: 'companies',
        icon: 'building-skyscraper',
        permission: 'company-view',
      },
    },
    {
      path: 'site-types',
      name: 'site-types',
      component: 'site/type',
      meta: {
        label: 'site-types',
        icon: 'sitemap',
        permission: 'site-type-view',
      },
    },
    {
      path: 'sites',
      name: 'sites',
      component: 'site/index',
      meta: {
        label: 'sites',
        icon: 'map-2',
        permission: 'site-view',
      },
    },
    {
      path: 'permissions',
      name: 'permissions',
      component: 'permission/index',
      meta: {
        label: 'permissions',
        icon: 'shield-checkered',
        permission: 'permission-view',
      },
    },
    {
      path: 'roles',
      name: 'roles',
      component: 'role/index',
      meta: {
        label: 'roles',
        icon: 'shield-check',
        permission: 'role-view',
      },
    },
    {
      path: 'users',
      name: 'users',
      component: 'user/index',
      meta: {
        label: 'users',
        icon: 'user',
        permission: 'user-view',
      },
    },
    {
      path: 'devices',
      name: 'devices',
      component: 'device/index',
      meta: {
        label: 'devices',
        icon: 'device-mobile',
        permission: 'device-view',
      },
    },
    {
      path: 'brands',
      name: 'brands',
      component: 'brand/index',
      meta: {
        label: 'brands',
        icon: 'badge-tm',
        permission: 'brand-view',
      },
    },
    {
      path: 'price-lists',
      name: 'price-lists',
      component: 'price-list/index',
      meta: {
        label: 'price-lists',
        icon: 'clipboard-list',
        permission: 'price-list-view',
      },
    },
  ],
}
