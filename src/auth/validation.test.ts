import { describe, expect, it } from 'vitest'
import { MESSAGES, validateEmail, validateLogin, validatePassword } from './validation'

describe('validateEmail (A2.1, A2.4)', () => {
  it('rejects empty email', () => {
    expect(validateEmail('')).toBe(MESSAGES.emailRequired)
  })

  it('rejects whitespace-only email', () => {
    expect(validateEmail('   ')).toBe(MESSAGES.emailRequired)
  })

  it.each(['plainaddress', 'missing@tld', '@no-local.com', 'two@@at.com', 'sp ace@mail.com'])(
    'rejects invalid email "%s"',
    (value) => {
      expect(validateEmail(value)).toBe(MESSAGES.emailInvalid)
    },
  )

  it('accepts a valid email', () => {
    expect(validateEmail('user@example.com')).toBeNull()
  })

  it('ignores surrounding whitespace', () => {
    expect(validateEmail('  user@example.com  ')).toBeNull()
  })
})

describe('validatePassword (A2.2, A2.5)', () => {
  it('rejects empty password', () => {
    expect(validatePassword('')).toBe(MESSAGES.passwordRequired)
  })

  it.each([
    ['too short', 'Ab1!xyz'],
    ['no letter', '1234567!'],
    ['no number', 'Password!'],
    ['no special character', 'Password1'],
  ])('rejects password that is %s', (_label, value) => {
    expect(validatePassword(value)).toBe(MESSAGES.passwordWeak)
  })

  it('accepts a password with 8+ chars, letter, number and special character', () => {
    expect(validatePassword('Passw0rd!')).toBeNull()
  })

  it('accepts exactly 8 characters', () => {
    expect(validatePassword('Abcdef1!')).toBeNull()
  })
})

describe('validateLogin (A2.3)', () => {
  it('returns both errors when both fields are empty', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: MESSAGES.emailRequired,
      password: MESSAGES.passwordRequired,
    })
  })

  it('returns only the failing field', () => {
    expect(validateLogin({ email: 'user@example.com', password: '' })).toEqual({
      password: MESSAGES.passwordRequired,
    })
  })

  it('returns an empty object when valid', () => {
    expect(validateLogin({ email: 'user@example.com', password: 'Passw0rd!' })).toEqual({})
  })
})
