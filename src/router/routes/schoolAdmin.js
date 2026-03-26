import AdminLayout from '@/components/admin/AdminLayout.vue'
import SchoolAdminDashboardPage from '@/pages/school-admin/SchoolAdminDashboardPage.vue'

const schoolAdminRoutes = [
  {
    path: '/school-admin',
    component: AdminLayout,
    meta: { role: 'school-admin' },
    children: [
      {
        path: '',
        name: 'school-admin-dashboard',
        component: SchoolAdminDashboardPage,
        meta: { role: 'school-admin' },
      },
    ],
  },
]

export default schoolAdminRoutes
