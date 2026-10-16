import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import LoginForm from './LoginForm'
import { DUMMY_USER } from '../auth/authenticate'
import { getSession, saveSession } from '../auth/session'
import { MESSAGES } from '../auth/validation'

function renderForm() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<p>Dashboard reached</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

const emailField = () => screen.getByLabelText('Email')
const passwordField = () => screen.getByLabelText('Password')
const submitButton = () => screen.getByRole('button', { name: /login|logging in/i })

describe('LoginForm — tampilan (A1)', () => {
  it('has an email input, a masked password input and a submit button', () => {
    renderForm()
    expect(emailField()).toBeInTheDocument()
    expect(passwordField()).toHaveAttribute('type', 'password')
    expect(submitButton()).toHaveTextContent('Login')
  })
})

describe('LoginForm — validasi (A2)', () => {
  it('shows an error next to the email field when email is empty (A2.1)', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(passwordField(), DUMMY_USER.password)
    await user.click(submitButton())

    expect(emailField()).toHaveAccessibleDescription(MESSAGES.emailRequired)
    expect(passwordField()).not.toHaveAccessibleDescription()
    expect(screen.queryByText('Dashboard reached')).not.toBeInTheDocument()
  })

  it('shows an error next to the password field when password is empty (A2.2)', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(emailField(), DUMMY_USER.email)
    await user.click(submitButton())

    expect(passwordField()).toHaveAccessibleDescription(MESSAGES.passwordRequired)
  })

  it('shows both errors at once when both fields are empty (A2.3)', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(submitButton())

    expect(emailField()).toHaveAccessibleDescription(MESSAGES.emailRequired)
    expect(passwordField()).toHaveAccessibleDescription(MESSAGES.passwordRequired)
    expect(getSession()).toBeNull()
  })

  it('rejects an invalid email format (A2.4)', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(emailField(), 'not-an-email')
    await user.type(passwordField(), DUMMY_USER.password)
    await user.click(submitButton())

    expect(emailField()).toHaveAccessibleDescription(MESSAGES.emailInvalid)
    expect(getSession()).toBeNull()
  })

  it('rejects a weak password (A2.5)', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(emailField(), DUMMY_USER.email)
    await user.type(passwordField(), 'short1!')
    await user.click(submitButton())

    expect(passwordField()).toHaveAccessibleDescription(MESSAGES.passwordWeak)
    expect(getSession()).toBeNull()
  })

  it('clears a field error once the user edits that field', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(submitButton())
    expect(emailField()).toHaveAccessibleDescription(MESSAGES.emailRequired)

    await user.type(emailField(), 'a')

    expect(emailField()).not.toHaveAccessibleDescription(MESSAGES.emailRequired)
    expect(passwordField()).toHaveAccessibleDescription(MESSAGES.passwordRequired)
  })
})

describe('LoginForm — autentikasi (A3)', () => {
  it('shows a generic error and stays on the form for wrong credentials (A3.2)', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(emailField(), DUMMY_USER.email)
    await user.type(passwordField(), 'Wrong1234!')
    await user.click(submitButton())

    expect(await screen.findByRole('alert')).toHaveTextContent(MESSAGES.invalidCredentials)
    expect(emailField()).toBeInTheDocument()
    expect(getSession()).toBeNull()
    expect(submitButton()).toBeEnabled()
  })

  it('saves the session and redirects to /dashboard for correct credentials (A3.3, A3.4)', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(emailField(), DUMMY_USER.email)
    await user.type(passwordField(), DUMMY_USER.password)
    await user.click(submitButton())

    expect(await screen.findByText('Dashboard reached')).toBeInTheDocument()
    expect(getSession()).toBe(DUMMY_USER.email)
  })

  it('disables the submit button while credentials are being checked (A3.5)', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(emailField(), DUMMY_USER.email)
    await user.type(passwordField(), DUMMY_USER.password)
    await user.click(submitButton())

    expect(submitButton()).toBeDisabled()
    expect(await screen.findByText('Dashboard reached')).toBeInTheDocument()
  })

  it('does not save a session when a previous session exists but the form is wrong', async () => {
    saveSession('old@example.com')
    const user = userEvent.setup()
    renderForm()
    await user.type(emailField(), DUMMY_USER.email)
    await user.type(passwordField(), 'Wrong1234!')
    await user.click(submitButton())

    expect(await screen.findByRole('alert')).toHaveTextContent(MESSAGES.invalidCredentials)
    expect(getSession()).toBe('old@example.com')
  })
})
