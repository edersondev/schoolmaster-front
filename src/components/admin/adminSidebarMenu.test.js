import { describe, it, expect } from 'vitest'
import { adminSidebarMenu } from './adminSidebarMenu'

describe('adminSidebarMenu', () => {
  it('keeps top-level items in expected order', () => {
    expect(adminSidebarMenu.map((item) => item.index)).toEqual([
      '/admin',
      '/admin/users',
      '/admin/schools',
    ])
  })
})
