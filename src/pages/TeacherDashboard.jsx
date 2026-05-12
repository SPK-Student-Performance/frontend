import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  CircleHelp,
  FileBarChart,
  Filter,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  TrendingUp,
  UserRoundCheck,
  Users,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Student Roster', icon: Users },
  { label: 'Class Analytics', icon: BarChart3 },
  { label: 'Interventions', icon: BookOpen },
  { label: 'Reports', icon: FileBarChart },
]

const summaryCards = [
  {
    label: 'Total Students',
    value: '142',
    detail: '+3 this semester',
    icon: Users,
    tone: 'teal',
  },
  {
    label: 'At-Risk Identified',
    value: '12',
    detail: 'Requires immediate attention',
    icon: ShieldAlert,
    tone: 'red',
  },
  {
    label: 'Avg. Attendance',
    value: '94.2%',
    detail: 'progress',
    icon: UserRoundCheck,
    tone: 'teal',
  },
  {
    label: 'Avg. GPA',
    value: '3.14',
    detail: 'Out of 4.0 Scale',
    icon: GraduationCap,
    tone: 'neutral',
  },
]

const students = [
  {
    initials: 'MJ',
    name: 'Marcus Johnson',
    id: '847291',
    className: 'AP Physics',
    gpa: '1.8',
    attendance: '76%',
    risk: 'At-Risk',
  },
  {
    initials: 'SC',
    name: 'Sarah Chen',
    id: '847292',
    className: 'Calculus II',
    gpa: '3.9',
    attendance: '98%',
    risk: 'Safe',
  },
  {
    initials: 'DR',
    name: 'David Rodriguez',
    id: '847293',
    className: 'World History',
    gpa: '2.4',
    attendance: '88%',
    risk: 'Monitoring',
  },
  {
    initials: 'EW',
    name: 'Emily Watson',
    id: '847294',
    className: 'Literature',
    gpa: '2.1',
    attendance: '82%',
    risk: 'At-Risk',
  },
]

const riskStyles = {
  'At-Risk': 'bg-red-100 text-red-800',
  Safe: 'bg-emerald-100 text-emerald-800',
  Monitoring: 'bg-blue-100 text-slate-700',
}

function SummaryCard({ card }) {
  const Icon = card.icon
  const isRed = card.tone === 'red'
  const isAttendance = card.label === 'Avg. Attendance'
  const detailClass =
    card.tone === 'neutral'
      ? 'text-slate-600'
      : isRed
        ? 'text-red-700'
        : 'text-teal-700'

  return (
    <article className="relative flex min-h-40 flex-col justify-between overflow-hidden rounded-lg border border-gray-300/90 bg-[#f8f9ff] p-6">
      {isRed ? (
        <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-xl bg-red-100/70" />
      ) : null}
      <div className="relative flex items-start justify-between gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          {card.label}
        </p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-sm ${
            isRed ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'
          }`}
        >
          <Icon size={17} aria-hidden="true" />
        </span>
      </div>
      <div className="relative">
        <p className="text-4xl font-bold leading-none text-slate-900">
          {card.value}
        </p>
        {isAttendance ? (
          <div className="mt-5 h-1.5 rounded-full bg-blue-100">
            <div className="h-full w-[94%] rounded-full bg-teal-700" />
          </div>
        ) : (
          <p
            className={`mt-3 flex items-center gap-1 text-xs font-medium ${detailClass}`}
          >
            {card.tone === 'teal' ? (
              <TrendingUp size={13} aria-hidden="true" />
            ) : null}
            {card.detail}
          </p>
        )}
      </div>
    </article>
  )
}

function SidebarLink({ item }) {
  const Icon = item.icon

  return (
    <a
      href="#dashboard"
      className={`flex items-center gap-3 rounded px-4 py-3 text-sm font-medium transition ${
        item.active
          ? 'border-l-4 border-teal-700 bg-blue-50 pl-3 text-teal-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={17} aria-hidden="true" />
      {item.label}
    </a>
  )
}

function RiskBadge({ risk }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskStyles[risk]}`}
    >
      {risk}
    </span>
  )
}

export default function TeacherDashboard() {
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
            <SidebarLink key={item.label} item={item} />
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

        <section className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-slate-900">
              Dashboard Overview
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Welcome back. Here is the latest academic data for your assigned
              cohorts.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard key={card.label} card={card} />
            ))}
          </div>

          <section className="mt-8 overflow-hidden rounded-lg border border-gray-300/90 bg-[#f8f9ff]">
            <div className="flex items-center justify-between border-b border-gray-300/90 px-6 py-5">
              <h3 className="text-2xl font-semibold text-slate-900">
                Priority Student Roster
              </h3>
              <button className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 transition hover:text-teal-800">
                <Filter size={15} aria-hidden="true" />
                Filter & Sort
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[920px] w-full border-collapse text-left">
                <thead className="bg-blue-50/70 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Class</th>
                    <th className="px-6 py-4">GPA</th>
                    <th className="px-6 py-4">Attendance Rate</th>
                    <th className="px-6 py-4">Risk Level</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300/80 text-sm">
                  {students.map((student) => {
                    const isLowGpa = Number(student.gpa) < 2.5

                    return (
                      <tr key={student.id} className="hover:bg-white/70">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-xs font-semibold text-slate-900">
                              {student.initials}
                            </span>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {student.name}
                              </p>
                              <p className="mt-0.5 text-xs font-medium text-slate-500">
                                ID: {student.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">
                          {student.className}
                        </td>
                        <td
                          className={`px-6 py-4 font-semibold ${
                            isLowGpa ? 'text-red-700' : 'text-slate-900'
                          }`}
                        >
                          {student.gpa}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">
                          {student.attendance}
                        </td>
                        <td className="px-6 py-4">
                          <RiskBadge risk={student.risk} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="rounded-sm border border-teal-700 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-700 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-200">
                            View Profile
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}
