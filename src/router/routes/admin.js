import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage.vue'
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
    ],
  },
]

export default adminRoutes
