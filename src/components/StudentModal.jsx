import { useEffect, useState } from 'react'
import { AlertCircle, Bot, Loader2, X } from 'lucide-react'

const features = [
  { name: 'student_identifier', label: 'Nama/Identifier', type: 'text', placeholder: 'Budi Santoso', help: 'Nama atau ID unik siswa' },
  { name: 'age', label: 'Age', type: 'number', min: 10, max: 30, help: 'Umur siswa (10 - 30)' },
  { name: 'grade', label: 'Grade', type: 'number', min: 1, max: 12, help: 'Kelas / Tingkat (1 - 12)' },
  { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'], help: 'Jenis kelamin siswa' },
  { name: 'race', label: 'Race/Ethnicity', type: 'select', options: ['Caucasian', 'African American', 'Asian', 'Hispanic', 'Other'], help: 'Ras/Etnis' },
  { name: 'ses_quartile', label: 'SES Quartile', type: 'number', min: 1, max: 4, help: 'Kuartil status sosial ekonomi (1=Rendah, 4=Tinggi)' },
  { name: 'parental_education', label: 'Parental Education', type: 'select', options: ['High School', 'Some College', 'Bachelors', 'Masters', 'PhD'], help: 'Pendidikan tertinggi orang tua' },
  { name: 'school_type', label: 'School Type', type: 'select', options: ['Public', 'Private'], help: 'Tipe sekolah' },
  { name: 'locale', label: 'Locale', type: 'select', options: ['Urban', 'Suburban', 'Rural'], help: 'Lokasi tempat tinggal' },
  { name: 'test_score_math', label: 'Math Score', type: 'number', step: '0.1', help: 'Nilai ujian Matematika (0 - 100)' },
  { name: 'test_score_reading', label: 'Reading Score', type: 'number', step: '0.1', help: 'Nilai ujian Membaca (0 - 100)' },
  { name: 'test_score_science', label: 'Science Score', type: 'number', step: '0.1', help: 'Nilai ujian Sains (0 - 100)' },
  { name: 'gpa', label: 'GPA', type: 'number', step: '0.01', help: 'IPK / Nilai Rata-rata (0.00 - 4.00)' },
  { name: 'attendance_rate', label: 'Attendance Rate (%)', type: 'number', step: '0.1', help: 'Persentase kehadiran (0 - 100)' },
  { name: 'study_hours', label: 'Study Hours/Week', type: 'number', step: '0.1', help: 'Jam belajar di luar sekolah per minggu' },
  { name: 'internet_access', label: 'Internet Access', type: 'select', options: ['1', '0'], help: '1 = Ada, 0 = Tidak Ada' },
  { name: 'extracurricular', label: 'Extracurricular', type: 'select', options: ['1', '0'], help: '1 = Aktif, 0 = Tidak' },
  { name: 'part_time_job', label: 'Part-time Job', type: 'select', options: ['1', '0'], help: '1 = Bekerja, 0 = Tidak' },
  { name: 'parent_support', label: 'Parent Support', type: 'select', options: ['1', '0'], help: '1 = Ya, 0 = Tidak' },
  { name: 'romantic', label: 'Romantic Rel.', type: 'select', options: ['1', '0'], help: '1 = Ya, 0 = Tidak' },
  { name: 'free_time', label: 'Free Time (1-5)', type: 'number', min: 1, max: 5, help: 'Waktu luang (1=Sangat sedikit, 5=Sangat banyak)' },
  { name: 'go_out', label: 'Go Out (1-5)', type: 'number', min: 1, max: 5, help: 'Frekuensi keluar main (1=Jarang, 5=Sering)' },
]

export default function StudentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
  title,
  submitLabel,
  lockedFields = [],
}) {
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData)
      } else {
        const defaultData = {}
        features.forEach(f => {
          if (f.type === 'number') defaultData[f.name] = 0
          else if (f.type === 'select') defaultData[f.name] = f.options[0]
          else defaultData[f.name] = ''
        })
        setFormData(defaultData)
      }
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' || (features.find(f => f.name === name)?.options?.includes('1') && !isNaN(value)) ? Number(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Convert string '1'/'0' back to numbers for boolean selects
    const formattedData = { ...formData }
    features.forEach(f => {
      if (f.options && f.options.includes('1') && typeof formattedData[f.name] === 'string') {
        formattedData[f.name] = Number(formattedData[f.name])
      }
    })
    onSubmit(formattedData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-primary-950/60 p-4 backdrop-blur-sm sm:p-0">
      <div className="relative w-full max-w-4xl rounded-2xl border border-primary-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-primary-100 bg-primary-50/50 px-6 py-4 rounded-t-2xl">
          <h3 className="font-heading text-xl font-bold text-primary-950">
            {title || (initialData ? 'Edit Data Siswa' : 'Tambah Siswa Baru')}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-secondary-400 transition hover:bg-primary-100 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-primary-700 px-6 py-3 text-white flex items-center gap-3">
          <Bot size={18} className="text-primary-200" />
          <p className="text-sm font-medium">
            AI Model akan otomatis memproses ulang Prediksi Risiko & Rekomendasi Intervensi TOPSIS setelah Anda menyimpan data ini.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid max-h-[55vh] grid-cols-1 gap-x-6 gap-y-5 overflow-y-auto p-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.name} className="flex flex-col">
                <label className="mb-1 block text-xs font-bold text-primary-950">{f.label}</label>
                {f.type === 'select' ? (
                  <select
                    name={f.name}
                    value={formData[f.name] !== undefined ? String(formData[f.name]) : ''}
                    onChange={handleChange}
                    required
                    disabled={lockedFields.includes(f.name)}
                    className="w-full rounded-xl border border-secondary-200 bg-primary-50/50 px-3 py-2 text-sm text-primary-950 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {f.options.map(opt => <option key={opt} value={opt}>{opt === '1' ? '1 (Yes)' : opt === '0' ? '0 (No)' : opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    name={f.name}
                    value={formData[f.name] ?? ''}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    required
                    disabled={lockedFields.includes(f.name)}
                    className="w-full rounded-xl border border-secondary-200 bg-primary-50/50 px-3 py-2 text-sm text-primary-950 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                )}
                <p className="mt-1 text-[10px] font-semibold text-secondary-500">{f.help}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-primary-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-secondary-600 transition hover:bg-secondary-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-primary-700/25 transition hover:bg-primary-800 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {submitLabel || (initialData ? 'Simpan & Analisis Ulang' : 'Tambah & Analisis AI')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
