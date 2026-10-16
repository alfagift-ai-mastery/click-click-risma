import type { Project } from '../../data/dashboard'

interface ProjectTableProps {
  projects: Project[]
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <caption>Projects</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Progress</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.status}</td>
              <td>
                <progress value={project.progress} max={100} aria-label={`${project.name} progress`}>
                  {project.progress}%
                </progress>{' '}
                <span className="muted">{project.progress}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
