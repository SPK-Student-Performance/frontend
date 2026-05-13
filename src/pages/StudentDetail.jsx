import { useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Edit2,
  GraduationCap,
  RefreshCw,
  Shield,
  ShieldAlert,
  Trash2,
  TrendingUp,
  User,
  XCircle,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import AppShell from '../components/AppShell'
import StudentModal from '../components/StudentModal'
import { getStudentDetail, updateStudent, deleteStudent } from '../services/studentService'

const riskBadgeStyles = {
  High: 'border-red-300 bg-red-100 text-red-800',
  Medium: 'border-tertiary-300 bg-tertiary-100 text-tertiary-800',
  Low: 'border-emerald-300 bg-emerald-100 text-emerald-800',
}

const riskHeaderStyles = {
  High: 'from-red-50 to-red-100/40 border-red-200',
  Medium: 'from-tertiary-50 to-tertiary-100/40 border-tertiary-200',
  Low: 'from-emerald-50 to-emerald-100/40 border-emerald-200',
}

function ConfidenceGauge({ value }) {
  const pct = Math.round(value)
  const circ = 2 * Math.PI * 45
  const offset = circ - (pct / 100) * circ
  const color = pct >= 80 ? '#1E40AF' : pct >= 50 ? '#882D00' : '#ef4444'

  return (
    <div className="flex flex-col items-center">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r="45" fill="none" stroke="#EEF2FF" strokeWidth="11" />
        <circle cx="65" cy="65" r="45" fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 65 65)" className="transition-all duration-700 ease-out" />
        <text x="65" y="60" textAnchor="middle" className="font-heading text-2xl font-extrabold" fill="#0F1742">{pct}%</text>
        <text x="65" y="78" textAnchor="middle" className="text-[10px] font-semibold" fill="#6B75A2">Confidence</text>
      </svg>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value, tone = 'default' }) {
  const toneMap = {
    default: 'border-primary-200 bg-white',
    red: 'border-red-200 bg-red-50/60',
    green: 'border-emerald-200 bg-emerald-50/60',
    blue: 'border-primary-200 bg-primary-50/60',
  }
  return (
    <article className={`rounded-xl border p-4 ${toneMap[tone]}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100">
          <Icon size={17} className="text-primary-700" />
        </span>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-secondary-500">{label}</p>
          <p className="mt-0.5 text-base font-bold text-primary-950">{value}</p>
        </div>
      </div>
    </article>
  )
}

function FlagChip({ flag }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
      <ShieldAlert size={12} />{flag}
    </span>
  )
}

function InterventionRankCard({ intervention, index }) {
  const styles = [
    'border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100/50',
    'border-secondary-300 bg-gradient-to-br from-secondary-50 to-secondary-100/50',
    'border-tertiary-200 bg-gradient-to-br from-tertiary-50 to-tertiary-100/30',
  ]
  const icons = ['🥇', '🥈', '🥉']
  const cardStyle = styles[index] || 'border-primary-200 bg-white'

  return (
    <article className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${cardStyle}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icons[index] || `#${index + 1}`}</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-secondary-500">Rank #{intervention.rank}</p>
            <h4 className="mt-0.5 font-heading text-base font-bold text-primary-950">{intervention.intervensi_name}</h4>
            <p className="mt-1 text-xs font-semibold text-secondary-500">Code: {intervention.kode_intervensi}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-heading text-2xl font-extrabold text-primary-700">{(intervention.preference_score * 100).toFixed(1)}</p>
          <p className="text-[9px] font-bold text-secondary-400">TOPSIS Score</p>
        </div>
      </div>
    </article>
  )
}

function LoadingSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-8 w-32 animate-pulse rounded-xl bg-primary-100" />
      <div className="h-32 animate-pulse rounded-2xl bg-primary-100" />
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-2xl bg-primary-50 border border-primary-100 lg:col-span-2" />
        <div className="h-64 animate-pulse rounded-2xl bg-primary-50 border border-primary-100" />
      </div>
    </section>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
        <AlertCircle size={48} className="mb-4 text-red-400" />
        <h3 className="font-heading text-lg font-bold text-red-800">Gagal Memuat Detail Siswa</h3>
        <p className="mt-2 max-w-md text-sm text-red-600">{message}</p>
        <div className="mt-6 flex gap-3">
          <a href="#roster" className="inline-flex items-center gap-2 rounded-xl border border-secondary-300 px-5 py-2.5 text-sm font-semibold text-secondary-600 hover:bg-secondary-50">
            <ArrowLeft size={16} /> Back to Roster
          </a>
          <button onClick={onRetry} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700">
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    </section>
  )
}

export default function StudentDetail({ studentId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isNewAssessmentMode, setIsNewAssessmentMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(0)

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try { 
      const res = await getStudentDetail(studentId)
      setData(res)
      setActiveHistoryIndex(0) // Default to latest (index 0)
    }
    catch (err) { setError(err.message || 'Gagal memuat detail siswa.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [studentId])

  const handleUpdate = async (updatedData) => {
    setIsSubmitting(true)
    try {
      await updateStudent(studentId, updatedData, isNewAssessmentMode)
      setIsEditModalOpen(false)
      fetchData() // Refresh student data
    } catch (err) {
      alert(err.message || 'Gagal mengupdate data siswa')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus data siswa ini? Data dan riwayat tidak dapat dikembalikan.")) return
    
    try {
      await deleteStudent(studentId)
      window.location.hash = 'roster'
    } catch (err) {
      alert(err.message || 'Gagal menghapus data siswa')
    }
  }

  if (loading) return <AppShell activeView=""><LoadingSkeleton /></AppShell>
  if (error) return <AppShell activeView=""><ErrorState message={error} onRetry={fetchData} /></AppShell>

  const student = data?.student
  const interventions = data?.interventions || []
  const history = data?.history || []
  
  // Use active history prediction or fallback to data.prediction
  const prediction = history[activeHistoryIndex] || data?.prediction

  if (!student) return <AppShell activeView=""><ErrorState message="Data siswa tidak ditemukan." onRetry={fetchData} /></AppShell>

  const riskLevel = prediction?.risk_level || 'Unknown'
  const confidence = prediction?.confidence_pct || 0
  const riskProb = prediction?.risk_probability ? (prediction.risk_probability * 100).toFixed(1) : '0.0'
  const flags = Array.isArray(prediction?.flags) ? prediction.flags : []
  const modelConsistent = prediction?.model_consistent
  const uiStatus = prediction?.ui_status || riskLevel
  const riskStatus = prediction?.risk_status
  const initials = (student.student_identifier || 'XX').substring(0, 2).toUpperCase()

  // Prepare chart data (reverse to show chronological order)
  const chartData = [...history].reverse().map((h, i) => ({
    name: `T${i+1}`,
    risk: h.risk_probability * 100,
    date: new Date(h.created_at).toLocaleDateString(),
    originalIndex: history.length - 1 - i // Keep track of the original index in the 'history' array (which is DESC)
  }))

  const handleChartClick = (data) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clickedData = data.activePayload[0].payload
      setActiveHistoryIndex(clickedData.originalIndex)
    }
  }

  return (
    <AppShell activeView="">
      <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <a href="#roster" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary-500 transition hover:text-primary-700">
          <ArrowLeft size={16} /> Back to Student Roster
        </a>

        {/* Header Card */}
        <div className={`rounded-2xl border bg-gradient-to-r p-6 shadow-sm sm:p-8 ${riskHeaderStyles[riskLevel] || 'from-primary-50 to-primary-100/40 border-primary-200'}`}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-extrabold text-primary-950 shadow-sm">{initials}</div>
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-primary-950">
                  {student.student_identifier}
                  {activeHistoryIndex > 0 && <span className="ml-3 inline-flex items-center rounded-lg bg-white/60 px-2 py-0.5 text-xs font-bold text-secondary-700 border border-secondary-200">Viewing History: T{chartData.find(c => c.originalIndex === activeHistoryIndex)?.name.replace('T', '')}</span>}
                </h2>
                <p className="mt-1 text-sm text-secondary-600">ID: {student.student_id?.substring(0, 8)}...</p>
                {uiStatus && <p className="mt-1 text-sm font-semibold text-secondary-700">Status: {uiStatus}</p>}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <button onClick={() => { setIsNewAssessmentMode(true); setIsEditModalOpen(true); }} className="inline-flex items-center gap-1.5 rounded-lg border border-primary-700 bg-primary-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-800 transition shadow-sm">
                  <TrendingUp size={14} /> Add Assessment
                </button>
                <button onClick={() => { setIsNewAssessmentMode(false); setIsEditModalOpen(true); }} className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-white/50 px-3 py-1.5 text-xs font-bold text-primary-700 hover:bg-white transition">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={handleDelete} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white/50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-white transition">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
              <span className={`mt-2 inline-flex rounded-full border px-4 py-2 text-sm font-bold ${riskBadgeStyles[riskLevel] || 'border-secondary-300 bg-secondary-100 text-secondary-800'}`}>
                {riskLevel} Risk
              </span>
              <p className="text-sm font-semibold text-secondary-600">
                Risk Probability: <strong className="text-primary-950">{riskProb}%</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <h3 className="font-heading text-lg font-bold text-primary-950">Student Data</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoCard icon={User} label="Age" value={student.age} />
              <InfoCard icon={GraduationCap} label="Grade" value={student.grade} />
              <InfoCard icon={User} label="Gender" value={student.gender || 'N/A'} />
              <InfoCard icon={BookOpen} label="GPA" value={student.gpa != null ? Number(student.gpa).toFixed(2) : 'N/A'} tone={student.gpa != null && Number(student.gpa) < 2.5 ? 'red' : 'default'} />
              <InfoCard icon={Clock} label="Attendance" value={student.attendance_rate != null ? `${Number(student.attendance_rate).toFixed(1)}%` : 'N/A'} tone={student.attendance_rate != null && Number(student.attendance_rate) < 80 ? 'red' : 'green'} />
              <InfoCard icon={TrendingUp} label="Study Hours" value={`${student.study_hours || 0}h`} />
              <InfoCard icon={BookOpen} label="Math" value={Number(student.test_score_math || 0).toFixed(1)} />
              <InfoCard icon={BookOpen} label="Reading" value={Number(student.test_score_reading || 0).toFixed(1)} />
              <InfoCard icon={BookOpen} label="Science" value={Number(student.test_score_science || 0).toFixed(1)} />
            </div>

            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'School Type', value: student.school_type || 'N/A' },
                { label: 'Locale', value: student.locale || 'N/A' },
                { label: 'SES Quartile', value: student.ses_quartile || 'N/A' },
                { label: 'Parental Edu', value: student.parental_education || 'N/A' },
                { label: 'Internet', value: student.internet_access ? 'Yes' : 'No' },
                { label: 'Extracurricular', value: student.extracurricular ? 'Yes' : 'No' },
                { label: 'Part-Time Job', value: student.part_time_job ? 'Yes' : 'No' },
                { label: 'Parent Support', value: student.parent_support ? 'Yes' : 'No' },
              ].map((attr) => (
                <div key={attr.label} className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-secondary-500">{attr.label}</p>
                  <p className="mt-0.5 text-sm font-bold text-primary-950">{attr.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis & Trend */}
          <div className="space-y-4 lg:col-span-1">
            <h3 className="font-heading text-lg font-bold text-primary-950">AI Analysis</h3>
            <article className="rounded-2xl border border-primary-200 bg-white p-6 shadow-sm">
              <ConfidenceGauge value={confidence} />
              <div className="mt-5 space-y-2.5">
                {[
                  ['Risk Probability', `${riskProb}%`],
                  ['At-Risk', prediction?.is_at_risk ? 'Yes' : 'No'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-2.5">
                    <span className="text-xs font-semibold text-secondary-500">{k}</span>
                    <span className="text-sm font-bold text-primary-950">{v}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-2.5">
                  <span className="text-xs font-semibold text-secondary-500">Model Consistent</span>
                  <span className="flex items-center gap-1 text-sm font-bold">
                    {modelConsistent === true ? <><CheckCircle size={14} className="text-emerald-500" /><span className="text-emerald-700">Yes</span></> :
                     modelConsistent === false ? <><XCircle size={14} className="text-red-500" /><span className="text-red-700">No</span></> :
                     <span className="text-secondary-500">N/A</span>}
                  </span>
                </div>
                {riskStatus && (
                  <div className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-2.5">
                    <span className="text-xs font-semibold text-secondary-500">Risk Status</span>
                    <span className="text-sm font-bold text-primary-950">{riskStatus}</span>
                  </div>
                )}
              </div>
            </article>

            {/* Trend Chart */}
            {history.length > 1 && (
              <article className="mt-4 rounded-2xl border border-primary-200 bg-white p-5 shadow-sm">
                <h4 className="mb-3 font-heading text-sm font-bold text-primary-950">Risk Trend History</h4>
                <div className="h-40 w-full cursor-pointer">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} onClick={handleChartClick}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6EF" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8C94B5' }} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8C94B5' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ stroke: '#8C94B5', strokeWidth: 1, strokeDasharray: '3 3' }} />
                      <Line type="monotone" dataKey="risk" stroke="#1E40AF" strokeWidth={3} dot={{ fill: '#1E40AF', r: 4 }} activeDot={{ r: 6, stroke: '#1E40AF', strokeWidth: 2, fill: '#fff' }} name="Risk Probability (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>
            )}
          </div>
        </div>

        {/* Risk Flags */}
        {flags.length > 0 && (
          <section className="mt-6">
            <h3 className="font-heading mb-3 text-lg font-bold text-primary-950">
              <ShieldAlert size={18} className="mr-2 inline text-red-500" />Risk Flags ({flags.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {flags.map((f, i) => <FlagChip key={i} flag={f} />)}
            </div>
          </section>
        )}

        {/* TOPSIS Interventions */}
        {interventions.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <Award size={20} className="text-primary-700" />
              <h3 className="font-heading text-lg font-bold text-primary-950">TOPSIS Intervention Ranking</h3>
            </div>
            <p className="mb-4 text-sm text-secondary-600">Recommended interventions ranked by TOPSIS multi-criteria decision analysis score.</p>
            <div className="space-y-3">
              {interventions.sort((a, b) => a.rank - b.rank).map((intv, i) => (
                <InterventionRankCard key={intv.log_id || i} intervention={intv} index={i} />
              ))}
            </div>
          </section>
        )}

        {interventions.length === 0 && (
          <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 px-6 py-10 text-center">
            <Shield size={32} className="mx-auto mb-3 text-secondary-300" />
            <p className="text-sm font-semibold text-secondary-500">No intervention recommendations available for this student.</p>
          </section>
        )}

        <StudentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdate}
          initialData={student}
          loading={isSubmitting}
        />
      </section>
    </AppShell>
  )
}
