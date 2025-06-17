import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from '@/store'
import { AuthProvider, ProtectedRoute } from '@/contexts/AuthContext'
import AppLayout from '@/components/layout/AppLayout'
import Login from '@/pages/Login'

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Navigate to="/dashboard" replace />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Dashboard</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute requiredRoles={['admin', 'teacher']}>
                  <AppLayout>
                    <div>Students</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Courses</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute requiredRoles={['admin', 'teacher']}>
                  <AppLayout>
                    <div>Attendance</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <AppLayout>
                    <div>Analytics</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Settings</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </Provider>
  )
}
