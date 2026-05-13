import { useState, useEffect } from 'react'
import {
  BarChart3,
  Bell,
  CheckCircle2,
  CircleHelp,
  LayoutDashboard,
  Loader2,
  LogOut,
  Search,
  Settings,
  Upload,
  Users,
  X,
  AlertCircle,
} from 'lucide-react'
import { logout } from '../services/authService'
import logoImg from '../assets/logo.png'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '#dashboard' },
  { label: 'Student Roster', icon: Users, href: '#roster' },
  { label: 'Class Analytics', icon: BarChart3, href: '#analytics' },
  { label: 'Upload CSV', icon: Upload, href: '#upload' },
]

function SidebarLink({ item, activeView }) {
  const Icon = item.icon
  const isActive = item.href === `#${activeView}`

  return (
    <a
      href={item.href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
        isActive
          ? 'bg-primary-700 text-white shadow-sm shadow-primary-700/30'
          : 'text-primary-800 hover:bg-primary-200/60 hover:text-primary-900'
      }`}
    >
      <Icon size={17} aria-hidden="true" />
      {item.label}
    </a>
  )
}

export default function AppShell({ activeView, children }) {
  const [searchValue, setSearchValue] = useState('')
  const [uploadStatus, setUploadStatus] = useState(null)

  useEffect(() => {
    const handleUploadEvent = (e) => {
      setUploadStatus(e.detail)
      if (!e.detail?.loading) {
        // Auto dismiss after 5s if done or error
        setTimeout(() => setUploadStatus(null), 5000)
      }
    }
    window.addEventListener('csv-upload-status', handleUploadEvent)
    return () => window.removeEventListener('csv-upload-status', handleUploadEvent)
  }, [])

  const handleLogout = (e) => {
    e.preventDefault()
    logout()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchValue.trim()) {
      window.location.hash = `#roster?q=${encodeURIComponent(searchValue.trim())}`
    } else {
      window.location.hash = `#roster`
    }
  }

  return (
    <main className="min-h-screen bg-primary-50 text-primary-950 relative">
      {/* ─── Sidebar ─── */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-primary-200 bg-gradient-to-b from-primary-100 via-primary-50 to-primary-100 lg:flex">
        {/* Brand */}
        <div className="px-5 pb-6 pt-6">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Artha Logo" className="h-11 w-11 rounded-xl object-contain" />
            <div>
              <h1 className="font-heading text-xl font-bold leading-none text-primary-900">
                Artha
              </h1>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-secondary-500">
                Academic Support
              </p>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <div className="px-4 pb-6">
          <a
            href="#upload"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-tertiary-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-tertiary-700/25 transition hover:bg-tertiary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary-300"
          >
            <Upload size={15} aria-hidden="true" />
            Upload CSV Data
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1.5 px-4" aria-label="Main">
          {navItems.map((item) => (
            <SidebarLink key={item.label} item={item} activeView={activeView} />
          ))}
        </nav>

        {/* Bottom Links */}
        <div className="border-t border-primary-200 px-4 py-5">
          <a
            href="#help"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-secondary-600 hover:bg-primary-200/60 hover:text-primary-900 transition"
          >
            <CircleHelp size={17} aria-hidden="true" />
            Help Center
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-secondary-600 hover:bg-primary-200/60 hover:text-primary-900 transition"
          >
            <LogOut size={17} aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 border-b border-primary-200/60 bg-white/80 px-4 py-3.5 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form onSubmit={handleSearch} className="relative block w-full max-w-sm">
              <span className="sr-only">Search dashboard</span>
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search students (Press Enter)..."
                className="h-10 w-full rounded-xl border border-secondary-200 bg-primary-50/60 pl-10 pr-3 text-sm text-primary-950 outline-none transition placeholder:text-secondary-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-200"
              />
            </form>

            <div className="flex items-center gap-3">
              <button
                className="rounded-lg p-2 text-secondary-500 transition hover:bg-primary-100 hover:text-primary-700"
                aria-label="Notifications"
              >
                <Bell size={18} />
              </button>
              <button
                className="rounded-lg p-2 text-secondary-500 transition hover:bg-primary-100 hover:text-primary-700"
                aria-label="Settings"
              >
                <Settings size={18} />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-primary-200 bg-primary-700 text-xs font-bold text-white">
                LT
              </div>
            </div>
          </div>
        </header>

        {children}
      </div>

      {/* Global Upload Toast */}
      {uploadStatus && (
        <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl bg-white p-4 shadow-2xl border border-primary-200 animate-in slide-in-from-bottom-5">
          <div className="flex items-start gap-3">
            {uploadStatus.loading ? (
              <Loader2 size={20} className="animate-spin text-primary-600 mt-0.5 shrink-0" />
            ) : uploadStatus.error ? (
              <AlertCircle size={20} className="text-red-500 mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 size={20} className="text-emerald-500 mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-primary-950 truncate">{uploadStatus.title}</p>
              <p className="text-xs text-secondary-600 mt-0.5 line-clamp-2">{uploadStatus.message}</p>
            </div>
            {!uploadStatus.loading && (
              <button onClick={() => setUploadStatus(null)} className="text-secondary-400 hover:text-primary-950">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

