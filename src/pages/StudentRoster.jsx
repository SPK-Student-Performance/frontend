import { useMemo, useState } from 'react'
import { ChevronDown, Download, Search } from 'lucide-react'
import AppShell from '../components/AppShell'

const rosterStudents = [
  {
    initials: 'MJ',
    name: 'Marcus Johnson',
    id: '847291',
    className: 'AP Physics',
    gradeLevel: '12th Grade',
    score: 94,
    risk: 'At-Risk',
    factors: ['Consecutive Absences', 'Failing Grade'],
  },
  {
    initials: 'SC',
    name: 'Sarah Chen',
    id: '847292',
    className: 'Calculus II',
    gradeLevel: '11th Grade',
    score: 88,
    risk: 'At-Risk',
    factors: ['No LMS Activity', 'Low Midterm'],
  },
  {
    initials: 'DR',
    name: 'David Rodriguez',
    id: '847293',
    className: 'World History',
    gradeLevel: '10th Grade',
    score: 65,
    risk: 'Monitoring',
    factors: ['Missed Assignment'],
  },
  {
    initials: 'EW',
    name: 'Emily Watson',
    id: '847294',
    className: 'Literature',
    gradeLevel: '12th Grade',
    score: 24,
    risk: 'Safe',
    factors: ['Minor Grade Drop'],
  },
]

const riskClasses = {
  'At-Risk': 'border-red-200 bg-red-100 text-red-700',
  Monitoring: 'border-blue-200 bg-blue-100 text-blue-700',
  Safe: 'border-emerald-200 bg-emerald-100 text-emerald-700',
}

const gradeOptions = ['All Grade Levels', '10th Grade', '11th Grade', '12th Grade']
const classOptions = [
  'All Classes',
  ...Array.from(new Set(rosterStudents.map((student) => student.className))),
]
const riskOptions = ['All Risk Levels', 'At-Risk', 'Monitoring', 'Safe']

function scoreTone(score) {
  if (score >= 80) {
    return {
      text: 'text-red-600',
      bar: 'bg-red-500',
    }
  }

  if (score >= 50) {
    return {
      text: 'text-orange-600',
      bar: 'bg-orange-500',
    }
  }

  return {
    text: 'text-emerald-600',
    bar: 'bg-emerald-500',
  }
}

function FilterSelect({ label, options, value, onChange }) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-lg bg-white px-3.5 pr-9 text-sm text-slate-600 outline-none ring-1 ring-transparent transition hover:ring-blue-100 focus:ring-2 focus:ring-teal-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
        aria-hidden="true"
      />
    </label>
  )
}

function PriorityScore({ score }) {
  const tone = scoreTone(score)

  return (
    <div className="flex min-w-[220px] items-center gap-3">
      <div className="w-16 whitespace-nowrap">
        <span className={`text-2xl font-bold ${tone.text}`}>{score}</span>
        <span className="ml-0.5 text-sm text-slate-400">/100</span>
      </div>
      <div className="h-2 flex-1 rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full ${tone.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

function RiskBadge({ risk }) {
  return (
    <span
      className={`inline-flex rounded-lg border px-2 py-1 text-xs font-semibold ${riskClasses[risk]}`}
    >
      {risk}
    </span>
  )
}

export default function StudentRoster() {
  const [gradeLevel, setGradeLevel] = useState('All Grade Levels')
  const [className, setClassName] = useState('All Classes')
  const [riskLevel, setRiskLevel] = useState('All Risk Levels')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStudents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return rosterStudents.filter((student) => {
      const matchesGrade =
        gradeLevel === 'All Grade Levels' || student.gradeLevel === gradeLevel
      const matchesClass =
        className === 'All Classes' || student.className === className
      const matchesRisk =
        riskLevel === 'All Risk Levels' || student.risk === riskLevel
      const searchableText = [
        student.name,
        student.id,
        student.className,
        student.gradeLevel,
        student.risk,
        ...student.factors,
      ]
        .join(' ')
        .toLowerCase()
      const matchesSearch =
        normalizedQuery === '' || searchableText.includes(normalizedQuery)

      return matchesGrade && matchesClass && matchesRisk && matchesSearch
    })
  }, [className, gradeLevel, riskLevel, searchQuery])

  return (
    <AppShell activeView="roster">
      <section className="mx-auto w-full max-w-[1720px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Student Roster
            </h2>
            <p className="mt-2 max-w-3xl text-base leading-6 text-slate-600">
              Prioritized list of students requiring intervention based on
              academic, attendance, and behavioral scores.
            </p>
          </div>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">
            <Download size={16} aria-hidden="true" />
            Export CSV
          </button>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 sm:px-6">
          <div className="grid gap-3 lg:grid-cols-4">
            <FilterSelect
              label="Grade Level"
              options={gradeOptions}
              value={gradeLevel}
              onChange={setGradeLevel}
            />
            <FilterSelect
              label="Class"
              options={classOptions}
              value={className}
              onChange={setClassName}
            />
            <FilterSelect
              label="Risk Level"
              options={riskOptions}
              value={riskLevel}
              onChange={setRiskLevel}
            />
            <label className="relative block">
              <span className="sr-only">Search student name or ID</span>
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search student name or ID..."
                className="h-10 w-full rounded-lg bg-white pl-10 pr-3 text-sm text-slate-700 outline-none ring-1 ring-transparent transition placeholder:text-slate-500 focus:ring-2 focus:ring-teal-200"
              />
            </label>
          </div>
        </div>

        <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">DSS Priority Score</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4">Key Factors</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/80">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                          {student.initials}
                        </span>
                        <div>
                          <p className="text-base font-bold text-slate-900">
                            {student.name}
                          </p>
                          <p className="mt-0.5 text-sm text-slate-500">
                            ID: {student.id} • {student.className}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <PriorityScore score={student.score} />
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge risk={student.risk} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {student.factors.map((factor) => (
                          <span
                            key={factor}
                            className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-slate-700"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg border border-teal-600 bg-white px-3 py-2 text-sm font-medium text-teal-600 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-200">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-sm font-medium text-slate-500"
                    >
                      No students match the current search and filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </AppShell>
  )
}
