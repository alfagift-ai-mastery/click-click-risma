import { useState } from 'react'
import ProjectTable from '../components/dashboard/ProjectTable'
import Sidebar from '../components/dashboard/Sidebar'
import StatCards from '../components/dashboard/StatCards'
import TaskList from '../components/dashboard/TaskList'
import { getStats, PROJECTS, TASKS } from '../data/dashboard'
import { getSession } from '../auth/session'

export default function DashboardPage() {
  // RequireAuth memastikan sesi ada sebelum halaman ini dirender.
  const email = getSession() ?? ''
  const [menuOpen, setMenuOpen] = useState(false)
  const stats = getStats(PROJECTS, TASKS)

  return (
    <div className="dashboard">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="sidebar"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>
          <h1 className="greeting">Halo, {email}</h1>
        </header>

        <main className="dashboard-content">
          <StatCards stats={stats} />
          <section aria-labelledby="projects-title">
            <h2 id="projects-title" className="section-title">
              Projects
            </h2>
            <ProjectTable projects={PROJECTS} />
          </section>
          <TaskList tasks={TASKS} />
        </main>
      </div>
    </div>
  )
}
