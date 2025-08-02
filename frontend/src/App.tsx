import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('signin')
  const { user, loading } = useAuth()

  // Handle URL-based routing
  useEffect(() => {
    const path = window.location.pathname
    if (path === '/signup') {
      setCurrentPage('signup')
    } else if (path === '/signin' || path === '/') {
      setCurrentPage('signin')
    }
  }, [])

  // Update URL when page changes
  const navigateTo = (page: string) => {
    setCurrentPage(page)
    const path = page === 'signup' ? '/signup' : '/signin'
    window.history.pushState({}, '', path)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8B0000] border-t-transparent"></div>
      </div>
    )
  }

  // If user is authenticated, show dashboard
  if (user) {
    return <Dashboard />
  }

  // If user is not authenticated, show auth pages
  const renderAuthPage = () => {
    switch (currentPage) {
      case 'signin':
        return <SignIn />
      case 'signup':
        return <SignUp />
      default:
        return <SignIn />
    }
  }

  return (
    <div className="App">
      {/* Navigation for auth pages */}
      <div className="fixed top-4 left-4 right-4 z-50 bg-white rounded-xl shadow-lg p-2 md:left-4 md:right-auto md:w-auto">
        <div className="flex justify-center md:justify-start space-x-2">
          <button
            onClick={() => navigateTo('signin')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'signin' 
                ? 'bg-[#8B0000] text-white' 
                : 'text-gray-600 hover:text-[#8B0000]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => navigateTo('signup')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'signup' 
                ? 'bg-[#8B0000] text-white' 
                : 'text-gray-600 hover:text-[#8B0000]'
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {renderAuthPage()}
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
