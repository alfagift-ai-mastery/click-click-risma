import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'
import { DUMMY_USER } from './auth/authenticate'
import { saveSession } from './auth/session'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('Routing — akses (B1, A3.6)', () => {
  it('shows the landing with the login form at / when logged out (A1)', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/plan, track/i)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('redirects / to /dashboard when a session already exists (A3.6)', () => {
    saveSession(DUMMY_USER.email)
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: `Halo, ${DUMMY_USER.email}` })).toBeInTheDocument()
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()
  })

  it('redirects /dashboard to / when logged out (B1.2)', () => {
    renderAt('/dashboard')
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /halo/i })).not.toBeInTheDocument()
  })

  it('shows the dashboard at /dashboard when a session exists (B1.1)', () => {
    saveSession(DUMMY_USER.email)
    renderAt('/dashboard')
    expect(screen.getByRole('heading', { level: 1, name: `Halo, ${DUMMY_USER.email}` })).toBeInTheDocument()
  })

  it('sends unknown paths to /', () => {
    renderAt('/does-not-exist')
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
})
