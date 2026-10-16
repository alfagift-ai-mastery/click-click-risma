import type { DashboardStats } from '../../data/dashboard'

interface StatCardsProps {
  stats: DashboardStats
}

export default function StatCards({ stats }: StatCardsProps) {
  const items = [
    { label: 'Total projects', value: stats.totalProjects },
    { label: 'Active tasks', value: stats.activeTasks },
    { label: 'Completed tasks', value: stats.completedTasks },
    { label: 'Overdue tasks', value: stats.overdueTasks },
  ]

  return (
    <div className="stat-grid">
      {items.map((item) => (
        <div key={item.label} className="stat-card">
          <span className="stat-label">{item.label}</span>
          <span className="stat-value">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
