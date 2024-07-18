export default {
  path: 'pointing-tasks',
  label: 'farm',
  meta: { icon: 'plant' },
  children: [
    {
      path: 'settings',
      label: 'settings',
      meta: { icon: 'settings' },
      children: [
        {
          path: 'varieties',
          name: 'varieties',
          component: 'variety/index',
          meta: {
            label: 'varieties',
            icon: 'apple',
            permission: 'variety-view',
          },
        },
        {
          path: 'varieties-field',
          name: 'varieties-field',
          component: 'variety-field/index',
          meta: {
            label: 'varieties-field',
            icon: 'seeding',
            permission: 'variety-field-view',
          },
        },
        {
          path: 'stades',
          name: 'stades',
          component: 'stade/index',
          meta: {
            label: 'stades',
            icon: 'list-numbers',
            permission: 'stade-view',
          },
        },
        {
          path: 'tasks',
          name: 'tasks',
          component: 'task/index',
          meta: {
            label: 'tasks',
            icon: 'checkbox',
            permission: 'task-view',
          },
        },
        {
          path: 'parcels',
          name: 'parcels',
          component: 'parcel/index',
          meta: {
            label: 'parcels',
            icon: 'box-padding',
            permission: 'parcel-view',
          },
        },
        {
          path: 'unities',
          name: 'unities',
          component: 'unity/index',
          meta: {
            label: 'unities',
            icon: 'brand-codesandbox',
            permission: 'unity-view',
          },
        },
        {
          path: 'cultivation',
          name: 'cultivation',
          component: 'cultivation/index',
          meta: {
            label: 'cultivation',
            icon: 'dialpad',
            permission: 'cultivation-view',
          },
        },
      ],
    },
    {
      path: 'farm-track-loads',
      name: 'farm-track-loads',
      component: 'farm-track-load/index',
      meta: {
        label: 'farm-track-loads',
        icon: 'forklift',
        permission: 'farm-track-load-view',
      },
    },
    {
      path: 'pointing-tasks',
      name: 'pointing-tasks',
      component: 'pointing-tasks/index',
      meta: {
        label: 'pointing-tasks',
        icon: 'chart-pie',
        permission: 'pointing-task-view',
      },
    },
  ],
}
