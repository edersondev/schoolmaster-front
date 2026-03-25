export const adminSidebarMenu = [
  { index: 'dashboard', label: 'Dashboard', icon: 'HomeFilled' },
  { index: 'students', label: 'Students', icon: 'User' },
  {
    index: 'classes',
    label: 'Classes',
    icon: 'Notebook',
    children: [
      {
        index: 'classes/programs',
        label: 'Programs',
        children: [
          { index: 'classes/programs/schedule', label: 'Schedule' },
          { index: 'classes/programs/subjects', label: 'Subjects' },
        ],
      },
      { index: 'classes/assignments', label: 'Assignments' },
    ],
  },
  { index: 'staff', label: 'Staff', icon: 'UserFilled' },
]
