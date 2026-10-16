import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authenticate } from '../auth/authenticate'
import { saveSession } from '../auth/session'
import { MESSAGES, validateLogin, type LoginErrors } from '../auth/validation'

export default function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const inFlight = useRef(false)

  function handleChange(field: 'email' | 'password') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      if (field === 'email') setEmail(value)
      else setPassword(value)
      setErrors((current) => ({ ...current, [field]: undefined }))
      setFormError(null)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (inFlight.current) return

    const validationErrors = validateLogin({ email, password })
    setErrors(validationErrors)
    setFormError(null)
    if (validationErrors.email || validationErrors.password) return

    inFlight.current = true
    setSubmitting(true)
    const result = await authenticate(email, password)
    if (result.ok) {
      saveSession(result.email)
      navigate('/dashboard', { replace: true })
      return
    }
    inFlight.current = false
    setSubmitting(false)
    setFormError(MESSAGES.invalidCredentials)
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2 className="card-title">Sign in</h2>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={handleChange('email')}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="field-error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={handleChange('password')}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p id="password-error" className="field-error">
            {errors.password}
          </p>
        )}
      </div>

      {formError && (
        <p role="alert" className="form-error">
          {formError}
        </p>
      )}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Logging in…' : 'Login'}
      </button>
    </form>
  )
}
