import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('signin')
  const { user, loading } = useAuth()

  // Handle hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#/signup') {
        setCurrentPage('signup')
      } else if (hash === '#/signin' || hash === '#/' || !hash) {
        setCurrentPage('signin')
      }
    }

    // Set initial page based on hash
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Update hash when page changes
  const navigateTo = (page: string) => {
    setCurrentPage(page)
    const hash = page === 'signup' ? '#/signup' : '#/signin'
    window.location.hash = hash
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
      {/* Navigation for auth pages - Hidden on mobile */}
      <div className="hidden md:block fixed top-4 left-4 z-50 bg-white rounded-xl shadow-lg p-2">
        <div className="flex space-x-2">
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
