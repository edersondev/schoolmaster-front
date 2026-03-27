export const roleHomeMap = {
  admin: '/admin',
  'school-admin': '/school-admin',
  teacher: '/teacher',
  student: '/student',
  guardian: '/guardian',
}

export const getRoleHome = (role) => roleHomeMap[role] || '/'
