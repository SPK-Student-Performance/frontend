import { useEffect, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  XCircle,
} from 'lucide-react'
import AppShell from '../components/AppShell'
import {
  clearUploadTaskResult,
  getUploadTaskSnapshot,
  startCSVUpload,
  subscribeUploadTask,
} from '../services/uploadTaskStore'
// @ts-ignore (ignore vite import warning if any)
import sampleCsvUrl from '../assets/data_sample.csv?url'

export default function UploadCSV() {
  const initialUpload = getUploadTaskSnapshot()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(initialUpload.isUploading)
  const [error, setError] = useState('')
  const [result, setResult] = useState(initialUpload.result)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    return subscribeUploadTask(({ status, result: taskResult }) => {
      setLoading(Boolean(status?.loading))
      setResult(taskResult)
      if (status?.error) {
        setError(status.message || 'Gagal mengupload file CSV.')
      }
      if (status?.loading) {
        setError('')
      }
    })
  }, [])

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (!selected.name.endsWith('.csv')) { setError('Format file harus CSV (.csv)'); setFile(null); return }
      clearUploadTaskResult()
      setFile(selected); setError(''); setResult(null)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) {
      if (!dropped.name.endsWith('.csv')) { setError('Format file harus CSV (.csv)'); setFile(null); return }
      clearUploadTaskResult()
      setFile(dropped); setError(''); setResult(null)
    }
  }

  const handleUseSample = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      const response = await fetch(sampleCsvUrl)
      if (!response.ok) throw new Error('Network response was not ok')
      const blob = await response.blob()
      const sampleFile = new File([blob], 'data_sample.csv', { type: 'text/csv' })
      setFile(sampleFile)
    } catch (err) {
      setError('Gagal memuat sample CSV: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { setError('Pilih file CSV terlebih dahulu.'); return }
    
    setLoading(true); setError(''); setResult(null)

    try {
      await startCSVUpload(file)
      setFile(null)
    } catch (err) { 
      const errMsg = err.message || 'Gagal mengupload file CSV.'
      setError(errMsg)
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <AppShell activeView="upload">
      <section className="mx-auto w-full max-w-[800px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-primary-950">Upload Student Data</h2>
            <p className="mt-2 text-base text-secondary-600">
              Upload file CSV berisi data siswa untuk dianalisis oleh sistem AI.
              Sistem akan memprediksi risiko siswa dan memberikan rekomendasi intervensi.
            </p>
          </div>
          <a
            href={sampleCsvUrl}
            download="data_sample.csv"
            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-xl border border-secondary-300 bg-white px-4 text-sm font-bold text-secondary-700 shadow-sm transition hover:bg-secondary-50"
          >
            <Download size={16} /> Download Sample CSV
          </a>
        </div>

        {/* Success */}
        {result && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={24} className="mt-0.5 text-emerald-600" />
              <div className="flex-1">
                <h3 className="font-heading text-lg font-bold text-emerald-800">{result.message}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {[
                    { val: result.total, label: 'Total Diproses', color: 'text-primary-950' },
                    { val: result.atRisk, label: 'At-Risk', color: 'text-red-600' },
                    { val: result.total - result.atRisk, label: 'Safe', color: 'text-emerald-600' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-white px-4 py-3 text-center shadow-sm border border-emerald-100">
                      <p className={`font-heading text-2xl font-extrabold ${item.color}`}>{item.val}</p>
                      <p className="text-xs font-semibold text-secondary-500">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={() => { window.location.hash = 'dashboard' }} className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary-700/25 transition hover:bg-primary-800">
                    Lihat Dashboard
                  </button>
                  <button onClick={() => { clearUploadTaskResult(); setResult(null); setFile(null) }} className="inline-flex items-center gap-2 rounded-xl border border-secondary-300 bg-white px-5 py-2.5 text-sm font-semibold text-secondary-600 hover:bg-secondary-50">
                    Upload File Lain
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /><span>{error}</span>
          </div>
        )}

        {/* Upload Form */}
        {!result && (
          <form onSubmit={handleSubmit}>
            <div
              className={`relative rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-all ${
                dragActive ? 'border-primary-500 bg-primary-50' :
                file ? 'border-primary-400 bg-primary-50/40' :
                'border-secondary-300 bg-white hover:border-primary-300'
              }`}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            >
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <FileSpreadsheet size={48} className="text-primary-600" />
                  <div>
                    <p className="text-base font-bold text-primary-950">{file.name}</p>
                    <p className="mt-1 text-sm text-secondary-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button type="button" onClick={() => { setFile(null); setError('') }} disabled={loading} className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                    <XCircle size={14} /> Hapus File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload size={48} className="text-secondary-300" />
                  <div>
                    <p className="text-base font-bold text-secondary-700">Drag & drop file CSV di sini</p>
                    <p className="mt-1 text-sm text-secondary-500">atau pilih file secara manual</p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-secondary-300 bg-white px-5 py-2.5 text-sm font-semibold text-secondary-600 hover:bg-primary-50 transition">
                      <FileSpreadsheet size={16} /> Pilih File CSV
                      <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                    </label>
                    <button type="button" onClick={handleUseSample} className="inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-5 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition">
                      Gunakan Sample CSV
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Format Guide */}
            <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50 px-5 py-4">
              <h4 className="font-heading text-sm font-bold text-primary-800">Format CSV yang Diterima</h4>
              <p className="mt-1 text-xs text-primary-700">
                File CSV harus memiliki minimal 21 kolom fitur sesuai format dataset.
                Kolom opsional pertama: student_identifier (jika 22 kolom).
              </p>
              <p className="mt-2 text-[11px] font-medium text-secondary-600">
                Kolom: age, grade, gender, race, ses_quartile, parental_education, school_type,
                locale, test_score_math, test_score_reading, test_score_science, gpa,
                attendance_rate, study_hours, internet_access, extracurricular, part_time_job,
                parent_support, romantic, free_time, go_out
              </p>
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-700/25 transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> {file ? 'Mengupload...' : 'Memproses...'} </> : <><Upload size={18} /> Upload & Analisis</>}
            </button>
          </form>
        )}
      </section>
    </AppShell>
  )
}
