export const MESSAGES = {
  emailRequired: 'Email is required',
  emailInvalid: 'Enter a valid email address',
  passwordRequired: 'Password is required',
  passwordWeak:
    'Password must be at least 8 characters and include a letter, a number, and a special character',
  invalidCredentials: 'Incorrect email or password',
} as const

export type LoginInput = { email: string; password: string }
export type LoginErrors = { email?: string; password?: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

export function validateEmail(value: string): string | null {
  const email = value.trim()
  if (email === '') return MESSAGES.emailRequired
  if (!EMAIL_PATTERN.test(email)) return MESSAGES.emailInvalid
  return null
}

export function validatePassword(value: string): string | null {
  if (value === '') return MESSAGES.passwordRequired
  const strong =
    value.length >= MIN_PASSWORD_LENGTH &&
    /\p{L}/u.test(value) &&
    /\d/.test(value) &&
    /[^\p{L}\d]/u.test(value)
  return strong ? null : MESSAGES.passwordWeak
}

export function validateLogin({ email, password }: LoginInput): LoginErrors {
  const errors: LoginErrors = {}
  const emailError = validateEmail(email)
  const passwordError = validatePassword(password)
  if (emailError) errors.email = emailError
  if (passwordError) errors.password = passwordError
  return errors
}
