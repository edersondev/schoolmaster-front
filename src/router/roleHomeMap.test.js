import { describe, it, expect } from 'vitest'

import { getRoleHome } from './roleHomeMap'

describe('roleHomeMap', () => {
  it('returns mapped home for known role', () => {
    expect(getRoleHome('admin')).toBe('/admin')
  })

  it('returns fallback home for unknown role', () => {
    expect(getRoleHome('unknown-role')).toBe('/')
  })
})
