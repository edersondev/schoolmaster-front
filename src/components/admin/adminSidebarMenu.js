export const adminSidebarMenu = [
  { index: '/admin', label: 'Dashboard', icon: 'HomeFilled' },
  { index: '/admin/students', label: 'Students', icon: 'User' },
  { index: '/admin/users', label: 'Users', icon: 'Avatar' },
  { index: '/admin/schools', label: 'Schools', icon: 'HomeFilled' },
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
]
