import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B0000] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/signin" element={user ? <Navigate to="/dashboard" replace /> : <SignIn />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignUp />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/signin" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
