import { describe, it, expect } from 'vitest'

import adminRoutes from './admin'

describe('admin routes', () => {
  it('registers users CRUD routes with admin role', () => {
    const adminRoot = adminRoutes.find((route) => route.path === '/admin')
    const children = adminRoot?.children || []

    const usersRoute = children.find((route) => route.name === 'admin-users')
    const createRoute = children.find((route) => route.name === 'admin-users-create')
    const editRoute = children.find((route) => route.name === 'admin-users-edit')

    expect(usersRoute?.path).toBe('users')
    expect(usersRoute?.meta?.role).toBe('admin')

    expect(createRoute?.path).toBe('users/create')
    expect(createRoute?.meta?.role).toBe('admin')

    expect(editRoute?.path).toBe('users/:id/edit')
    expect(editRoute?.meta?.role).toBe('admin')
  })
})
