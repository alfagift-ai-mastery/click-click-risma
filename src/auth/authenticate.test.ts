import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AUTH_DELAY_MS, DUMMY_USER, authenticate } from './authenticate'

describe('authenticate (A3.1, A3.2, A3.4)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('succeeds with the dummy credentials and returns the email', async () => {
    const promise = authenticate(DUMMY_USER.email, DUMMY_USER.password)
    await vi.advanceTimersByTimeAsync(AUTH_DELAY_MS)
    await expect(promise).resolves.toEqual({ ok: true, email: DUMMY_USER.email })
  })

  it('treats email case and surrounding whitespace as insignificant', async () => {
    const promise = authenticate(`  ${DUMMY_USER.email.toUpperCase()}  `, DUMMY_USER.password)
    await vi.advanceTimersByTimeAsync(AUTH_DELAY_MS)
    await expect(promise).resolves.toEqual({ ok: true, email: DUMMY_USER.email })
  })

  it('fails with a wrong password', async () => {
    const promise = authenticate(DUMMY_USER.email, 'Wrong1234!')
    await vi.advanceTimersByTimeAsync(AUTH_DELAY_MS)
    await expect(promise).resolves.toEqual({ ok: false })
  })

  it('fails with an unknown email', async () => {
    const promise = authenticate('nobody@example.com', DUMMY_USER.password)
    await vi.advanceTimersByTimeAsync(AUTH_DELAY_MS)
    await expect(promise).resolves.toEqual({ ok: false })
  })

  it('does not resolve before the delay has elapsed (A3.5 needs a pending state)', async () => {
    let settled = false
    authenticate(DUMMY_USER.email, DUMMY_USER.password).then(() => {
      settled = true
    })
    await vi.advanceTimersByTimeAsync(AUTH_DELAY_MS - 1)
    expect(settled).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(settled).toBe(true)
  })
})
