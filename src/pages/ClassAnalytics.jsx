import {
  Activity,
  AlertTriangle,
  BookOpen,
  Calculator,
  FlaskConical,
  GraduationCap,
  TrendingUp,
  Users,
} from 'lucide-react'
import AppShell from '../components/AppShell'

const metricCards = [
  {
    label: 'Avg. GPA',
    value: '3.14',
    detail: 'Out of 4.0 Scale',
    trend: '+0.3',
    icon: GraduationCap,
    tone: 'teal',
  },
  {
    label: 'Avg. Attendance',
    value: '94.2%',
    detail: 'semester average',
    trend: '+2.1%',
    icon: Activity,
    tone: 'blue',
    progress: 94,
  },
  {
    label: 'Total Students',
    value: '142',
    detail: '+3 this semester',
    trend: '+3',
    icon: Users,
    tone: 'violet',
  },
  {
    label: 'At-Risk Identified',
    value: '12',
    detail: 'Requires immediate attention',
    trend: '-2',
    icon: AlertTriangle,
    tone: 'red',
  },
]

const subjects = [
  {
    label: 'Mathematics',
    students: 124,
    percent: 87,
    icon: Calculator,
  },
  {
    label: 'Science',
    students: 118,
    percent: 82,
    icon: FlaskConical,
  },
  {
    label: 'Reading',
    students: 130,
    percent: 91,
    icon: BookOpen,
  },
  {
    label: 'History',
    students: 111,
    percent: 78,
    icon: BookOpen,
  },
]

const alerts = [
  {
    name: 'Marcus Johnson',
    issue: 'Consecutive absences',
    time: '2 hours ago',
    className: 'border-red-200 bg-red-50',
  },
  {
    name: 'Sarah Chen',
    issue: 'Low midterm score',
    time: '5 hours ago',
    className: 'border-orange-200 bg-orange-50',
  },
]

const topClasses = [
  {
    name: 'AP Calculus',
    teacher: 'Dr. Smith',
    gpa: '3.9',
    lift: '+8%',
  },
  {
    name: 'Physics Honors',
    teacher: 'Ms. Johnson',
    gpa: '3.7',
    lift: '+5%',
  },
]

const toneClasses = {
  teal: 'bg-teal-50 text-teal-700',
  blue: 'bg-blue-50 text-blue-700',
  violet: 'bg-violet-50 text-violet-700',
  red: 'bg-red-50 text-red-700',
}

function MetricCard({ metric }) {
  const Icon = metric.icon
  const isRiskCard = metric.tone === 'red'

  return (
    <article
      className={`rounded-xl border bg-white p-6 shadow-sm ${
        isRiskCard ? 'border-red-200 bg-red-50/40' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneClasses[metric.tone]}`}
        >
          <Icon size={18} aria-hidden="true" />
        </span>
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium ${
            isRiskCard ? 'text-red-600' : 'text-emerald-600'
          }`}
        >
          <TrendingUp size={13} aria-hidden="true" />
          {metric.trend}
        </span>
      </div>
      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
          {metric.label}
        </p>
        <p className="mt-1 text-3xl font-bold text-slate-900">
          {metric.value}
        </p>
        {metric.progress ? (
          <div className="mt-4 h-2 rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-teal-500"
              style={{ width: `${metric.progress}%` }}
            />
          </div>
        ) : (
          <p className="mt-1 text-xs text-slate-500">{metric.detail}</p>
        )}
      </div>
    </article>
  )
}

function PerformanceTrend() {
  const points = [
    [40, 104],
    [154, 98],
    [268, 108],
    [382, 92],
    [496, 85],
    [610, 75],
  ]

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="flex flex-col gap-3 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Performance Trends
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            6-month academic performance overview
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
            GPA
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            Attendance
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            Behavioral Risk
          </span>
        </div>
      </header>
      <div className="px-6 py-6">
        <svg
          viewBox="0 0 680 220"
          className="h-64 w-full"
          role="img"
          aria-label="Performance trends chart"
        >
          {[0, 1, 2, 3, 4].map((line) => (
            <line
              key={line}
              x1="40"
              x2="650"
              y1={36 + line * 34}
              y2={36 + line * 34}
              stroke="#e5e7eb"
              strokeDasharray="3 4"
            />
          ))}
          <line x1="40" x2="650" y1="172" y2="172" stroke="#9ca3af" />
          <line x1="40" x2="40" y1="36" y2="172" stroke="#9ca3af" />
          <polyline
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            points={points.map((point) => point.join(',')).join(' ')}
          />
          {points.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#f97316" />
          ))}
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
            <text
              key={month}
              x={40 + index * 114}
              y="202"
              textAnchor="middle"
              className="fill-slate-500 text-[12px]"
            >
              {month}
            </text>
          ))}
          {[4, 3, 2, 1].map((label, index) => (
            <text
              key={label}
              x="24"
              y={40 + index * 34}
              textAnchor="middle"
              className="fill-slate-500 text-[12px]"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
    </section>
  )
}

function RiskDistribution() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-100 px-6 py-5">
        <h3 className="text-lg font-bold text-slate-900">
          Risk Distribution
        </h3>
        <p className="mt-1 text-sm text-slate-500">Current student risk levels</p>
      </header>
      <div className="flex flex-col items-center gap-5 px-6 py-7">
        <div
          className="grid h-44 w-44 place-items-center rounded-full"
          style={{
            background:
              'conic-gradient(#10b981 0deg 214deg, #3b82f6 214deg 297deg, #ef4444 297deg 360deg)',
          }}
        >
          <div className="grid h-28 w-28 place-items-center rounded-full bg-white">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">142</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </div>
        </div>
        <div className="w-full space-y-3 text-sm">
          {[
            ['Safe', 98, '60%', 'bg-emerald-500'],
            ['Monitoring', 32, '23%', 'bg-blue-500'],
            ['At-Risk', 12, '8%', 'bg-red-500'],
          ].map(([label, count, percent, color]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600">
                <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                {label}
              </span>
              <span className="font-medium text-slate-700">
                {count}{' '}
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-slate-500">
                  {percent}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SubjectBreakdown() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-100 px-6 py-5">
        <h3 className="text-lg font-bold text-slate-900">
          Subject Performance Breakdown
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Average class performance by subject area
        </p>
      </header>
      <div className="space-y-6 px-6 py-7">
        {subjects.map((subject) => {
          const Icon = subject.icon

          return (
            <div key={subject.label}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Icon size={22} className="text-slate-500" aria-hidden="true" />
                  <div>
                    <p className="font-bold text-slate-900">{subject.label}</p>
                    <p className="text-xs text-slate-500">
                      {subject.students} students enrolled
                    </p>
                  </div>
                </div>
                <span className="rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                  {subject.percent}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600"
                  style={{ width: `${subject.percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function RecentAlerts() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-100 px-6 py-5">
        <h3 className="text-lg font-bold text-slate-900">Recent Alerts</h3>
        <p className="mt-1 text-sm text-slate-500">Latest risk notifications</p>
      </header>
      <div className="space-y-4 px-6 py-5">
        {alerts.map((alert) => (
          <article
            key={alert.name}
            className={`rounded-lg border px-4 py-3 ${alert.className}`}
          >
            <p className="font-bold text-slate-900">{alert.name}</p>
            <p className="mt-1 text-sm text-slate-600">{alert.issue}</p>
            <p className="mt-2 text-xs text-slate-500">{alert.time}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function TopClasses() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-100 px-6 py-5">
        <h3 className="text-lg font-bold text-slate-900">
          Top Performing Classes
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Highest achieving classes this semester
        </p>
      </header>
      <div className="grid gap-4 px-6 py-6 lg:grid-cols-2">
        {topClasses.map((classItem) => (
          <article
            key={classItem.name}
            className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-teal-50 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900">{classItem.name}</h4>
                <p className="mt-1 text-sm text-slate-500">
                  {classItem.teacher}
                </p>
              </div>
              <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                {classItem.lift}
              </span>
            </div>
            <p className="mt-5 text-3xl font-bold text-teal-600">
              {classItem.gpa}
            </p>
            <p className="text-xs text-slate-500">Average GPA</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function ClassAnalytics() {
  return (
    <AppShell activeView="analytics">
      <section className="mx-auto w-full max-w-[1720px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-7">
          <h2 className="text-3xl font-bold text-slate-900">
            Class Analytics
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Comprehensive performance insights across all assigned cohorts
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
          <PerformanceTrend />
          <RiskDistribution />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
          <SubjectBreakdown />
          <RecentAlerts />
        </div>

        <div className="mt-6">
          <TopClasses />
        </div>
      </section>
    </AppShell>
  )
}
