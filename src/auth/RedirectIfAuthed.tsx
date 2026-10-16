import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getSession } from './session'

// Dipakai di landing (A3.6): user yang sudah login langsung ke dashboard.
export default function RedirectIfAuthed({ children }: { children: ReactNode }) {
  if (getSession() !== null) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
