import type { Task } from '../../data/dashboard'

interface TaskListProps {
  tasks: Task[]
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <section aria-labelledby="recent-tasks-title">
      <h2 id="recent-tasks-title" className="section-title">
        Recent tasks
      </h2>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span className="task-title">{task.title}</span>
            <span className="muted">{task.project}</span>
            <span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
            <span className="badge">{task.status}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
