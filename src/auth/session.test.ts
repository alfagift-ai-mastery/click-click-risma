import { afterEach, describe, expect, it, vi } from 'vitest'
import { getSession, saveSession } from './session'

describe('session (A3.3, B1.3)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null when nobody is logged in', () => {
    expect(getSession()).toBeNull()
  })

  it('returns the saved email', () => {
    saveSession('user@example.com')
    expect(getSession()).toBe('user@example.com')
  })

  it('is stored in sessionStorage, not localStorage', () => {
    saveSession('user@example.com')
    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(1)
  })

  it('returns null instead of throwing when storage cannot be read', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(getSession()).toBeNull()
  })

  it('does not throw when storage cannot be written', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => saveSession('user@example.com')).not.toThrow()
  })
})
