export default {
  path: 'recruitment',
  label: 'recruitment',
  meta: { icon: 'user' },
  children: [
    {
      path: 'settings',
      label: 'settings',
      meta: { icon: 'settings' },
      children: [
        {
          path: 'missions',
          name: 'missions',
          component: 'mission/index',
          meta: {
            label: 'missions',
            icon: 'checklist',
            permission: 'mission-view',
          },
        },
        {
          path: 'departments',
          name: 'departments',
          component: 'department/index',
          meta: {
            label: 'departments',
            icon: 'menu',
            permission: 'department-view',
          },
        },
        {
          path: 'banks',
          name: 'banks',
          component: 'bank/index',
          meta: {
            label: 'banks',
            icon: 'building-bank',
            permission: 'bank-view',
          },
        },
        {
          path: 'employee-types',
          name: 'employee-types',
          component: 'employee-types/index',
          meta: {
            label: 'employee-types',
            icon: 'users',
            permission: 'employee-type-view',
          },
        },
      ],
    },
    {
      path: 'employees',
      name: 'employees',
      component: 'employee/index',
      meta: {
        label: 'employees',
        icon: 'user',
        permission: 'employee-view',
      },
    },
  ],
}
