export default {
  path: 'reports',
  label: 'reports',
  meta: { icon: 'chart-donut' },
  children: [
    {
      path: '/report',
      name: 'report',
      component: 'report/index',
      meta: {
        label: 'report-hub',
        icon: 'chart-donut',
      },
    },
  ],
}
