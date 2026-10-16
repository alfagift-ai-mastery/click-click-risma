import { Navigate, Route, Routes } from 'react-router-dom'
import RedirectIfAuthed from './auth/RedirectIfAuthed'
import RequireAuth from './auth/RequireAuth'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RedirectIfAuthed>
            <LandingPage />
          </RedirectIfAuthed>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
