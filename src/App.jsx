import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentRoster from './pages/StudentRoster'
import TeacherDashboard from './pages/TeacherDashboard'

const getView = () => {
  const route = window.location.hash.replace('#', '')

  if (route === 'register' || route === 'dashboard' || route === 'roster') {
    return route
  }

  return 'login'
}

function App() {
  const [view, setView] = useState(getView)

  useEffect(() => {
    const handleHashChange = () => setView(getView())

    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (view === 'dashboard') {
    return <TeacherDashboard />
  }

  if (view === 'roster') {
    return <StudentRoster />
  }

  return view === 'register' ? <Register /> : <Login />
}

export default App
