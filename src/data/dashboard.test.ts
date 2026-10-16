import { describe, expect, it } from 'vitest'
import { PROJECTS, TASKS, getStats, type Project, type Task } from './dashboard'

describe('getStats (B2.4)', () => {
  it('counts projects and tasks from the dummy data', () => {
    expect(getStats(PROJECTS, TASKS)).toEqual({
      totalProjects: 4,
      activeTasks: 3,
      completedTasks: 2,
      overdueTasks: 1,
    })
  })

  it('treats every non-Done task as active, including overdue ones', () => {
    const tasks: Task[] = [
      { id: 'a', title: 'a', project: 'x', priority: 'Low', status: 'Overdue' },
      { id: 'b', title: 'b', project: 'x', priority: 'Low', status: 'To Do' },
    ]
    expect(getStats([], tasks).activeTasks).toBe(2)
  })

  it('returns zeros for empty data', () => {
    const projects: Project[] = []
    expect(getStats(projects, [])).toEqual({
      totalProjects: 0,
      activeTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
    })
  })
})
