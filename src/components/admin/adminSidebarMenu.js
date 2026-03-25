export const adminSidebarMenu = [
  { index: '/admin', label: 'Dashboard', icon: 'HomeFilled' },
  { index: '/admin/students', label: 'Students', icon: 'User' },
  {
    index: '/admin/classes',
    label: 'Classes',
    icon: 'Notebook',
    children: [
      {
        index: '/admin/classes/programs',
        label: 'Programs',
        children: [
          { index: '/admin/classes/programs/schedule', label: 'Schedule' },
          { index: '/admin/classes/programs/subjects', label: 'Subjects' },
        ],
      },
      { index: '/admin/classes/assignments', label: 'Assignments' },
    ],
  },
  { index: '/admin/staff', label: 'Staff', icon: 'UserFilled' },
  {
    index: '/admin/account',
    label: 'Account',
    icon: 'User',
    children: [
      { index: '/admin/account/edit-profile', label: 'Edit Profile' },
      { index: '/admin/account/settings', label: 'Account Settings' },
    ],
  },
]
