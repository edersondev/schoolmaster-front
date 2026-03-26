import { createRouter, createWebHistory } from 'vue-router'

import accountRoutes from '@/router/routes/account'
import adminRoutes from '@/router/routes/admin'
import guardianRoutes from '@/router/routes/guardian'
import publicRoutes from '@/router/routes/public'
import schoolAdminRoutes from '@/router/routes/schoolAdmin'
import studentRoutes from '@/router/routes/student'
import teacherRoutes from '@/router/routes/teacher'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    ...accountRoutes,
    ...adminRoutes,
    ...schoolAdminRoutes,
    ...teacherRoutes,
    ...studentRoutes,
    ...guardianRoutes,
  ],
})

export default router
