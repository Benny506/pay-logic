import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence } from 'motion/react'
import DashboardLayout from './components/Admin/DashboardLayout'
import StaffDirectory from './pages/StaffDirectory'
import LandingPage from './pages/LandingPage'
import GlobalLoader from './components/Loader/GlobalLoader'
import GlobalAlerts from './components/Alert/GlobalAlerts'
import Dashboard from './pages/Dashboard'
import Payroll from './pages/Payroll'
import Departments from './pages/Departments'
import Login from './pages/Login'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import { initAuth } from './services/authService'
import { useEffect } from 'react'
import BulkEmailTool from './pages/BulkEmailTool'

function App() {
  const { globalLoading } = useSelector((state) => state.ui)
  const dispatch = useDispatch()

  useEffect(() => {
    const subscription = initAuth(dispatch)
    return () => {
      if (subscription) subscription.unsubscribe()
    }
  }, [dispatch])

  return (
    <Router>
      {/* Global Utility Components */}
      <GlobalAlerts />
      <AnimatePresence>
        {globalLoading && <GlobalLoader />}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout title="Performance Overview">
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <DashboardLayout title="Staff Directory">
                <StaffDirectory />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <DashboardLayout title="Department Overview">
                <Departments />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payroll"
          element={
            <ProtectedRoute>
              <DashboardLayout title="Payroll Processing">
                <Payroll />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bulk-email"
          element={
            <ProtectedRoute>
              <DashboardLayout title="Bulk Payroll Reporting">
                <BulkEmailTool />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
