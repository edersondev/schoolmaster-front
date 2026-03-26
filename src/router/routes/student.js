import AdminLayout from '@/components/admin/AdminLayout.vue'
import StudentDashboardPage from '@/pages/student/StudentDashboardPage.vue'

const studentRoutes = [
  {
    path: '/student',
    component: AdminLayout,
    meta: { role: 'student' },
    children: [
      {
        path: '',
        name: 'student-dashboard',
        component: StudentDashboardPage,
        meta: { role: 'student' },
      },
    ],
  },
]

export default studentRoutes
