import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from '@/components/admin/AdminLayout.vue'
import PublicLayout from '@/components/layouts/PublicLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import AccountSettingsPage from '@/pages/account/AccountSettingsPage.vue'
import EditProfilePage from '@/pages/account/EditProfilePage.vue'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage.vue'
import AdminSectionPage from '@/pages/admin/AdminSectionPage.vue'
import SchoolAdminDashboardPage from '@/pages/school-admin/SchoolAdminDashboardPage.vue'
import TeacherDashboardPage from '@/pages/teacher/TeacherDashboardPage.vue'
import StudentDashboardPage from '@/pages/student/StudentDashboardPage.vue'
import GuardianDashboardPage from '@/pages/guardian/GuardianDashboardPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomePage,
      meta: { role: 'shared' },
    },
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
        {
          path: 'account/edit-profile',
          name: 'account-edit-profile',
          component: EditProfilePage,
          meta: { role: 'admin', title: 'Edit Profile' },
        },
        {
          path: 'account/settings',
          name: 'account-settings',
          component: AccountSettingsPage,
          meta: { role: 'admin', title: 'Account Settings' },
        },
      ],
    },
    {
      path: '/school-admin',
      name: 'school-admin-dashboard',
      component: SchoolAdminDashboardPage,
      meta: { role: 'school-admin' },
    },
    {
      path: '/teacher',
      name: 'teacher-dashboard',
      component: TeacherDashboardPage,
      meta: { role: 'teacher' },
    },
    {
      path: '/student',
      name: 'student-dashboard',
      component: StudentDashboardPage,
      meta: { role: 'student' },
    },
    {
      path: '/guardian',
      name: 'guardian-dashboard',
      component: GuardianDashboardPage,
      meta: { role: 'guardian' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
      meta: { role: 'shared' },
    },
  ],
})

export default router
