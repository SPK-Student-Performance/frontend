import { useEffect, useState } from 'react'
import { isAuthenticated } from './services/api'
import ClassAnalytics from './pages/ClassAnalytics'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDetail from './pages/StudentDetail'
import StudentRoster from './pages/StudentRoster'
import TeacherDashboard from './pages/TeacherDashboard'
import UploadCSV from './pages/UploadCSV'
import PublicShell from './components/PublicShell'
import Home from './pages/Home'
import About from './pages/About'

const publicRoutes = ['home', 'about', 'login', 'register']

const getView = () => {
  const route = window.location.hash.replace('#', '')

  // Routes that don't need authentication
  if (route === '') return 'home'
  if (publicRoutes.includes(route)) return route

  // Protected routes - require authentication
  if (!isAuthenticated()) {
    window.location.hash = 'login'
    return 'login'
  }

  // student-detail:uuid format
  if (route.startsWith('student/')) {
    return 'student-detail'
  }

  const protectedRoutes = ['dashboard', 'roster', 'analytics', 'upload']
  if (protectedRoutes.includes(route)) {
    return route
  }

  // Unknown route → dashboard if authenticated, login otherwise
  return isAuthenticated() ? 'dashboard' : 'login'
}

const getStudentId = () => {
  const route = window.location.hash.replace('#', '')
  if (route.startsWith('student/')) {
    return route.replace('student/', '')
  }
  return null
}

function App() {
  const [view, setView] = useState(getView)
  const [studentId, setStudentId] = useState(getStudentId)

  useEffect(() => {
    const handleHashChange = () => {
      setView(getView())
      setStudentId(getStudentId())
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    const titles = { home: 'Artha - Mendampingi Setiap Potensi', about: 'About - Artha', login: 'Login - Artha', register: 'Daftar - Artha' }
    document.title = titles[view] || 'Artha - Student Decision Support System'
  }, [view])

  if (view === 'dashboard') {
    return <TeacherDashboard />
  }

  if (view === 'roster') {
    return <StudentRoster />
  }

  if (view === 'analytics') {
    return <ClassAnalytics />
  }

  if (view === 'upload') {
    return <UploadCSV />
  }

  if (view === 'student-detail' && studentId) {
    return <StudentDetail studentId={studentId} />
  }

  return (
    <PublicShell activeView={view}>
      {view === 'home' ? <Home /> : view === 'about' ? <About /> : view === 'register' ? <Register /> : <Login />}
    </PublicShell>
  )
}

export default App
