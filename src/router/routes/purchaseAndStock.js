export default {
  path: 'purchase-and-stock',
  label: 'purchase-and-stock',
  meta: {
    icon: 'building-warehouse',
  },
  children: [
    {
      path: 'settings',
      label: 'settings',
      meta: { icon: 'settings' },
      children: [
        {
          path: 'family-items',
          name: 'family-items',
          component: 'family-item/index',
          meta: {
            label: 'family-items',
            icon: 'hierarchy',
            permission: 'family-item-view',
          },
        },
        {
          path: 'subfamily-items',
          name: 'subfamily-items',
          component: 'subfamily-item/index',
          meta: {
            label: 'subfamily-items',
            icon: 'hierarchy-3',
            permission: 'subfamily-item-view',
          },
        },
        {
          path: 'warehouses',
          name: 'warehouses',
          component: 'warehouse/index',
          meta: {
            label: 'warehouses',
            icon: 'building-warehouse',
            permission: 'warehouse-view',
          },
        },
        {
          path: 'suppliers',
          name: 'suppliers',
          component: 'supplier/index',
          meta: {
            label: 'suppliers',
            icon: 'user-bolt',
            permission: 'supplier-view',
          },
        },
        {
          path: 'items',
          name: 'items',
          component: 'item/index',
          meta: {
            label: 'items',
            icon: 'box',
            permission: 'item-view',
          },
        },
        {
          path: 'purchase-users',
          name: 'purchase-users',
          component: 'purchase-user/index',
          meta: {
            label: 'purchase-users',
            icon: 'user',
            permission: 'purchase-user-view',
          },
        },
      ],
    },
    {
      path: 'purchase-offers',
      name: 'purchase-offers',
      component: 'purchase-offer/index',
      meta: {
        label: 'purchase-offers',
        icon: 'hierarchy',
        permission: 'purchase-offer-view',
      },
    },
  ],
}
