import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ChevronDown,
  Filter,
  GraduationCap,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  Upload,
  UserRoundCheck,
  Users,
} from 'lucide-react'
import AppShell from '../components/AppShell'
import { getDashboardSummary } from '../services/dashboardService'

const riskStyles = {
  High: 'bg-red-100 text-red-800 border border-red-200',
  Medium: 'bg-tertiary-100 text-tertiary-800 border border-tertiary-200',
  Low: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
}

function FilterSelect({ label, options, value, onChange }) {
  return (
    <label className="relative block min-w-0">
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-10 w-full appearance-none rounded-xl bg-white px-3.5 pr-9 text-sm font-bold text-primary-950 outline-none ring-1 ring-primary-200 transition hover:ring-primary-300 focus:ring-2 focus:ring-primary-300"
      >
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute bottom-3 right-3 text-secondary-400" />
    </label>
  )
}

function SummaryCard({ card }) {
  const Icon = card.icon
  const isRed = card.tone === 'red'
  const isAttendance = card.label === 'Avg. Attendance'

  return (
    <article
      className={`relative flex min-h-40 flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-sm transition hover:shadow-md ${
        isRed
          ? 'border-red-200 bg-gradient-to-br from-red-50 to-red-100/40'
          : 'border-primary-200 bg-white'
      }`}
    >
      <div className="relative flex items-start justify-between gap-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-600">
          {card.label}
        </p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            isRed ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-700'
          }`}
        >
          <Icon size={17} aria-hidden="true" />
        </span>
      </div>
      <div className="relative">
        <p className="font-heading text-4xl font-extrabold leading-none text-primary-950">
          {card.value}
        </p>
        {isAttendance && card.progress !== undefined ? (
          <div className="mt-5 h-2 rounded-full bg-primary-100">
            <div
              className="h-full rounded-full bg-primary-700"
              style={{ width: `${Math.min(card.progress, 100)}%` }}
            />
          </div>
        ) : (
          <p className={`mt-3 flex items-center gap-1 text-xs font-semibold ${
            isRed ? 'text-red-600' : 'text-secondary-500'
          }`}>
            {!isRed && card.tone !== 'neutral' ? (
              <TrendingUp size={13} aria-hidden="true" />
            ) : null}
            {card.detail}
          </p>
        )}
      </div>
    </article>
  )
}

function RiskBadge({ risk }) {
  const style = riskStyles[risk] || 'bg-secondary-100 text-secondary-700 border border-secondary-200'
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${style}`}>
      {risk}
    </span>
  )
}

function PriorityStudentCard({ item }) {
  const student = item.student
  const prediction = item.prediction
  const gpa = student?.gpa != null ? Number(student.gpa).toFixed(2) : 'N/A'
  const attendance = student?.attendance_rate != null ? `${Number(student.attendance_rate).toFixed(1)}%` : 'N/A'
  const confidence = prediction?.confidence_pct != null ? `${Number(prediction.confidence_pct).toFixed(1)}%` : 'N/A'
  const riskLevel = prediction?.risk_level || 'Unknown'
  const initials = (student?.student_identifier || 'XX').substring(0, 2).toUpperCase()
  const isLowGpa = student?.gpa != null && Number(student.gpa) < 2.5

  return (
    <article className="rounded-2xl border border-primary-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-xs font-bold text-primary-700">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-primary-950">{student?.student_identifier || 'Unknown'}</p>
            <p className="mt-0.5 text-xs text-secondary-500">Grade {student?.grade} - Age {student?.age}</p>
          </div>
        </div>
        <RiskBadge risk={riskLevel} />
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-primary-50 px-2 py-2">
          <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-secondary-500">GPA</dt>
          <dd className={`mt-1 text-sm font-bold ${isLowGpa ? 'text-red-600' : 'text-primary-950'}`}>{gpa}</dd>
        </div>
        <div className="rounded-xl bg-primary-50 px-2 py-2">
          <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-secondary-500">Attend</dt>
          <dd className="mt-1 text-sm font-bold text-primary-950">{attendance}</dd>
        </div>
        <div className="rounded-xl bg-primary-50 px-2 py-2">
          <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-secondary-500">Conf.</dt>
          <dd className="mt-1 text-sm font-bold text-primary-950">{confidence}</dd>
        </div>
      </dl>
      <a
        href={`#student/${student?.student_id}`}
        className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl border border-primary-700 px-3.5 text-xs font-bold uppercase tracking-[0.1em] text-primary-700 transition hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
      >
        View Profile
      </a>
    </article>
  )
}

function LoadingSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="mb-8">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-primary-100" />
        <div className="mt-3 h-5 w-96 animate-pulse rounded-xl bg-primary-100" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl border border-primary-100 bg-primary-50" />
        ))}
      </div>
      <div className="mt-8 animate-pulse rounded-2xl border border-primary-100 bg-primary-50 p-6">
        <div className="h-6 w-48 rounded bg-primary-100" />
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-primary-100" />
          ))}
        </div>
      </div>
    </section>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
        <AlertCircle size={48} className="mb-4 text-red-400" />
        <h3 className="font-heading text-lg font-bold text-red-800">Gagal Memuat Data</h3>
        <p className="mt-2 max-w-md text-sm text-red-600">{message}</p>
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
        >
          <RefreshCw size={16} /> Coba Lagi
        </button>
      </div>
    </section>
  )
}

function EmptyState() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="mb-8">
        <h2 className="font-heading text-4xl font-extrabold text-primary-950">Dashboard Overview</h2>
        <p className="mt-2 text-base text-secondary-600">Welcome back. Start by uploading student data.</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-primary-200 bg-white px-6 py-16 text-center shadow-sm">
        <Upload size={48} className="mb-4 text-primary-300" />
        <h3 className="font-heading text-lg font-bold text-primary-950">Belum Ada Data Siswa</h3>
        <p className="mt-2 max-w-md text-sm text-secondary-500">
          Upload file CSV data siswa terlebih dahulu untuk mulai menggunakan sistem analisis risiko AI.
        </p>
        <a
          href="#upload"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary-700/25 transition hover:bg-primary-800"
        >
          Upload CSV Sekarang
        </a>
      </div>
    </section>
  )
}

export default function TeacherDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [gradeFilter, setGradeFilter] = useState('All Classes')
  const [genderFilter, setGenderFilter] = useState('All Genders')

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getDashboardSummary()
      setData(result)
    } catch (err) {
      setError(err.message || 'Gagal memuat data dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const summary = data?.summary
  const students = data?.students || []

  const gradeOptions = useMemo(() => {
    const grades = Array.from(new Set(students.map((item) => item.student?.grade).filter((grade) => grade != null)))
      .sort((a, b) => Number(a) - Number(b))
      .map((grade) => `Class ${grade}`)
    return ['All Classes', ...grades]
  }, [students])

  const genderOptions = useMemo(() => {
    const genders = Array.from(new Set(students.map((item) => item.student?.gender).filter(Boolean))).sort()
    return ['All Genders', ...genders]
  }, [students])

  const filteredStudents = useMemo(() => {
    return students.filter((item) => {
      const selectedGrade = gradeFilter.replace('Class ', '')
      const matchesGrade = gradeFilter === 'All Classes' || String(item.student?.grade) === selectedGrade
      const matchesGender = genderFilter === 'All Genders' || item.student?.gender === genderFilter
      return matchesGrade && matchesGender
    })
  }, [students, gradeFilter, genderFilter])

  const filteredSummary = useMemo(() => {
    const total = filteredStudents.length
    const riskDistribution = filteredStudents.reduce((acc, item) => {
      const level = item.prediction?.risk_level
      if (level === 'High') acc.high += 1
      else if (level === 'Medium') acc.medium += 1
      else if (level === 'Low') acc.low += 1
      return acc
    }, { high: 0, medium: 0, low: 0 })

    const numericAverage = (items, getter) => {
      const values = items
        .map(getter)
        .filter((value) => value != null && value !== '' && !Number.isNaN(Number(value)))
        .map(Number)
      if (values.length === 0) return 0
      return values.reduce((sum, value) => sum + value, 0) / values.length
    }

    const totalAtRisk = filteredStudents.filter((item) => (
      item.prediction?.is_at_risk === true ||
      item.prediction?.risk_level === 'High' ||
      item.prediction?.risk_level === 'Medium'
    )).length

    return {
      total_students: total,
      total_at_risk: totalAtRisk,
      average_gpa: numericAverage(filteredStudents, (item) => item.student?.gpa),
      average_attendance_pct: numericAverage(filteredStudents, (item) => item.student?.attendance_rate),
      risk_distribution: riskDistribution,
    }
  }, [filteredStudents])

  const avgGpa = filteredSummary.average_gpa.toFixed(2)
  const avgAttendance = filteredSummary.average_attendance_pct.toFixed(1)
  const activeFilterText = [gradeFilter, genderFilter]
    .filter((value) => value !== 'All Classes' && value !== 'All Genders')
    .join(' / ')

  const summaryCards = [
    { label: 'Total Students', value: String(filteredSummary.total_students), detail: 'Active in selected view', icon: Users, tone: 'blue' },
    { label: 'At-Risk Identified', value: String(filteredSummary.total_at_risk), detail: 'Requires immediate attention', icon: ShieldAlert, tone: 'red' },
    { label: 'Avg. Attendance', value: `${avgAttendance}%`, detail: 'progress', icon: UserRoundCheck, tone: 'blue', progress: parseFloat(avgAttendance) },
    { label: 'Avg. GPA', value: avgGpa, detail: 'Out of 4.0 Scale', icon: GraduationCap, tone: 'neutral' },
  ]

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const riskOrder = { High: 0, Medium: 1, Low: 2 }
    const aRisk = riskOrder[a.prediction?.risk_level] ?? 3
    const bRisk = riskOrder[b.prediction?.risk_level] ?? 3
    if (aRisk !== bRisk) return aRisk - bRisk
    return (b.prediction?.risk_probability || 0) - (a.prediction?.risk_probability || 0)
  })
  const priorityStudents = sortedStudents.slice(0, 10)

  if (loading) return <AppShell activeView="dashboard"><LoadingSkeleton /></AppShell>
  if (error) return <AppShell activeView="dashboard"><ErrorState message={error} onRetry={fetchData} /></AppShell>

  if (!summary || summary.total_students === 0) {
    return <AppShell activeView="dashboard"><EmptyState /></AppShell>
  }

  return (
    <AppShell activeView="dashboard">
      <section className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-8">
          <h2 className="font-heading text-4xl font-extrabold text-primary-950">Dashboard Overview</h2>
          <p className="mt-2 text-base text-secondary-600">Welcome back. Here is the latest academic data for your assigned cohorts.</p>
        </div>

        <section className="mb-6 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-primary-700" />
                <h3 className="font-heading text-base font-bold text-primary-950">Dashboard Filters</h3>
              </div>
              <p className="mt-1 text-sm text-secondary-600">
                {activeFilterText ? `Showing insight for ${activeFilterText}.` : 'Showing insight for all classes and genders.'}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
              <FilterSelect label="Class" options={gradeOptions} value={gradeFilter} onChange={setGradeFilter} />
              <FilterSelect label="Gender" options={genderOptions} value={genderFilter} onChange={setGenderFilter} />
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => <SummaryCard key={card.label} card={card} />)}
        </div>

        {/* Risk Distribution Bar */}
        {filteredSummary.risk_distribution && (
          <section className="mt-8 rounded-2xl border border-primary-200 bg-white p-6 shadow-sm">
            <h3 className="font-heading mb-4 text-base font-bold text-primary-950">Risk Distribution</h3>
            <div className="flex flex-wrap gap-6">
              {[
                { label: 'High Risk', count: filteredSummary.risk_distribution.high, color: 'bg-red-500', text: 'text-red-700' },
                { label: 'Medium Risk', count: filteredSummary.risk_distribution.medium, color: 'bg-tertiary-500', text: 'text-tertiary-700' },
                { label: 'Low Risk', count: filteredSummary.risk_distribution.low, color: 'bg-emerald-500', text: 'text-emerald-700' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span className={`text-sm font-semibold ${item.text}`}>
                    {item.label}: <strong>{item.count}</strong>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Priority Student Table */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-primary-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-primary-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <h3 className="font-heading text-xl font-bold text-primary-950">Priority Student Roster</h3>
            <a href="#roster" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition hover:text-primary-800">
              <Filter size={15} /> View All Students
            </a>
          </div>
          <div className="space-y-3 bg-primary-50/40 p-4 md:hidden">
            {priorityStudents.map((item) => (
              <PriorityStudentCard key={item.student?.student_id} item={item} />
            ))}
            {priorityStudents.length === 0 && (
              <div className="rounded-2xl border border-primary-200 bg-white px-6 py-10 text-center text-sm font-medium text-secondary-500">
                No student data available yet.
              </div>
            )}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-[920px] w-full border-collapse text-left">
              <thead className="bg-primary-50 text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-600">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">GPA</th>
                  <th className="px-6 py-4">Attendance Rate</th>
                  <th className="px-6 py-4">Confidence</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="min-w-[150px] px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100 text-sm">
                {priorityStudents.map((item) => {
                  const student = item.student
                  const prediction = item.prediction
                  const gpa = student?.gpa != null ? Number(student.gpa).toFixed(2) : 'N/A'
                  const attendance = student?.attendance_rate != null ? `${Number(student.attendance_rate).toFixed(1)}%` : 'N/A'
                  const confidence = prediction?.confidence_pct != null ? `${Number(prediction.confidence_pct).toFixed(1)}%` : 'N/A'
                  const riskLevel = prediction?.risk_level || 'Unknown'
                  const initials = (student?.student_identifier || 'XX').substring(0, 2).toUpperCase()
                  const isLowGpa = student?.gpa != null && Number(student.gpa) < 2.5

                  return (
                    <tr key={student?.student_id} className="hover:bg-primary-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-xs font-bold text-primary-700">
                            {initials}
                          </span>
                          <div>
                            <p className="font-semibold text-primary-950">{student?.student_identifier || 'Unknown'}</p>
                            <p className="mt-0.5 text-xs text-secondary-500">Grade {student?.grade} • Age {student?.age}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 font-bold ${isLowGpa ? 'text-red-600' : 'text-primary-950'}`}>{gpa}</td>
                      <td className="px-6 py-4 font-medium text-secondary-600">{attendance}</td>
                      <td className="px-6 py-4 font-medium text-secondary-600">{confidence}</td>
                      <td className="px-6 py-4"><RiskBadge risk={riskLevel} /></td>
                      <td className="min-w-[150px] px-6 py-4 text-right">
                        <a
                          href={`#student/${student?.student_id}`}
                          className="inline-flex whitespace-nowrap rounded-xl border border-primary-700 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-primary-700 transition hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
                        >
                          View Profile
                        </a>
                      </td>
                    </tr>
                  )
                })}
                {priorityStudents.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm font-medium text-secondary-500">No student data available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </AppShell>
  )
}
