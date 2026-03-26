import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage.vue'
import AdminSectionPage from '@/pages/admin/AdminSectionPage.vue'

const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { role: 'admin' },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: AdminDashboardPage,
        meta: { role: 'admin' },
      },
      {
        path: 'students',
        name: 'admin-students',
        component: AdminSectionPage,
        meta: { role: 'admin', title: 'Students' },
      },
      {
        path: 'classes',
        redirect: '/admin/classes/programs',
      },
      {
        path: 'classes/programs',
        name: 'admin-classes-programs',
        component: AdminSectionPage,
        meta: { role: 'admin', title: 'Programs' },
      },
      {
        path: 'classes/programs/schedule',
        name: 'admin-classes-programs-schedule',
        component: AdminSectionPage,
        meta: { role: 'admin', title: 'Schedule' },
      },
      {
        path: 'classes/programs/subjects',
        name: 'admin-classes-programs-subjects',
        component: AdminSectionPage,
        meta: { role: 'admin', title: 'Subjects' },
      },
      {
        path: 'classes/assignments',
        name: 'admin-classes-assignments',
        component: AdminSectionPage,
        meta: { role: 'admin', title: 'Assignments' },
      },
      {
        path: 'staff',
        name: 'admin-staff',
        component: AdminSectionPage,
        meta: { role: 'admin', title: 'Staff' },
      },
    ],
  },
]

export default adminRoutes
