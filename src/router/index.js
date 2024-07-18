import router from '@/router/router'
import { auth, permissions } from '@/router/middleware'

router.beforeEach(auth)
router.beforeEach(permissions)

export default router
