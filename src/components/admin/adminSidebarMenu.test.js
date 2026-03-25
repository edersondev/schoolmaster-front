import { describe, it, expect } from 'vitest'
import { adminSidebarMenu } from './adminSidebarMenu'

describe('adminSidebarMenu', () => {
  it('includes a Classes submenu with a 2-level nested structure', () => {
    const classesItem = adminSidebarMenu.find((item) => item.index === 'classes')

    expect(classesItem).toBeTruthy()
    expect(classesItem.children?.length).toBeGreaterThan(0)

    const programsItem = classesItem.children.find(
      (child) => child.index === 'classes/programs'
    )

    expect(programsItem).toBeTruthy()
    expect(programsItem.children?.length).toBe(2)
    expect(programsItem.children.map((child) => child.index)).toEqual([
      'classes/programs/schedule',
      'classes/programs/subjects',
    ])
  })

  it('keeps top-level items in expected order', () => {
    expect(adminSidebarMenu.map((item) => item.index)).toEqual([
      'dashboard',
      'students',
      'classes',
      'staff',
    ])
  })
})
