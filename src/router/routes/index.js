import profile from './profile'
import dashboard from './dashboard'
import settings from './setting'
import recruitment from './recruitment'
import report from './report'
import pointingInOut from './pointingInOut'
import payroll from './payroll'
import pointingTasks from './pointingTasks'
import pointingTransporter from './pointingTransporter'
import packhouse from './packhouse'
import purchaseAndStock from './purchaseAndStock'

export default {
  path: '/',
  name: 'home',
  redirect: { name: 'dashboard' },
  component: 'Home',
  children: [
    profile,
    dashboard,
    settings,
    recruitment,
    pointingInOut,
    payroll,
    pointingTasks,
    packhouse,
    pointingTransporter,
    purchaseAndStock,
    report,
  ],
}
