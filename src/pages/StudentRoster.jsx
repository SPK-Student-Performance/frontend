import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import AppShell from '../components/AppShell'
import StudentModal from '../components/StudentModal'
import { getStudents, addStudent, deleteAllStudents } from '../services/studentService'

const riskClasses = {
  High: 'border-red-200 bg-red-100 text-red-700',
  Medium: 'border-tertiary-200 bg-tertiary-100 text-tertiary-700',
  Low: 'border-emerald-200 bg-emerald-100 text-emerald-700',
}

function scoreTone(score) {
  if (score >= 80) return { text: 'text-red-600', bar: 'bg-red-500' }
  if (score >= 50) return { text: 'text-tertiary-600', bar: 'bg-tertiary-500' }
  return { text: 'text-emerald-600', bar: 'bg-emerald-500' }
}

function FilterSelect({ label, options, value, onChange }) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-xl bg-white px-3.5 pr-9 text-sm font-medium text-secondary-700 outline-none ring-1 ring-transparent transition hover:ring-primary-200 focus:ring-2 focus:ring-primary-300"
      >
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400" />
    </label>
  )
}

function PriorityScore({ score }) {
  const tone = scoreTone(score)
  return (
    <div className="flex min-w-0 items-center gap-3 sm:min-w-[200px]">
      <div className="w-14 shrink-0 whitespace-nowrap">
        <span className={`text-xl font-extrabold ${tone.text}`}>{Math.round(score)}</span>
        <span className="ml-0.5 text-xs text-secondary-400">%</span>
      </div>
      <div className="h-2 flex-1 rounded-full bg-primary-100">
        <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${Math.min(score, 100)}%` }} />
      </div>
    </div>
  )
}

function RiskBadge({ risk }) {
  const style = riskClasses[risk] || 'border-secondary-200 bg-secondary-100 text-secondary-700'
  return <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold ${style}`}>{risk}</span>
}

function PaginationControls({ currentPage, totalPages, itemsPerPage, totalItems, onPrevious, onNext }) {
  return (
    <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-primary-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-secondary-500">
        Showing <span className="font-bold text-primary-950">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-primary-950">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-bold text-primary-950">{totalItems}</span> results
      </p>
      <div className="flex gap-2 self-end sm:self-auto">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-secondary-200 text-secondary-600 transition hover:bg-primary-50 disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-secondary-200 text-secondary-600 transition hover:bg-primary-50 disabled:opacity-50"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

function StudentRosterCard({ item }) {
  const s = item.student
  const p = item.prediction
  const riskProb = p?.risk_probability != null ? (p.risk_probability * 100) : 0
  const flags = Array.isArray(p?.flags) ? p.flags : []
  const initials = (s?.student_identifier || 'XX').substring(0, 2).toUpperCase()

  return (
    <article className="rounded-2xl border border-primary-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-sm font-bold text-primary-700">{initials}</span>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-primary-950">{s?.student_identifier || 'Unknown'}</p>
            <p className="mt-0.5 text-sm text-secondary-500">Grade {s?.grade} • Age {s?.age}</p>
          </div>
        </div>
        <RiskBadge risk={p?.risk_level || 'Unknown'} />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-500">Risk Probability</p>
        <PriorityScore score={riskProb} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {flags.length > 0
          ? flags.slice(0, 3).map((f, i) => <span key={i} className="rounded-lg border border-primary-200 bg-primary-50 px-2 py-1 text-xs font-medium text-secondary-700">{f}</span>)
          : <span className="text-xs text-secondary-400">No flags</span>}
      </div>

      <a href={`#student/${s?.student_id}`} className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl border border-primary-700 bg-white px-3.5 text-sm font-bold text-primary-700 transition hover:bg-primary-50">
        View Details
      </a>
    </article>
  )
}

function LoadingSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[1720px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="mb-7">
        <div className="h-9 w-48 animate-pulse rounded-xl bg-primary-100" />
        <div className="mt-3 h-5 w-80 animate-pulse rounded-xl bg-primary-100" />
      </div>
      <div className="h-16 animate-pulse rounded-2xl bg-primary-100" />
      <div className="mt-6 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-primary-50 border border-primary-100" />)}
      </div>
    </section>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <section className="mx-auto w-full max-w-[1720px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
        <AlertCircle size={48} className="mb-4 text-red-400" />
        <h3 className="font-heading text-lg font-bold text-red-800">Gagal Memuat Data Siswa</h3>
        <p className="mt-2 max-w-md text-sm text-red-600">{message}</p>
        <button onClick={onRetry} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700">
          <RefreshCw size={16} /> Coba Lagi
        </button>
      </div>
    </section>
  )
}

function EmptyState({ onAdd }) {
  return (
    <section className="mx-auto w-full max-w-[1720px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="mb-7">
        <h2 className="font-heading text-3xl font-extrabold text-primary-950">Student Roster</h2>
        <p className="mt-2 text-base text-secondary-600">Prioritized list of students requiring intervention.</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-primary-200 bg-white px-6 py-16 text-center shadow-sm">
        <Upload size={48} className="mb-4 text-primary-300" />
        <h3 className="font-heading text-lg font-bold text-primary-950">Belum Ada Data Siswa</h3>
        <p className="mt-2 max-w-md text-sm text-secondary-500">Upload file CSV data siswa atau tambah secara manual untuk melihat daftar siswa beserta analisis risikonya.</p>
        <div className="mt-6 flex gap-3">
          <a href="#upload" className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary-700/25 transition hover:bg-primary-800">
            Upload CSV
          </a>
          <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-xl border border-primary-700 px-5 py-2.5 text-sm font-bold text-primary-700 transition hover:bg-primary-50">
            <Plus size={16} /> Tambah Siswa
          </button>
        </div>
      </div>
    </section>
  )
}

export default function StudentRoster() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [riskLevel, setRiskLevel] = useState('All Risk Levels')
  const [gradeFilter, setGradeFilter] = useState('All Grades')
  const [genderFilter, setGenderFilter] = useState('All Genders')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)
  const [isDeletingAll, setIsDeletingAll] = useState(false)
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getStudents()
      setStudents(result?.data || [])
    } catch (err) {
      setError(err.message || 'Gagal memuat data siswa.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // Sync Search Query with global Hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.startsWith('#roster?q=')) {
        setSearchQuery(decodeURIComponent(hash.split('?q=')[1] || ''))
      } else if (hash === '#roster') {
        setSearchQuery('')
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleAddStudent = async (data) => {
    setIsSubmitting(true)
    try {
      await addStudent(data)
      setIsAddModalOpen(false)
      fetchData() // Refresh list
    } catch (err) {
      alert(err.message || 'Gagal menambahkan siswa')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAllStudents = async () => {
    const total = uniqueStudents.length
    if (total === 0 || isDeletingAll) return

    const confirmed = window.confirm(
      `Yakin ingin menghapus semua data siswa (${total} siswa)? Semua prediksi dan riwayat intervensi juga akan dihapus dan tidak dapat dikembalikan.`
    )
    if (!confirmed) return

    setIsDeletingAll(true)
    try {
      await deleteAllStudents()
      setStudents([])
      setSearchQuery('')
      setRiskLevel('All Risk Levels')
      setGradeFilter('All Grades')
      setGenderFilter('All Genders')
      setCurrentPage(1)
    } catch (err) {
      alert(err.message || 'Gagal menghapus semua data siswa')
    } finally {
      setIsDeletingAll(false)
    }
  }

  const uniqueStudents = useMemo(() => {
    const studentMap = new Map()
    students.forEach(item => {
      const existing = studentMap.get(item.student?.student_id)
      if (!existing || new Date(item.prediction?.created_at) > new Date(existing.prediction?.created_at)) {
        studentMap.set(item.student?.student_id, item)
      }
    })
    return Array.from(studentMap.values())
  }, [students])

  const handleExport = (format) => {
    setIsExportMenuOpen(false)
    if (uniqueStudents.length === 0) return

    const exportData = sortedStudents.map(item => {
      const s = item.student
      const p = item.prediction
      return {
        'Student ID': s.student_identifier,
        'Risk Level': p?.risk_level,
        'Risk Probability (%)': p?.risk_probability ? (p.risk_probability * 100).toFixed(1) : 0,
        'Flags': Array.isArray(p?.flags) ? p.flags.join(', ') : '',
        'Age': s.age,
        'Grade': s.grade,
        'Gender': s.gender,
        'GPA': s.gpa,
        'Attendance Rate': s.attendance_rate,
      }
    })

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Students")

    if (format === 'csv') {
      XLSX.writeFile(wb, "Artha_Students.csv")
    } else {
      XLSX.writeFile(wb, "Artha_Students.xlsx")
    }
  }

  const riskOptions = useMemo(() => ['All Risk Levels', ...Array.from(new Set(uniqueStudents.map(s => s.prediction?.risk_level).filter(Boolean)))], [uniqueStudents])
  const gradeOptions = useMemo(() => ['All Grades', ...Array.from(new Set(uniqueStudents.map(s => s.student?.grade).filter(Boolean))).sort((a,b) => a-b)], [uniqueStudents])
  const genderOptions = useMemo(() => ['All Genders', ...Array.from(new Set(uniqueStudents.map(s => s.student?.gender).filter(Boolean)))], [uniqueStudents])

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return uniqueStudents.filter((item) => {
      const matchesRisk = riskLevel === 'All Risk Levels' || item.prediction?.risk_level === riskLevel
      const matchesGrade = gradeFilter === 'All Grades' || String(item.student?.grade) === String(gradeFilter)
      const matchesGender = genderFilter === 'All Genders' || item.student?.gender === genderFilter

      if (!matchesRisk || !matchesGrade || !matchesGender) return false
      if (q === '') return true
      return [item.student?.student_identifier, item.student?.student_id, item.prediction?.risk_level].filter(Boolean).join(' ').toLowerCase().includes(q)
    })
  }, [uniqueStudents, riskLevel, gradeFilter, genderFilter, searchQuery])

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 }
      const d = (order[a.prediction?.risk_level] ?? 3) - (order[b.prediction?.risk_level] ?? 3)
      return d !== 0 ? d : (b.prediction?.risk_probability || 0) - (a.prediction?.risk_probability || 0)
    })
  }, [filteredStudents])

  // Reset pagination if filters change
  useEffect(() => { setCurrentPage(1) }, [filteredStudents.length])

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedStudents.slice(start, start + itemsPerPage)
  }, [sortedStudents, currentPage])

  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage) || 1

  if (loading) return <AppShell activeView="roster"><LoadingSkeleton /></AppShell>
  if (error) return <AppShell activeView="roster"><ErrorState message={error} onRetry={fetchData} /></AppShell>
  
  if (students.length === 0 && !isAddModalOpen) {
    return <AppShell activeView="roster"><EmptyState onAdd={() => setIsAddModalOpen(true)} /></AppShell>
  }

  return (
    <AppShell activeView="roster">
      <section className="mx-auto w-full max-w-[1720px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-primary-950">Student Roster</h2>
            <p className="mt-2 max-w-3xl text-base leading-6 text-secondary-600">Prioritized list of unique students requiring intervention.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDeleteAllStudents}
              disabled={isDeletingAll || uniqueStudents.length === 0}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-bold text-red-700 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              <Trash2 size={16} /> {isDeletingAll ? 'Deleting...' : 'Delete All'}
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 text-sm font-bold text-white shadow-md shadow-primary-700/25 transition hover:bg-primary-800 sm:flex-none">
              <Plus size={16} /> Add Student
            </button>
            <div
              className="relative flex-1 sm:flex-none"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setIsExportMenuOpen(false)
                }
              }}
            >
              <button
                type="button"
                onClick={() => setIsExportMenuOpen((open) => !open)}
                aria-expanded={isExportMenuOpen}
                aria-haspopup="menu"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-secondary-300 bg-white px-4 text-sm font-bold text-secondary-700 shadow-sm transition hover:bg-secondary-50 sm:w-auto"
              >
                <Download size={16} /> Export
              </button>
              <div className={`absolute right-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-xl border border-primary-200 bg-white shadow-lg ${isExportMenuOpen ? 'flex flex-col' : 'hidden'}`} role="menu">
                <button type="button" onClick={() => handleExport('csv')} className="px-4 py-2.5 text-left text-sm font-semibold text-secondary-700 hover:bg-primary-50" role="menuitem">CSV</button>
                <button type="button" onClick={() => handleExport('xlsx')} className="px-4 py-2.5 text-left text-sm font-semibold text-secondary-700 hover:bg-primary-50" role="menuitem">Excel (XLSX)</button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-primary-200 bg-primary-50 px-4 py-4 sm:px-6">
          <div className="grid gap-3 lg:grid-cols-4 lg:items-center">
            <FilterSelect label="Risk Level" options={riskOptions} value={riskLevel} onChange={setRiskLevel} />
            <FilterSelect label="Grade" options={gradeOptions} value={gradeFilter} onChange={setGradeFilter} />
            <FilterSelect label="Gender" options={genderOptions} value={genderFilter} onChange={setGenderFilter} />
            <label className="relative block">
              <span className="sr-only">Search student</span>
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search identifier or ID..."
                className="h-10 w-full rounded-xl bg-white pl-10 pr-3 text-sm text-primary-950 outline-none ring-1 ring-transparent transition placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-300"
              />
            </label>
          </div>
        </div>

        {/* Student Table */}
        {uniqueStudents.length > 0 && (
          <>
          <section className="mt-6 space-y-3 md:hidden">
            {paginatedStudents.map((item) => (
              <StudentRosterCard key={item.student?.student_id} item={item} />
            ))}
            {paginatedStudents.length === 0 && (
              <div className="rounded-2xl border border-primary-200 bg-white px-6 py-12 text-center text-sm font-medium text-secondary-500 shadow-sm">
                No students match the current search and filters.
              </div>
            )}
          </section>

          <section className="mt-6 hidden overflow-hidden rounded-2xl border border-primary-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse text-left">
                <thead className="border-b border-primary-100 bg-primary-50 text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-600">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Risk Probability</th>
                    <th className="px-6 py-4">Risk Level</th>
                    <th className="px-6 py-4">Risk Flags</th>
                    <th className="min-w-[150px] px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100">
                  {paginatedStudents.map((item) => {
                    const s = item.student, p = item.prediction
                    const riskProb = p?.risk_probability != null ? (p.risk_probability * 100) : 0
                    const flags = Array.isArray(p?.flags) ? p.flags : []
                    const initials = (s?.student_identifier || 'XX').substring(0, 2).toUpperCase()

                    return (
                      <tr key={s?.student_id} className="hover:bg-primary-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-sm font-bold text-primary-700">{initials}</span>
                            <div>
                              <p className="text-base font-bold text-primary-950">{s?.student_identifier || 'Unknown'}</p>
                              <p className="mt-0.5 text-sm text-secondary-500">Grade {s?.grade} • Age {s?.age}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><PriorityScore score={riskProb} /></td>
                        <td className="px-6 py-4"><RiskBadge risk={p?.risk_level || 'Unknown'} /></td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {flags.length > 0
                              ? flags.slice(0, 3).map((f, i) => <span key={i} className="rounded-lg bg-primary-50 border border-primary-200 px-2 py-1 text-xs font-medium text-secondary-700">{f}</span>)
                              : <span className="text-xs text-secondary-400">No flags</span>}
                          </div>
                        </td>
                        <td className="min-w-[150px] px-6 py-4 text-right">
                          <a href={`#student/${s?.student_id}`} className="inline-flex whitespace-nowrap rounded-xl border border-primary-700 bg-white px-3.5 py-2 text-sm font-bold text-primary-700 transition hover:bg-primary-50">
                            View Details
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                  {paginatedStudents.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-sm font-medium text-secondary-500">No students match the current search and filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {sortedStudents.length > itemsPerPage && (
              <div className="flex items-center justify-between border-t border-primary-100 bg-white px-6 py-4">
                <p className="text-sm text-secondary-500">
                  Showing <span className="font-bold text-primary-950">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-primary-950">{Math.min(currentPage * itemsPerPage, sortedStudents.length)}</span> of <span className="font-bold text-primary-950">{sortedStudents.length}</span> results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-secondary-200 text-secondary-600 hover:bg-primary-50 disabled:opacity-50 transition"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-secondary-200 text-secondary-600 hover:bg-primary-50 disabled:opacity-50 transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </section>
          <div className="md:hidden">
            {sortedStudents.length > itemsPerPage && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={sortedStudents.length}
                onPrevious={() => setCurrentPage(p => Math.max(1, p - 1))}
                onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              />
            )}
          </div>
          </>
        )}

        <StudentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddStudent}
          loading={isSubmitting}
        />
      </section>
    </AppShell>
  )
}
