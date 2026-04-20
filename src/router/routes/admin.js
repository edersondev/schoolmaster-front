import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage.vue'
import AdminSectionPage from '@/pages/admin/AdminSectionPage.vue'
import AdminUsersCreatePage from '@/pages/admin/AdminUsersCreatePage.vue'
import AdminUsersEditPage from '@/pages/admin/AdminUsersEditPage.vue'
import AdminUsersListPage from '@/pages/admin/AdminUsersListPage.vue'
import AdminSchoolsCreatePage from '@/pages/admin/AdminSchoolsCreatePage.vue'
import AdminSchoolsEditPage from '@/pages/admin/AdminSchoolsEditPage.vue'
import AdminSchoolsListPage from '@/pages/admin/AdminSchoolsListPage.vue'

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
        path: 'users',
        name: 'admin-users',
        component: AdminUsersListPage,
        meta: { role: 'admin', title: 'Users' },
      },
      {
        path: 'users/create',
        name: 'admin-users-create',
        component: AdminUsersCreatePage,
        meta: { role: 'admin', title: 'Create User' },
      },
      {
        path: 'users/:id/edit',
        name: 'admin-users-edit',
        component: AdminUsersEditPage,
        meta: { role: 'admin', title: 'Edit User' },
      },
      {
        path: 'schools',
        name: 'admin-schools',
        component: AdminSchoolsListPage,
        meta: { role: 'admin', title: 'Schools' },
      },
      {
        path: 'schools/create',
        name: 'admin-schools-create',
        component: AdminSchoolsCreatePage,
        meta: { role: 'admin', title: 'Create School' },
      },
      {
        path: 'schools/:id/edit',
        name: 'admin-schools-edit',
        component: AdminSchoolsEditPage,
        meta: { role: 'admin', title: 'Edit School' },
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
