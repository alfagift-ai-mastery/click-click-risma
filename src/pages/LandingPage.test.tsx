import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import LandingPage from './LandingPage'

function renderLanding() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  )
}

describe('LandingPage (A1.4–A1.8)', () => {
  it('shows the brand and a Sign in link that points to the login form', () => {
    renderLanding()
    expect(screen.getByText('RismaClick', { selector: '.brand' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '#login')
    expect(document.getElementById('login')).toContainElement(screen.getByLabelText('Email'))
  })

  it('shows the hero title and the login form beside it', () => {
    renderLanding()
    expect(
      screen.getByRole('heading', { level: 1, name: /plan, track, and finish projects/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('shows exactly three feature cards', () => {
    renderLanding()
    const cards = document.querySelectorAll('.feature-card')
    expect(cards).toHaveLength(3)
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Progress' })).toBeInTheDocument()
  })

  it('shows four numbered steps', () => {
    renderLanding()
    const steps = screen.getAllByRole('listitem').filter((item) => item.closest('ol'))
    expect(steps).toHaveLength(4)
    expect(steps[0]).toHaveTextContent('01')
    expect(steps[3]).toHaveTextContent('04')
  })

  it('shows a closing call to action and footer', () => {
    renderLanding()
    expect(screen.getByRole('heading', { name: 'Ready to get organized?' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign in to start' })).toHaveAttribute('href', '#login')
    expect(document.querySelector('footer')).toHaveTextContent('RismaClick')
  })
})
