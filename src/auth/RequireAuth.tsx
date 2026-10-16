import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getSession } from './session'

export default function RequireAuth({ children }: { children: ReactNode }) {
  if (getSession() === null) {
    return <Navigate to="/login" replace />
  }
  return children
}
