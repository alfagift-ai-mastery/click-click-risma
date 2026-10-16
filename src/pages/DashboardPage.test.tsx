import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import DashboardPage from './DashboardPage'
import { DUMMY_USER } from '../auth/authenticate'
import { PROJECTS, TASKS } from '../data/dashboard'
import { saveSession } from '../auth/session'

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  )
}

function statValue(label: string) {
  const card = screen.getByText(label, { selector: '.stat-label' }).parentElement!
  return within(card).getByText(/^\d+$/, { selector: '.stat-value' }).textContent
}

describe('DashboardPage — tampilan (B2)', () => {
  beforeEach(() => {
    saveSession(DUMMY_USER.email)
  })

  it('shows the greeting with the logged-in email (B2.1, B2.2)', () => {
    renderDashboard()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      `Halo, ${DUMMY_USER.email}`,
    )
  })

  it('shows the sidebar menu items (B2.3)', () => {
    renderDashboard()
    const sidebar = screen.getByLabelText('Sidebar')
    expect(within(sidebar).getByText('Dashboard')).toHaveAttribute('aria-current', 'page')
    expect(within(sidebar).getByText('Projects')).toBeInTheDocument()
    expect(within(sidebar).getByText('Tasks')).toBeInTheDocument()
  })

  it('shows the four stat cards with values from the dummy data (B2.4)', () => {
    renderDashboard()
    expect(statValue('Total projects')).toBe(String(PROJECTS.length))
    expect(statValue('Active tasks')).toBe('3')
    expect(statValue('Completed tasks')).toBe('2')
    expect(statValue('Overdue tasks')).toBe('1')
  })

  it('shows every dummy project with its status and progress (B2.5)', () => {
    renderDashboard()
    const rows = screen.getAllByRole('row').slice(1)
    expect(rows).toHaveLength(PROJECTS.length)
    for (const project of PROJECTS) {
      expect(screen.getByRole('cell', { name: project.name })).toBeInTheDocument()
      expect(screen.getByLabelText(`${project.name} progress`)).toHaveValue(project.progress)
    }
  })

  it('shows every dummy task with title, project, priority and status (B2.6)', () => {
    renderDashboard()
    const items = document.querySelectorAll('.task-item')
    expect(items).toHaveLength(TASKS.length)
    for (const task of TASKS) {
      expect(screen.getByText(task.title)).toBeInTheDocument()
    }
  })
})

describe('DashboardPage — sidebar di layar kecil', () => {
  beforeEach(() => {
    saveSession(DUMMY_USER.email)
  })

  it('opens and closes the sidebar with the Menu button (aria-expanded)', async () => {
    const user = userEvent.setup()
    renderDashboard()
    const toggle = screen.getByRole('button', { name: 'Menu' })
    const sidebar = document.getElementById('sidebar')!

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(sidebar).not.toHaveClass('open')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(sidebar).toHaveClass('open')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(sidebar).not.toHaveClass('open')
  })

  it('closes the sidebar with its own Close button, since the Menu button sits under the open sidebar', async () => {
    const user = userEvent.setup()
    renderDashboard()
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    expect(document.getElementById('sidebar')).toHaveClass('open')

    await user.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(document.getElementById('sidebar')).not.toHaveClass('open')
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
  })
})
