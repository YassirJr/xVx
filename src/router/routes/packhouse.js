export default {
  path: 'packhouse',
  label: 'packhouse',
  meta: { icon: 'package' },
  children: [
    {
      path: 'settings',
      label: 'settings',
      meta: { icon: 'settings' },
      children: [
        {
          path: 'product-categories',
          name: 'product-categories',
          component: 'product-category/index',
          meta: {
            label: 'product-categories',
            icon: 'category',
            permission: 'product-category-view',
          },
        },
        {
          path: 'product-calibers',
          name: 'product-calibers',
          component: 'product-caliber/index',
          meta: {
            label: 'product-calibers',
            icon: 'weight',
            permission: 'product-caliber-view',
          },
        },
        {
          path: 'box-types',
          name: 'box-types',
          component: 'box-type/index',
          meta: {
            label: 'box-types',
            icon: 'packages',
            permission: 'box-type-view',
          },
        },
        {
          path: 'pallet-types',
          name: 'pallet-types',
          component: 'pallet-type/index',
          meta: {
            label: 'pallet-types',
            icon: 'fence',
            permission: 'pallet-type-view',
          },
        },
        {
          path: 'packaging-types',
          name: 'packaging-types',
          component: 'packaging-types/index',
          meta: {
            label: 'packaging-types',
            icon: 'box',
            permission: 'packhouse-unity-view',
          },
        },
        {
          path: 'products',
          name: 'products',
          component: 'product/index',
          meta: {
            label: 'products',
            icon: 'gift',
            permission: 'final-product-view',
          },
        },
        {
          path: 'packhouse-lines',
          name: 'packhouse-lines',
          component: 'packhouse-line/index',
          meta: {
            label: 'packhouse-lines',
            icon: 'clipboard-typography',
            permission: 'packhouse-line-view',
          },
        },
        {
          path: 'packhouse-tasks',
          name: 'packhouse-tasks',
          component: 'packhouse-task/index',
          meta: {
            label: 'packhouse-tasks',
            icon: 'clipboard-typography',
            permission: 'packhouse-task-view',
          },
        },
        {
          path: 'day-indexes',
          name: 'day-indexes',
          component: 'day-index/index',
          meta: {
            label: 'day-indexes',
            icon: 'calendar',
            permission: 'day-index-view',
          },
        },
        {
          path: 'clients',
          name: 'clients',
          component: 'client/index',
          meta: {
            label: 'clients',
            icon: 'user-dollar',
            permission: 'client-view',
          },
        },
      ],
    },
    {
      path: 'receptions',
      name: 'receptions',
      component: 'reception/index',
      meta: {
        label: 'receptions',
        icon: 'truck-loading',
        permission: 'reception-view',
      },
    },
    {
      path: 'lot-installments',
      name: 'lot-installments',
      component: 'lot-installment/index',
      meta: {
        label: 'lot-installments',
        icon: 'apps',
        permission: 'lot-instalment-view',
      },
    },
    {
      path: 'confections',
      name: 'confections',
      component: 'confection/index',
      meta: {
        label: 'confections',
        icon: 'topology-full-hierarchy',
        permission: 'confection-view',
      },
    },
    {
      path: 'expeditions',
      name: 'expeditions',
      component: 'expedition/index',
      meta: {
        label: 'expeditions',
        icon: 'package-export',
        permission: 'expedition-view',
      },
    },
    {
      path: 'sales-orders',
      name: 'sales-orders',
      component: 'sales-order/index',
      meta: {
        label: 'sales-orders',
        icon: 'clipboard-check',
        permission: 'sales-order-view',
      },
    },
    {
      path: 'packhouse-pointing-tasks',
      name: 'packhouse-pointing-tasks',
      component: 'packhouse-pointing-task/index',
      meta: {
        label: 'packhouse-pointing-tasks',
        icon: 'chart-pie',
        permission: 'packhouse-pointing-task-view',
      },
    },
  ],
}
