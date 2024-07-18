export default {
  label: 'pointing-in-out',
  path: 'pointing-in-out',
  meta: { icon: 'switch-vertical' },
  children: [
    {
      path: 'settings',
      label: 'settings',
      meta: { icon: 'settings' },
      children: [
        {
          path: 'planning-employee',
          name: 'planning-employee',
          component: 'planning-employee/index',
          meta: {
            label: 'planning-employees',
            icon: 'calendar',
            permission: 'planning-employee-view',
          },
        },
        {
          path: 'pointing-reason',
          name: 'pointing-reason',
          component: 'pointing-reason/index',
          meta: {
            label: 'pointing-reason',
            icon: 'alert-circle',
            permission: 'pointing-reason-view',
          },
        },
      ],
    },
    {
      path: 'pointing-in-out',
      name: 'pointing-in-out',
      component: 'pointing-in-out/index',
      meta: {
        label: 'pointing-in-out',
        icon: 'switch-vertical',
        permission: 'pointing-in-out-view',
      },
    },
    {
      path: 'processed-pointing-in-out',
      name: 'processed-pointing-in-out',
      component: 'processed-pointing-in-out/index',
      meta: {
        label: 'processed-pointing-in-out',
        icon: 'switch-vertical',
        permission: 'processed-in-out-view',
      },
    },
  ],
}
