import { describe, it, expect } from 'vitest'

import adminRoutes from './admin'

describe('admin routes', () => {
  it('registers users and schools CRUD routes with admin role', () => {
    const adminRoot = adminRoutes.find((route) => route.path === '/admin')
    const children = adminRoot?.children || []

    const usersRoute = children.find((route) => route.name === 'admin-users')
    const createRoute = children.find((route) => route.name === 'admin-users-create')
    const editRoute = children.find((route) => route.name === 'admin-users-edit')
    const schoolsRoute = children.find((route) => route.name === 'admin-schools')
    const schoolsCreateRoute = children.find((route) => route.name === 'admin-schools-create')
    const schoolsEditRoute = children.find((route) => route.name === 'admin-schools-edit')

    expect(usersRoute?.path).toBe('users')
    expect(usersRoute?.meta?.role).toBe('admin')

    expect(createRoute?.path).toBe('users/create')
    expect(createRoute?.meta?.role).toBe('admin')

    expect(editRoute?.path).toBe('users/:id/edit')
    expect(editRoute?.meta?.role).toBe('admin')

    expect(schoolsRoute?.path).toBe('schools')
    expect(schoolsRoute?.meta?.role).toBe('admin')

    expect(schoolsCreateRoute?.path).toBe('schools/create')
    expect(schoolsCreateRoute?.meta?.role).toBe('admin')

    expect(schoolsEditRoute?.path).toBe('schools/:id/edit')
    expect(schoolsEditRoute?.meta?.role).toBe('admin')
  })

  it('does not register removed students/classes/staff routes', () => {
    const adminRoot = adminRoutes.find((route) => route.path === '/admin')
    const children = adminRoot?.children || []

    expect(children.find((route) => route.name === 'admin-students')).toBeUndefined()
    expect(children.find((route) => route.name === 'admin-classes-programs')).toBeUndefined()
    expect(children.find((route) => route.name === 'admin-classes-assignments')).toBeUndefined()
    expect(children.find((route) => route.name === 'admin-staff')).toBeUndefined()
  })
})
