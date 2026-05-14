import { useEffect, useState } from 'react'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  GraduationCap,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  Users,
} from 'lucide-react'
import AppShell from '../components/AppShell'
import { getDashboardSummary } from '../services/dashboardService'
import { checkAiHealth } from '../services/uploadService'

const toneClasses = {
  teal: 'bg-primary-50 text-primary-700',
  blue: 'bg-primary-100 text-primary-800',
  violet: 'bg-secondary-100 text-secondary-700',
  red: 'bg-red-50 text-red-700',
}

function MetricCard({ metric }) {
  const Icon = metric.icon
  const isRiskCard = metric.tone === 'red'

  return (
    <article className={`rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${isRiskCard ? 'border-red-200 bg-red-50/30' : 'border-primary-200'}`}>
      <div className="flex items-start justify-between gap-4">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneClasses[metric.tone]}`}>
          <Icon size={18} />
        </span>
        {metric.trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-bold ${isRiskCard ? 'text-red-600' : 'text-emerald-600'}`}>
            <TrendingUp size={13} />{metric.trend}
          </span>
        )}
      </div>
      <div className="mt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-secondary-500">{metric.label}</p>
        <p className="mt-1 font-heading text-3xl font-extrabold text-primary-950">{metric.value}</p>
        {metric.progress ? (
          <div className="mt-4 h-2 rounded-full bg-primary-100">
            <div className="h-full rounded-full bg-primary-700" style={{ width: `${metric.progress}%` }} />
          </div>
        ) : (
          <p className="mt-1 text-xs text-secondary-500">{metric.detail}</p>
        )}
      </div>
    </article>
  )
}

function RiskDistribution({ distribution, total }) {
  const h = distribution?.high || 0, m = distribution?.medium || 0, l = distribution?.low || 0
  const sum = h + m + l || 1
  const hDeg = (h / sum) * 360, mDeg = (m / sum) * 360

  return (
    <section className="rounded-2xl border border-primary-200 bg-white shadow-sm">
      <header className="border-b border-primary-100 px-6 py-5">
        <h3 className="font-heading text-lg font-bold text-primary-950">Risk Distribution</h3>
        <p className="mt-1 text-sm text-secondary-500">Current student risk levels</p>
      </header>
      <div className="flex flex-col items-center gap-5 px-6 py-7">
        <div className="grid h-44 w-44 place-items-center rounded-full"
          style={{ background: `conic-gradient(#ef4444 0deg ${hDeg}deg, #882D00 ${hDeg}deg ${hDeg + mDeg}deg, #10b981 ${hDeg + mDeg}deg 360deg)` }}>
          <div className="grid h-28 w-28 place-items-center rounded-full bg-white">
            <div className="text-center">
              <p className="font-heading text-3xl font-extrabold text-primary-950">{total}</p>
              <p className="text-xs font-semibold text-secondary-500">Total</p>
            </div>
          </div>
        </div>
        <div className="w-full space-y-3 text-sm">
          {[
            ['High Risk', h, `${total > 0 ? Math.round((h / total) * 100) : 0}%`, 'bg-red-500'],
            ['Medium Risk', m, `${total > 0 ? Math.round((m / total) * 100) : 0}%`, 'bg-tertiary-700'],
            ['Low Risk', l, `${total > 0 ? Math.round((l / total) * 100) : 0}%`, 'bg-emerald-500'],
          ].map(([label, count, pct, color]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-secondary-600"><span className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</span>
              <span className="font-semibold text-primary-950">{count} <span className="ml-2 rounded-full bg-primary-50 px-2 py-0.5 text-xs text-secondary-500">{pct}</span></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AiHealthCard({ aiHealth }) {
  const isOnline = aiHealth?.status === 'online'
  return (
    <section className="rounded-2xl border border-primary-200 bg-white shadow-sm">
      <header className="border-b border-primary-100 px-6 py-5">
        <h3 className="font-heading text-lg font-bold text-primary-950">AI Model Status</h3>
        <p className="mt-1 text-sm text-secondary-500">External prediction service health</p>
      </header>
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isOnline ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {isOnline ? <Activity size={24} className="text-emerald-600" /> : <AlertCircle size={24} className="text-red-600" />}
          </span>
          <div className="min-w-0">
            <p className={`font-heading text-lg font-bold ${isOnline ? 'text-emerald-700' : 'text-red-700'}`}>{isOnline ? 'Online' : 'Offline'}</p>
            <p className="break-words text-sm text-secondary-500">{isOnline ? aiHealth?.message || 'AI Model is healthy' : aiHealth?.error || 'AI Model is unavailable'}</p>
          </div>
        </div>
        {isOnline && aiHealth?.ai_info && (
          <div className="mt-4 space-y-2">
            {Object.entries(aiHealth.ai_info).map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-3 rounded-xl bg-primary-50 px-3 py-2">
                <span className="shrink-0 text-xs font-semibold text-secondary-500">{k}</span>
                <span className="min-w-0 break-all text-right text-xs font-bold text-primary-950">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function TopRiskStudents({ students }) {
  const riskStudents = students.filter((s) => s.prediction?.risk_level === 'High').slice(0, 5)

  return (
    <section className="rounded-2xl border border-primary-200 bg-white shadow-sm">
      <header className="border-b border-primary-100 px-6 py-5">
        <h3 className="font-heading text-lg font-bold text-primary-950">Top Risk Students</h3>
        <p className="mt-1 text-sm text-secondary-500">Students requiring immediate attention</p>
      </header>
      <div className="px-6 py-5">
        {riskStudents.length === 0 ? (
          <p className="py-6 text-center text-sm text-secondary-500">No high-risk students found.</p>
        ) : (
          <div className="space-y-3">
            {riskStudents.map((item) => {
              const s = item.student, p = item.prediction
              return (
                <a key={s?.student_id} href={`#student/${s?.student_id}`} className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 transition hover:bg-red-100">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-primary-950">{s?.student_identifier || 'Unknown'}</p>
                    <p className="mt-0.5 text-xs text-secondary-600">Grade {s?.grade} • Risk: {p?.risk_probability ? (p.risk_probability * 100).toFixed(1) : 0}%</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-red-200 px-2.5 py-1 text-xs font-bold text-red-800">High</span>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function LoadingSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[1720px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="mb-7">
        <div className="h-9 w-48 animate-pulse rounded-xl bg-primary-100" />
        <div className="mt-3 h-5 w-80 animate-pulse rounded-xl bg-primary-100" />
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-36 animate-pulse rounded-2xl border border-primary-100 bg-primary-50" />)}
      </div>
    </section>
  )
}

export default function ClassAnalytics() {
  const [data, setData] = useState(null)
  const [aiHealth, setAiHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true); setError('')
    try {
      const [dr, hr] = await Promise.allSettled([getDashboardSummary(), checkAiHealth()])
      if (dr.status === 'fulfilled') setData(dr.value); else throw dr.reason
      setAiHealth(hr.status === 'fulfilled' ? hr.value : { status: 'down', error: 'Cannot reach AI service' })
    } catch (err) { setError(err.message || 'Gagal memuat data analytics.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) return <AppShell activeView="analytics"><LoadingSkeleton /></AppShell>
  if (error) return (
    <AppShell activeView="analytics">
      <section className="mx-auto w-full max-w-[1720px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
          <AlertCircle size={48} className="mb-4 text-red-400" />
          <h3 className="font-heading text-lg font-bold text-red-800">Gagal Memuat Analytics</h3>
          <p className="mt-2 max-w-md text-sm text-red-600">{error}</p>
          <button onClick={fetchData} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"><RefreshCw size={16} /> Coba Lagi</button>
        </div>
      </section>
    </AppShell>
  )

  const summary = data?.summary || {}, students = data?.students || []
  const distribution = summary.risk_distribution || {}

  // Aggregate flags
  const flagCounts = {}
  students.forEach((s) => {
    const flags = s.prediction?.flags
    if (Array.isArray(flags)) flags.forEach((f) => { if (typeof f === 'string') flagCounts[f] = (flagCounts[f] || 0) + 1 })
  })
  const topFlags = Object.entries(flagCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)

  const metricCards = [
    { label: 'Avg. GPA', value: summary.average_gpa?.toFixed(2) || '0.00', detail: 'Out of 4.0 Scale', icon: GraduationCap, tone: 'teal' },
    { label: 'Avg. Attendance', value: `${summary.average_attendance_pct?.toFixed(1) || '0.0'}%`, detail: 'semester average', icon: Activity, tone: 'blue', progress: parseFloat(summary.average_attendance_pct?.toFixed(1) || '0') },
    { label: 'Total Students', value: String(summary.total_students || 0), detail: 'Active in system', icon: Users, tone: 'violet' },
    { label: 'At-Risk Identified', value: String(summary.total_at_risk || 0), detail: 'Requires immediate attention', icon: AlertTriangle, tone: 'red' },
  ]

  return (
    <AppShell activeView="analytics">
      <section className="mx-auto w-full max-w-[1720px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-7">
          <h2 className="font-heading text-3xl font-extrabold text-primary-950">Class Analytics</h2>
          <p className="mt-2 text-base text-secondary-600">Comprehensive performance insights across all assigned cohorts</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((m) => <MetricCard key={m.label} metric={m} />)}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <RiskDistribution distribution={distribution} total={summary.total_students || 0} />
          <AiHealthCard aiHealth={aiHealth} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
          {/* Top Flags */}
          <section className="rounded-2xl border border-primary-200 bg-white shadow-sm">
            <header className="border-b border-primary-100 px-6 py-5">
              <h3 className="font-heading text-lg font-bold text-primary-950">Top Risk Flags</h3>
              <p className="mt-1 text-sm text-secondary-500">Most common risk indicators across all students</p>
            </header>
            <div className="px-6 py-6">
              {topFlags.length > 0 ? (
                <div className="space-y-4">
                  {topFlags.map(([flag, count]) => {
                    const pct = students.length > 0 ? Math.round((count / students.length) * 100) : 0
                    return (
                      <div key={flag}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-2"><ShieldAlert size={14} className="text-red-500" /><span className="text-sm font-bold text-primary-950">{flag}</span></div>
                          <span className="text-xs font-semibold text-secondary-500">{count} students ({pct}%)</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-primary-100">
                          <div className="h-full rounded-full bg-gradient-to-r from-tertiary-400 to-tertiary-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-secondary-500">No risk flag data available yet.</p>
              )}
            </div>
          </section>

          <TopRiskStudents students={students} />
        </div>
      </section>
    </AppShell>
  )
}
