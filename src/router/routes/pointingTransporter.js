export default {
  path: 'pointing-transporter',
  label: 'pointing-transporter',
  meta: { icon: 'bus' },
  children: [
    {
      path: 'settings',
      label: 'settings',
      meta: { icon: 'settings' },
      children: [
        {
          path: 'transporters',
          name: 'transporters',
          component: 'transporter/index',
          meta: {
            label: 'transporters',
            icon: 'user-circle',
            permission: 'transporter-view',
          },
        },
        {
          path: 'departures',
          name: 'departures',
          component: 'departure/index',
          meta: {
            label: 'departures',
            icon: 'sign-right',
            permission: 'departure-view',
          },
        },
        {
          path: 'itineraries',
          name: 'itineraries',
          component: 'itinerary/index',
          meta: {
            label: 'itineraries',
            icon: 'route',
            permission: 'itinerary-view',
          },
        },
        {
          path: 'vehicle-types',
          name: 'vehicle-types',
          component: 'vehicle-type/index',
          meta: {
            label: 'vehicle-types',
            icon: 'car-crane',
            permission: 'vehicle-type-view',
          },
        },
        {
          path: 'vehicle-type-rates',
          name: 'vehicle-type-rates',
          component: 'vehicle-type-rate/index',
          meta: {
            label: 'vehicle-type-rates',
            icon: 'route-2',
            permission: 'vehicle-type-rate-view',
          },
        },
        {
          path: 'transport-rates',
          name: 'transport-rates',
          component: 'transport-rate/index',
          meta: {
            label: 'transport-rates',
            icon: 'brand-cashapp',
            permission: 'transport-rate-view',
          },
        },
        {
          path: 'vehicles',
          name: 'vehicles',
          component: 'vehicle/index',
          meta: {
            label: 'vehicles',
            icon: 'bus',
            permission: 'vehicle-view',
          },
        },
      ],
    },
    {
      path: 'pointing-transporter',
      name: 'pointing-transporter',
      component: 'pointing-transporter/index',
      meta: {
        label: 'pointing-transporter',
        icon: 'bus',
        permission: 'pointing-transporter-view',
      },
    },
    {
      path: 'processed-transporter',
      name: 'processed-transporter',
      component: 'processed-pointing-transporter/index',
      meta: {
        label: 'processed-transporter',
        icon: 'truck-delivery',
        permission: 'processed-transport-view',
      },
    },
  ],
}
