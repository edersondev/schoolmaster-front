import AdminLayout from '@/components/admin/AdminLayout.vue'
import TeacherDashboardPage from '@/pages/teacher/TeacherDashboardPage.vue'

const teacherRoutes = [
  {
    path: '/teacher',
    component: AdminLayout,
    meta: { role: 'teacher' },
    children: [
      {
        path: '',
        name: 'teacher-dashboard',
        component: TeacherDashboardPage,
        meta: { role: 'teacher' },
      },
    ],
  },
]

export default teacherRoutes
