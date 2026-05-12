import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'

const getAuthView = () =>
  window.location.hash.replace('#', '') === 'register' ? 'register' : 'login'

function App() {
  const [authView, setAuthView] = useState(getAuthView)

  useEffect(() => {
    const handleHashChange = () => setAuthView(getAuthView())

    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return authView === 'register' ? <Register /> : <Login />
}

export default App
