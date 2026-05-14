import { uploadCSV } from './uploadService'

const listeners = new Set()

let status = null
let result = null
let activeTask = null

function notify() {
  listeners.forEach((listener) => listener({ status, result }))
  window.dispatchEvent(new CustomEvent('csv-upload-status', { detail: status }))
}

function setStatus(nextStatus) {
  status = nextStatus
  notify()
}

export function subscribeUploadTask(listener) {
  listeners.add(listener)
  listener({ status, result })
  return () => listeners.delete(listener)
}

export function getUploadTaskSnapshot() {
  return { status, result, isUploading: Boolean(status?.loading) }
}

export function clearUploadTaskResult() {
  result = null
  if (!status?.loading) {
    status = null
  }
  notify()
}

export function dismissUploadTaskStatus() {
  if (!status?.loading) {
    status = null
    notify()
  }
}

export async function startCSVUpload(file) {
  if (activeTask) {
    return activeTask
  }

  result = null
  setStatus({
    loading: true,
    title: 'Mengupload CSV...',
    message: `Memproses ${file.name} di latar belakang.`,
    fileName: file.name,
  })

  activeTask = uploadCSV(file)
    .then((data) => {
      const predictions = data?.predictions || []
      result = {
        message: data?.message || 'Upload berhasil!',
        total: predictions.length,
        atRisk: predictions.filter((p) => p.is_at_risk).length,
        predictions,
      }
      setStatus({
        loading: false,
        title: 'Upload Selesai',
        message: `${predictions.length} siswa berhasil diproses.`,
      })
      return data
    })
    .catch((err) => {
      const message = err.message || 'Gagal mengupload file CSV.'
      setStatus({
        loading: false,
        error: true,
        title: 'Upload Gagal',
        message,
      })
      throw err
    })
    .finally(() => {
      activeTask = null
    })

  return activeTask
}
