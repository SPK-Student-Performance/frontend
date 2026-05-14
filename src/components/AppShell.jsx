import { useState, useEffect } from 'react'
import {
  BarChart3,
  CheckCircle2,
  CircleHelp,
  Edit2,
  LayoutDashboard,
  Loader2,
  LogOut,
  Upload,
  Users,
  X,
  AlertCircle,
} from 'lucide-react'
import { getCurrentUser, logout, updateProfile } from '../services/authService'
import { dismissUploadTaskStatus, subscribeUploadTask } from '../services/uploadTaskStore'
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
  const [uploadStatus, setUploadStatus] = useState(null)
  const [profile, setProfile] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({ username: '', fullName: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    let dismissTimer = null
    const unsubscribe = subscribeUploadTask(({ status }) => {
      setUploadStatus(status)
      if (dismissTimer) {
        clearTimeout(dismissTimer)
      }
      if (status && !status.loading) {
        // Auto dismiss after 5s if done or error
        dismissTimer = setTimeout(() => dismissUploadTaskStatus(), 5000)
      }
    })
    return () => {
      if (dismissTimer) {
        clearTimeout(dismissTimer)
      }
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    let ignore = false
    getCurrentUser()
      .then((res) => {
        if (ignore) return
        const user = res?.user
        setProfile(user)
        setProfileForm({ username: user?.username || '', fullName: user?.full_name || '' })
      })
      .catch(() => {})
    return () => { ignore = true }
  }, [])

  const handleLogout = (e) => {
    e.preventDefault()
    logout()
  }

  const initials = (profile?.full_name || profile?.username || 'Teacher')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join('')
    .toUpperCase() || 'T'

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError('')
    try {
      const res = await updateProfile(profileForm)
      const user = res?.user
      setProfile(user)
      setProfileForm({ username: user?.username || '', fullName: user?.full_name || '' })
      setProfileOpen(false)
    } catch (err) {
      setProfileError(err.message || 'Gagal memperbarui profil.')
    } finally {
      setProfileLoading(false)
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
      <div className="pb-24 lg:pb-0 lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 border-b border-primary-200/60 bg-white/80 px-4 py-3.5 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <a href="#dashboard" className="flex items-center gap-2 lg:hidden" aria-label="Artha dashboard">
              <img src={logoImg} alt="" className="h-9 w-9 rounded-lg object-contain" />
              <div>
                <p className="font-heading text-base font-bold leading-none text-primary-900">Artha</p>
                <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-secondary-500">Support</p>
              </div>
            </a>
            <div className="flex items-center gap-2">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-primary-950">{profile?.full_name || 'Teacher'}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary-500">{profile?.role || 'teacher'}</p>
              </div>
              <button
                onClick={() => setProfileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-primary-200 bg-primary-700 text-xs font-bold text-white transition hover:bg-primary-800"
                aria-label="Open teacher profile"
              >
                {initials}
              </button>
            </div>
          </div>
        </header>

        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-primary-200 bg-white/95 px-2 py-2 shadow-[0_-12px_30px_rgba(15,23,66,0.08)] backdrop-blur lg:hidden" aria-label="Mobile navigation">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.href === `#${activeView}`
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[10px] font-bold transition ${
                  isActive
                    ? 'bg-primary-700 text-white'
                    : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-800'
                }`}
              >
                <Icon size={17} aria-hidden="true" />
                <span className="w-full truncate text-center">{item.label.replace('Student ', '').replace('Class ', '').replace(' CSV', '')}</span>
              </a>
            )
          })}
        </div>
      </nav>

      {/* Global Upload Toast */}
      {uploadStatus && (
        <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-80 rounded-2xl border border-primary-200 bg-white p-4 shadow-2xl animate-in slide-in-from-bottom-5 lg:bottom-6 lg:right-6">
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
              <button onClick={() => dismissUploadTaskStatus()} className="text-secondary-400 hover:text-primary-950">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleProfileSubmit} className="w-full max-w-md rounded-2xl border border-primary-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-primary-100 px-6 py-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-primary-950">Profil Guru</h2>
                <p className="mt-1 text-xs font-semibold text-secondary-500">Kelola identitas akun pengajar.</p>
              </div>
              <button type="button" onClick={() => setProfileOpen(false)} className="rounded-lg p-2 text-secondary-400 transition hover:bg-primary-100 hover:text-primary-950">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="flex items-center gap-3 rounded-xl border border-primary-100 bg-primary-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-700 text-sm font-bold text-white">{initials}</div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-primary-950">{profile?.full_name || 'Teacher'}</p>
                  <p className="truncate text-xs font-semibold text-secondary-500">{profile?.role || 'teacher'}</p>
                </div>
              </div>

              {profileError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {profileError}
                </div>
              )}

              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-600">Nama Lengkap</span>
                <input
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-secondary-200 bg-primary-50/50 px-3 py-2.5 text-sm text-primary-950 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-200"
                  required
                />
              </label>

              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-600">Username</span>
                <input
                  value={profileForm.username}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, username: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-secondary-200 bg-primary-50/50 px-3 py-2.5 text-sm text-primary-950 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-200"
                  required
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-primary-100 px-6 py-4">
              <button type="button" onClick={() => setProfileOpen(false)} disabled={profileLoading} className="rounded-xl px-4 py-2 text-sm font-semibold text-secondary-600 transition hover:bg-secondary-50">
                Batal
              </button>
              <button type="submit" disabled={profileLoading} className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-primary-800 disabled:opacity-60">
                {profileLoading ? <Loader2 size={16} className="animate-spin" /> : <Edit2 size={16} />}
                Simpan Profil
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}
