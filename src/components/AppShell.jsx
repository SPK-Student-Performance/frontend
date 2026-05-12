import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  CircleHelp,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  Users,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '#dashboard' },
  { label: 'Student Roster', icon: Users, href: '#roster' },
  { label: 'Class Analytics', icon: BarChart3, href: '#analytics' },
  { label: 'Interventions', icon: BookOpen, href: '#interventions' },
  { label: 'Reports', icon: FileBarChart, href: '#reports' },
]

function SidebarLink({ item, activeView }) {
  const Icon = item.icon
  const isActive = item.href === `#${activeView}`

  return (
    <a
      href={item.href}
      className={`flex items-center gap-3 rounded px-4 py-3 text-sm font-medium transition ${
        isActive
          ? 'border-l-4 border-teal-700 bg-blue-50 pl-3 text-teal-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={17} aria-hidden="true" />
      {item.label}
    </a>
  )
}

export default function AppShell({ activeView, children }) {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-gray-300/90 bg-[#f8f9ff] lg:flex">
        <div className="px-6 pb-8 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-semibold text-white">
              A
            </div>
            <div>
              <h1 className="text-2xl font-semibold leading-none text-slate-900">
                Artha
              </h1>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                Academic Support
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-6">
          <button className="inline-flex w-full items-center justify-center gap-2 rounded bg-teal-700 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">
            <Plus size={14} aria-hidden="true" />
            New Report
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-4" aria-label="Main">
          {navItems.map((item) => (
            <SidebarLink
              key={item.label}
              item={item}
              activeView={activeView}
            />
          ))}
        </nav>

        <div className="border-t border-gray-300/90 px-4 py-6">
          <a
            href="#help"
            className="flex items-center gap-3 rounded px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <CircleHelp size={18} aria-hidden="true" />
            Help Center
          </a>
          <a
            href="#login"
            className="flex items-center gap-3 rounded px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <LogOut size={17} aria-hidden="true" />
            Logout
          </a>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-gray-300/90 bg-[#f8f9ff] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full max-w-sm">
              <span className="sr-only">Search dashboard</span>
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search students, classes, or reports..."
                className="h-10 w-full rounded border border-gray-300 bg-blue-50/60 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              />
            </label>

            <div className="flex items-center gap-4">
              <button className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-blue-50/60 px-3 py-1.5 text-xs font-medium text-slate-600">
                Academic Year 2024
                <ChevronDown size={13} aria-hidden="true" />
              </button>
              <button
                className="text-slate-600 transition hover:text-slate-900"
                aria-label="Notifications"
              >
                <Bell size={18} />
              </button>
              <button
                className="text-slate-600 transition hover:text-slate-900"
                aria-label="Settings"
              >
                <Settings size={18} />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-blue-100 bg-slate-900 text-xs font-semibold text-white">
                LT
              </div>
            </div>
          </div>
        </header>

        {children}
      </div>
    </main>
  )
}
