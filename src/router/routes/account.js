import AdminLayout from '@/components/admin/AdminLayout.vue'
import AccountSettingsPage from '@/pages/account/AccountSettingsPage.vue'
import EditProfilePage from '@/pages/account/EditProfilePage.vue'

const accountRoutes = [
  {
    path: '/account',
    component: AdminLayout,
    meta: { role: 'account' },
    children: [
      {
        path: '',
        name: 'account-edit-profile',
        component: EditProfilePage,
        meta: { role: 'admin', title: 'Edit Profile' },
      },
      {
        path: 'settings',
        name: 'account-settings',
        component: AccountSettingsPage,
        meta: { role: 'admin', title: 'Account Settings' },
      },
    ],
  },
]

export default accountRoutes
