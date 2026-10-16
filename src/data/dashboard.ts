// Data dummy untuk dashboard (B2.7). Semua tampilan dashboard dibaca dari modul ini.
export type ProjectStatus = 'Active' | 'On Hold' | 'Completed'
export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Overdue'
export type Priority = 'High' | 'Medium' | 'Low'

export interface Project {
  id: string
  name: string
  status: ProjectStatus
  progress: number
}

export interface Task {
  id: string
  title: string
  project: string
  priority: Priority
  status: TaskStatus
}

export const PROJECTS: Project[] = [
  { id: 'p1', name: 'Website Redesign', status: 'Active', progress: 65 },
  { id: 'p2', name: 'Mobile App Launch', status: 'Active', progress: 30 },
  { id: 'p3', name: 'Q3 Marketing Campaign', status: 'On Hold', progress: 45 },
  { id: 'p4', name: 'Internal Tools', status: 'Completed', progress: 100 },
]

export const TASKS: Task[] = [
  { id: 't1', title: 'Design landing page wireframes', project: 'Website Redesign', priority: 'High', status: 'In Progress' },
  { id: 't2', title: 'Set up release checklist', project: 'Mobile App Launch', priority: 'High', status: 'Overdue' },
  { id: 't3', title: 'Write campaign copy', project: 'Q3 Marketing Campaign', priority: 'Medium', status: 'To Do' },
  { id: 't4', title: 'Review analytics dashboard', project: 'Internal Tools', priority: 'Low', status: 'Done' },
  { id: 't5', title: 'Fix navigation on mobile', project: 'Website Redesign', priority: 'Medium', status: 'Done' },
]

export interface DashboardStats {
  totalProjects: number
  activeTasks: number
  completedTasks: number
  overdueTasks: number
}

// Task aktif = semua task yang belum Done (termasuk yang terlambat).
export function getStats(projects: Project[], tasks: Task[]): DashboardStats {
  return {
    totalProjects: projects.length,
    activeTasks: tasks.filter((task) => task.status !== 'Done').length,
    completedTasks: tasks.filter((task) => task.status === 'Done').length,
    overdueTasks: tasks.filter((task) => task.status === 'Overdue').length,
  }
}
