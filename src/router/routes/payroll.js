export default {
  path: 'payroll',
  label: 'payroll',
  meta: { icon: 'wallet' },
  children: [
    {
      path: 'settings',
      label: 'settings',
      meta: { icon: 'settings' },
      children: [
        {
          path: 'seniority-ranges',
          name: 'seniority-ranges',
          component: 'seniority/index',
          meta: {
            label: 'seniority-ranges',
            icon: 'adjustments',
            permission: 'seniority-view',
          },
        },
        {
          path: 'income-tax-brackets',
          name: 'income-tax-brackets',
          component: 'income-tax/index',
          meta: {
            label: 'income-tax-brackets',
            icon: 'receipt-2',
            permission: 'income-tax-view',
          },
        },
        {
          path: 'social-fund',
          name: 'social-fund',
          component: 'social-fund/index',
          meta: {
            label: 'social-fund',
            icon: 'briefcase',
            permission: 'social-fund-view',
          },
        },
        {
          path: 'payroll-sections',
          name: 'payroll-sections',
          component: 'payroll-section/index',
          meta: {
            label: 'payroll-sections',
            icon: 'cash',
            permission: 'payroll-section-view',
          },
        },
        {
          path: 'withholding-scales',
          name: 'withholding-scales',
          component: 'withholding-scales/index',
          meta: {
            label: 'withholding-scales',
            icon: 'file-euro',
            permission: 'withholding-scale-view',
          },
        },
      ],
    },
    {
      path: 'payroll',
      name: 'payroll',
      component: 'payroll/index',
      meta: {
        label: 'payroll',
        icon: 'wallet',
        permission: 'payroll-view',
      },
    },
    {
      path: 'payroll-variables',
      name: 'payroll-variables',
      component: 'payroll-variable/index',
      meta: {
        label: 'payroll-variables',
        icon: 'currency-dollar',
        permission: 'payroll-variable-view',
      },
    },
    {
      path: 'processed-payroll',
      name: 'processed-payroll',
      component: 'processed-payroll/index',
      meta: {
        label: 'processed-payroll',
        icon: 'businessplan',
        permission: 'processed-payroll-view',
      },
    },
    {
      path: 'pay-closures',
      name: 'pay-closures',
      component: 'pay-closure/index',
      meta: {
        label: 'pay-closures',
        icon: 'credit-card-off',
        permission: 'pay-closure-view',
      },
    },
  ],
}
