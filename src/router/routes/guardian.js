import AdminLayout from '@/components/admin/AdminLayout.vue'
import GuardianDashboardPage from '@/pages/guardian/GuardianDashboardPage.vue'

const guardianRoutes = [
  {
    path: '/guardian',
    component: AdminLayout,
    meta: { role: 'guardian' },
    children: [
      {
        path: '',
        name: 'guardian-dashboard',
        component: GuardianDashboardPage,
        meta: { role: 'guardian' },
      },
    ],
  },
]

export default guardianRoutes
